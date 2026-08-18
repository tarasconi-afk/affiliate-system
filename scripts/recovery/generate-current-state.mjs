#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaults = {
  repo: resolve(scriptDir, '../..'),
  output: resolve(scriptDir, '../../docs/recovery'),
  ref: 'HEAD',
};

function readArgs(argv) {
  const options = { ...defaults };
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!value || !['--repo', '--output', '--ref'].includes(flag)) {
      throw new Error('usage: generate-current-state.mjs [--repo PATH] [--output PATH] [--ref REF]');
    }
    options[flag.slice(2)] = value;
  }
  return options;
}

const options = readArgs(process.argv.slice(2));
const repoPath = resolve(options.repo);
const outputDir = resolve(options.output);

function git(...args) {
  return execFileSync('git', ['-C', repoPath, ...args], { encoding: 'utf8' }).trim();
}

function readAtCommit(commit, path) {
  return git('show', `${commit}:${path}`);
}

function sanitizeOrigin(value) {
  try {
    const url = new URL(value);
    if (url.username || url.password) {
      url.username = 'REDACTED';
      url.password = '';
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return value;
  }
}

const sourceCommit = git('rev-parse', `${options.ref}^{commit}`);
const packageJson = JSON.parse(readAtCommit(sourceCommit, 'package.json'));
const pagePaths = git('ls-tree', '-r', '--name-only', sourceCommit, '--', 'src/content/pages')
  .split('\n')
  .filter((path) => path.endsWith('.json'));
const pages = pagePaths.map((path) => JSON.parse(readAtCommit(sourceCommit, path)));
const slugs = pages.map((page) => page.slug).sort();
const siteSource = readAtCommit(sourceCommit, 'src/lib/site.ts');
const siteUrl = siteSource.match(/\burl:\s*['"]([^'"]+)['"]/)?.[1];
if (!siteUrl) throw new Error('unable to derive site URL from src/lib/site.ts');

const expectedSitemapUrls = [siteUrl + '/', ...slugs.map((slug) => `${siteUrl}/${slug}/`)];
const lastCommit = {
  hash: git('show', '-s', '--format=%H', sourceCommit),
  authored_at: git('show', '-s', '--format=%aI', sourceCommit),
  subject: git('show', '-s', '--format=%s', sourceCommit),
};
const qaCommands = [
  `npm run build (${packageJson.scripts?.build || 'missing'})`,
  `npm run qa:images (${packageJson.scripts?.['qa:images'] || 'missing'})`,
];
const monetizationActive = pages.some((page) => Boolean(page.monetization?.affiliateUrl));
let packageManager = 'unknown';
try {
  git('cat-file', '-e', `${sourceCommit}:package-lock.json`);
  packageManager = 'npm';
} catch {
  // No package lock is a valid observable state.
}

const state = {
  generated_at: new Date().toISOString(),
  source_commit: sourceCommit,
  source_ref: options.ref,
  origin: sanitizeOrigin(git('remote', 'get-url', 'origin')),
  last_commit: lastCommit,
  article_count: pages.length,
  slugs,
  node: process.version,
  package_manager: packageManager,
  qa_known: qaCommands,
  monetization_active: monetizationActive,
  auto_publish: false,
  sitemap: {
    expected_url_count: expectedSitemapUrls.length,
    expected_urls: expectedSitemapUrls,
    observed_after_build: null,
    note: 'Bare-repository runtime state records the sitemap expected from the preserved PageSpecs; build output is not inferred.',
  },
  external_services_state: {
    hostinger: 'not inspected by this repository script',
    vps: 'not inspected by this repository script',
    search_console: 'not inspected by this repository script',
  },
};

const markdown = `# Estado operacional do recovery

- Gerado em UTC: ${state.generated_at}
- Source commit: \`${state.source_commit}\`
- Source ref: \`${state.source_ref}\`
- Origin: \`${state.origin}\`
- Último commit: \`${lastCommit.hash}\` — ${lastCommit.authored_at} — ${lastCommit.subject}
- Artigos: ${state.article_count}
- Node do gerador: \`${state.node}\`
- Package manager: \`${state.package_manager}\`
- Monetização ativa: ${monetizationActive ? 'sim' : 'não'}
- Publicação automática: não
- Sitemap esperado: ${expectedSitemapUrls.length} URLs

## Slugs

${slugs.map((slug) => `- \`/${slug}/\``).join('\n')}

## QA conhecido

${qaCommands.map((command) => `- \`${command}\``).join('\n')}

## Sitemap esperado

${expectedSitemapUrls.map((url) => `- \`${url}\``).join('\n')}

Este estado foi derivado diretamente da ref preservada. Um mirror bare não possui worktree, portanto nenhum estado clean/dirty é inferido. Estados externos devem ser verificados nos respectivos provedores.
`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'current-state.json'), `${JSON.stringify(state, null, 2)}\n`);
writeFileSync(join(outputDir, 'CURRENT_STATE.generated.md'), markdown);
console.log(`Generated runtime state for ${pages.length} articles at ${sourceCommit}.`);
