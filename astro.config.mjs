import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ferramentaclara.com.br',
  integrations: [],
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
