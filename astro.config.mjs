import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  integrations: [],
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
