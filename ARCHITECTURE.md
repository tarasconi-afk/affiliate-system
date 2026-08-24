# Arquitetura

## Visão geral

O repositório é um site Astro 7 com TypeScript, configurado para geração estática (`output: 'static'`). O Astro renderiza páginas editoriais estruturadas; os dados editoriais ficam em PageSpecs JSON, não dentro de um CMS ou banco de dados representado neste repositório.

- Configuração e scripts: `astro.config.mjs`, `package.json` e `tsconfig.json`.
- Domínio de produção: `https://ferramentaclara.com.br`, definido em `astro.config.mjs` e `src/lib/site.ts`.
- URLs usam diretórios e barra final (`trailingSlash: 'always'`).

## Conteúdo e PageSpecs

A coleção `pages` usa a Content Layer em `src/content.config.ts`, com loader `glob` para os JSONs em `src/content/pages/`. Seu schema Zod usa uma união discriminada por `type` e valida três formatos de PageSpec:

- `model_review`
- `brand_compare`
- `decision_compare`

As interfaces TypeScript correspondentes e o tipo união `PageSpec` ficam em `src/lib/types.ts`. Os PageSpecs atuais são arquivos JSON em:

- `src/content/pages/model-reviews/parafusadeira-dewalt-dcd777-vale-a-pena.json`
- `src/content/pages/brand-compares/bosch-ou-makita-parafusadeira.json`
- `src/content/pages/decision-compares/parafusadeira-12v-ou-18v.json`
- `src/content/pages/decision-compares/parafusadeira-com-ou-sem-impacto.json`
- `src/content/pages/decision-compares/bateria-parafusadeira-serve-em-outra-marca.json`
- `src/content/pages/decision-compares/furadeira-de-impacto-ou-martelete.json`
- `src/content/pages/decision-compares/torque-nm-parafusadeira.json`
- `src/content/pages/decision-compares/parafusadeira-brushless-ou-com-escovas.json`
- `src/content/pages/decision-compares/furadeira-com-fio-ou-a-bateria.json`

Cada PageSpec inclui metadados, mídia editorial, conteúdo próprio do formato e uma lista de evidências. Em análises de modelo, `quickAnswer` e `quickFacts` também vêm do PageSpec. O schema preserva os tipos `SPEC`, `DERIVED`, `OBSERVATION` e `MEASUREMENT`; o build falha para IDs duplicados ou referências inexistentes em `evidenceIds` e `derived_from`.

PageSpecs também podem declarar `contextualLinks` com posição no conteúdo, texto de contexto, anchor e destino. O `ArticleLayout.astro` apenas renderiza essa estrutura: slugs específicos não ficam hardcoded no renderer, e futuras páginas podem adicionar links contextuais sem alterar o layout.

## Renderização e rotas

- `src/pages/[...slug].astro`: rota dinâmica que lê a coleção `pages` em `getStaticPaths()` e gera um artigo estático por PageSpec.
- `src/layouts/ArticleLayout.astro`: renderer genérico dos três formatos, sem conteúdo específico de produto; conecta mídia, tabelas, referências, evidências e metadados estruturados.
- `src/layouts/BaseLayout.astro`: estrutura HTML compartilhada, estilos globais, cabeçalho e rodapé.
- `src/pages/index.astro`: homepage editorial com links para os 9 PageSpecs locais e explicação da metodologia.
- `src/pages/creditos.astro`: página central de autoria, fonte, licença e tratamento das fotografias.
- `src/pages/robots.txt.ts`: bloqueia todo o rastreamento durante o prelaunch e, fora dele, permite rastreamento e informa o sitemap.
- `src/pages/sitemap.xml.ts`: gera XML com a homepage e os artigos da coleção; com os 9 PageSpecs locais atuais, serão geradas 10 URLs indexáveis quando esse estado for publicado.

## Componentes principais

- Estrutura global: `src/components/Header.astro` e `src/components/Footer.astro`.
- Comparações: `src/components/ComparisonTable.astro`.
- Evidências e referências: `src/components/EvidenceList.astro` e `src/components/Sources.astro`.
- SEO e dados estruturados: `src/components/seo/SEOHead.astro`, `src/components/seo/ArticleSchema.astro` e `src/components/seo/BreadcrumbSchema.astro`. Os artigos usam a primeira mídia do PageSpec em `og:image`, `twitter:image` e no Article JSON-LD.
- Canonical: `src/lib/seoHelpers.ts`, usando o domínio central de `src/lib/site.ts`.

## Assets e publicação

Os JPGs originais para rastreabilidade ficam em `assets-source/images/` e não são publicados. Os WebPs usados em produção ficam em `public/images/`; `public/favicon.svg` também é público. O build gera arquivos estáticos, sem framework frontend adicional ou lógica JavaScript cliente própria.

O estado de prelaunch é controlado por `SITE.prelaunch` em `src/lib/site.ts`, atualmente `false`. Nesse estado, as páginas editoriais não recebem o bloqueio de prelaunch e o `robots.txt` permite rastreamento com `Allow: /` e informa o sitemap. A página `/creditos/` continua `noindex, follow` por decisão própria de rota.
