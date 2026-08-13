# Arquitetura

## Visão geral

O repositório é um site Astro 4 com TypeScript, configurado para geração estática (`output: 'static'`). O Astro renderiza páginas editoriais estruturadas; os dados editoriais ficam em PageSpecs JSON, não dentro de um CMS ou banco de dados representado neste repositório.

- Configuração e scripts: `astro.config.mjs`, `package.json` e `tsconfig.json`.
- Domínio de produção: `https://ferramentaclara.com.br`, definido em `astro.config.mjs` e `src/lib/site.ts`.
- URLs usam diretórios e barra final (`trailingSlash: 'always'`).

## Conteúdo e PageSpecs

A Content Collection do tipo `data`, chamada `pages`, é definida em `src/content/config.ts`. Seu schema Zod usa uma união discriminada por `type` e valida três formatos de PageSpec:

- `model_review`
- `brand_compare`
- `decision_compare`

As interfaces TypeScript correspondentes e o tipo união `PageSpec` ficam em `src/lib/types.ts`. Os PageSpecs atuais são arquivos JSON em:

- `src/content/pages/model-reviews/parafusadeira-dewalt-dcd777-vale-a-pena.json`
- `src/content/pages/brand-compares/bosch-ou-makita-parafusadeira.json`
- `src/content/pages/decision-compares/parafusadeira-12v-ou-18v.json`

Cada PageSpec inclui metadados, conteúdo próprio do formato e uma lista de evidências. O schema preserva os tipos `SPEC`, `DERIVED`, `OBSERVATION` e `MEASUREMENT`; evidências `DERIVED` devem declarar `derived_from`. Campos editoriais relevantes referenciam evidências por `evidenceIds`.

## Renderização e rotas

- `src/pages/[...slug].astro`: rota dinâmica que lê a coleção `pages` em `getStaticPaths()` e gera um artigo estático por PageSpec.
- `src/layouts/ArticleLayout.astro`: renderiza os três formatos editoriais e conecta tabelas, referências, evidências e metadados estruturados.
- `src/layouts/BaseLayout.astro`: estrutura HTML compartilhada, estilos globais, cabeçalho e rodapé.
- `src/pages/index.astro`: homepage editorial com links para os três experimentos e explicação da metodologia.
- `src/pages/creditos.astro`: página central de autoria, fonte, licença e tratamento das fotografias.
- `src/pages/robots.txt.ts`: bloqueia todo o rastreamento durante o prelaunch e, fora dele, permite rastreamento e informa o sitemap.
- `src/pages/sitemap.xml.ts`: gera XML com a homepage e os artigos da coleção.

## Componentes principais

- Estrutura global: `src/components/Header.astro` e `src/components/Footer.astro`.
- Comparações: `src/components/ComparisonTable.astro`.
- Evidências e referências: `src/components/EvidenceList.astro` e `src/components/Sources.astro`.
- SEO e dados estruturados: `src/components/seo/SEOHead.astro`, `src/components/seo/ArticleSchema.astro` e `src/components/seo/BreadcrumbSchema.astro`.
- Canonical: `src/lib/seoHelpers.ts`, usando o domínio central de `src/lib/site.ts`.

## Assets e publicação

Assets públicos ficam em `public/`, incluindo `public/favicon.svg` e fotografias em `public/images/`. O build gera arquivos estáticos; não há framework frontend adicional listado nas dependências e não foi observada lógica JavaScript cliente própria.

O estado de prelaunch é controlado por `SITE.prelaunch` em `src/lib/site.ts`, atualmente `true`. Nesse estado, homepage e artigos emitem `noindex, nofollow`, a página de créditos também permanece sem indexação e o `robots.txt` usa `Disallow: /`.
