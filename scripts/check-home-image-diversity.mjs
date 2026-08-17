import { readFileSync } from 'node:fs';

const homepagePath = new URL('../src/pages/index.astro', import.meta.url);
const homepage = readFileSync(homepagePath, 'utf8');
const imagePattern = /<img\b[^>]*\bsrc=(['"])(\/images\/[^'"]+)\1[^>]*>/g;
const occurrences = new Map();

for (const match of homepage.matchAll(imagePattern)) {
  const src = match[2];
  const line = homepage.slice(0, match.index).split('\n').length;
  const lines = occurrences.get(src) ?? [];
  lines.push(line);
  occurrences.set(src, lines);
}

const duplicates = [...occurrences].filter(([, lines]) => lines.length > 1);

if (duplicates.length > 0) {
  console.error('Homepage image diversity check failed:');
  for (const [src, lines] of duplicates) {
    console.error(`- ${src} is repeated at src/pages/index.astro lines ${lines.join(', ')}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Homepage image diversity check passed: ${occurrences.size} local image src values are unique.`);
}
