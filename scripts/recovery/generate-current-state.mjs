#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const outputDir = join(repoRoot, 'docs/recovery');

function git(...args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
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

function jsonFiles(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return jsonFiles(path);
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : [];
  });
}

const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const pageFiles = jsonFiles(join(repoRoot, 'src/content/pages'));
const pages = pageFiles.map((path) => ({
  path: relative(repoRoot, path),
  data: JSON.parse(readFileSync(path, 'utf8')),
}));
const slugs = pages.map(({ data }) => data.slug).sort();
const siteUrl = 'https://ferramentaclara.com.br';
const expectedSitemapUrls = [siteUrl + '/', ...slugs.map((slug) => `${siteUrl}/${slug}/`)];
const sitemapPath = join(repoRoot, 'dist/sitemap.xml');
const observedSitemapUrls = existsSync(sitemapPath)
  ? [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  : [];
const status = git('status', '--porcelain');
const lastCommit = {
  hash: git('log', '-1', '--format=%H'),
  authored_at: git('log', '-1', '--format=%aI'),
  subject: git('log', '-1', '--format=%s'),
};
const qaCommands = [
  `npm run build (${packageJson.scripts?.build || 'missing'})`,
  `npm run qa:images (${packageJson.scripts?.['qa:images'] || 'missing'})`,
];
const monetizationActive = pages.some(({ data }) => Boolean(data.monetization?.affiliateUrl));

const state = {
  generated_at: new Date().toISOString(),
  repo_state: {
    branch: git('branch', '--show-current'),
    head: git('rev-parse', 'HEAD'),
    origin: sanitizeOrigin(git('remote', 'get-url', 'origin')),
    clean: status.length === 0,
    last_commit: lastCommit,
    article_count: pages.length,
    slugs,
    node: process.version,
    package_manager: existsSync(join(repoRoot, 'package-lock.json')) ? 'npm' : 'unknown',
    qa_commands: qaCommands,
    monetization_active: monetizationActive,
    auto_publish: false,
    sitemap: {
      expected: expectedSitemapUrls,
      observed_after_build: observedSitemapUrls,
      matches_expected: observedSitemapUrls.length > 0 &&
        JSON.stringify([...observedSitemapUrls].sort()) === JSON.stringify([...expectedSitemapUrls].sort()),
    },
  },
  external_services_state: {
    hostinger: 'not inspected by this repository script',
    vps: 'not inspected by this repository script',
    search_console: 'not inspected by this repository script',
    note: 'External state must be verified directly with each provider.',
  },
};

const markdown = `# Estado atual gerado

Gerado em UTC: ${state.generated_at}

## REPO STATE

- Branch: \`${state.repo_state.branch}\`
- HEAD: \`${state.repo_state.head}\`
- Origin: \`${state.repo_state.origin}\`
- Worktree limpa: ${state.repo_state.clean ? 'sim' : 'não'}
- Último commit: \`${lastCommit.hash}\` — ${lastCommit.authored_at} — ${lastCommit.subject}
- Artigos: ${state.repo_state.article_count}
- Node: \`${state.repo_state.node}\`
- Package manager: \`${state.repo_state.package_manager}\`
- Monetização ativa: ${monetizationActive ? 'sim' : 'não'}
- Publicação automática: não
- Sitemap observado após build: ${observedSitemapUrls.length ? `${observedSitemapUrls.length} URLs; ${state.repo_state.sitemap.matches_expected ? 'corresponde ao esperado' : 'difere do esperado'}` : 'não disponível'}

### Slugs

${slugs.map((slug) => `- \`/${slug}/\``).join('\n')}

### QA

${qaCommands.map((command) => `- \`${command}\``).join('\n')}

## EXTERNAL SERVICES STATE

- Hostinger: não inspecionada por este script.
- VPS: não inspecionada por este script.
- Search Console: não inspecionado por este script.

Verifique estados externos diretamente nos respectivos provedores; este arquivo não os infere.
`;

writeFileSync(join(outputDir, 'current-state.json'), `${JSON.stringify(state, null, 2)}\n`);
writeFileSync(join(outputDir, 'CURRENT_STATE.generated.md'), markdown);
console.log(`Generated recovery state for ${pages.length} articles.`);
