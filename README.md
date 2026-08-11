# SEO Site Renderer v0

Sistema de renderização de páginas SEO baseado em dados estruturados (PageSpec).

## 🎯 Objetivo

Colocar páginas SEO experimentais no ar rapidamente, mantendo uma base estruturada que pode ser automatizada no futuro.

## 🏗️ Arquitetura

- **Framework:** Astro 4.x (SSG)
- **Validação:** Zod (Content Collections)
- **TypeScript:** Strict mode
- **SEO:** Canonical derivado, Article + BreadcrumbList schemas
- **Output:** HTML estático, zero JavaScript no cliente

## 📁 Estrutura de Diretórios

```
src/
├── content/
│   ├── config.ts                    # Schema Zod (validação obrigatória)
│   └── pages/                       # PageSpecs em JSON
│       ├── model-reviews/
│       ├── brand-compares/
│       └── decision-compares/
├── layouts/
│   ├── BaseLayout.astro
│   └── ArticleLayout.astro          # Layout único para os 3 tipos
├── components/
│   ├── seo/
│   │   ├── SEOHead.astro
│   │   ├── ArticleSchema.astro
│   │   └── BreadcrumbSchema.astro
│   ├── ComparisonTable.astro
│   ├── EvidenceList.astro
│   └── Sources.astro
├── lib/
│   ├── types.ts                     # TypeScript interfaces
│   └── seoHelpers.ts                # buildCanonical(), etc
└── pages/
    ├── [...slug].astro              # Dynamic routing
    ├── sitemap.xml.ts
    └── robots.txt.ts
```

## 📄 Tipos de Página Suportados

### 1. model_review
Análise técnica de um produto específico baseado em especificações e evidências.

### 2. brand_compare
Comparação entre duas marcas em dimensões específicas.

### 3. decision_compare
Comparação entre conceitos/decisões (ex: 12V vs 18V, brushless vs escovado).

## 🧪 Evidence System

Todo claim factual deve ter evidência. Tipos suportados:

- **SPEC:** Especificações do fabricante
- **DERIVED:** Conclusões derivadas de outras evidências
- **OBSERVATION:** Observação direta (fotos, vídeos)
- **MEASUREMENT:** Medições realizadas

### Estrutura de Evidência

```json
{
  "id": "ev_001",
  "evidence_type": "SPEC",
  "claim": "Capacidade de 4.1 litros",
  "source_name": "Manual do fabricante",
  "source_url": "https://example.com/manual.pdf",
  "accessed_at": "2026-08-11T20:00:00Z",
  "notes": "Página 3 do manual",
  "derived_from": ["ev_base"]  // Obrigatório e não-vazio se evidence_type = DERIVED
}
```

## 📝 Como Adicionar um Novo PageSpec

### Passo 1: Criar arquivo JSON

Crie um arquivo em `src/content/pages/{tipo}/{slug}.json`:

```bash
# Exemplo para model_review
src/content/pages/model-reviews/parafusadeira-dewalt-dcd777.json

# Exemplo para brand_compare
src/content/pages/brand-compares/bosch-vs-makita.json

# Exemplo para decision_compare
src/content/pages/decision-compares/12v-vs-18v.json
```

### Passo 2: Estrutura Mínima

#### Model Review
```json
{
  "version": "1.0",
  "type": "model_review",
  "slug": "parafusadeira-dewalt-dcd777",
  "metadata": {
    "title": "DeWalt DCD777: Especificações e Análise Técnica",
    "metaDescription": "Análise técnica da parafusadeira DeWalt DCD777...",
    "publishedAt": "2026-08-11T20:00:00Z",
    "updatedAt": "2026-08-11T20:00:00Z",
    "breadcrumbs": [
      {"name": "Home", "url": "/"},
      {"name": "Parafusadeiras", "url": "/parafusadeiras"},
      {"name": "DeWalt DCD777"}
    ]
  },
  "product": {
    "name": "Parafusadeira DeWalt DCD777",
    "brand": "DeWalt",
    "model": "DCD777"
  },
  "hero": {
    "heading": "DeWalt DCD777: Análise Técnica",
    "subheading": "Especificações baseadas em dados do fabricante"
  },
  "specs": [
    {
      "label": "Tensão",
      "value": "20V MAX",
      "highlight": true,
      "evidenceIds": ["ev_001"]
    }
  ],
  "evidences": [
    {
      "id": "ev_001",
      "evidence_type": "SPEC",
      "claim": "Especificações técnicas oficiais DCD777",
      "source_name": "Manual DeWalt DCD777",
      "source_url": "https://www.dewalt.com/...",
      "accessed_at": "2026-08-11T20:00:00Z"
    }
  ]
}
```

#### Brand Compare
```json
{
  "version": "1.0",
  "type": "brand_compare",
  "slug": "bosch-vs-makita-parafusadeira",
  "metadata": { /* ... */ },
  "hero": {
    "heading": "Bosch vs Makita: Qual Marca Escolher?",
    "subheading": "Comparação técnica entre as marcas"
  },
  "brands": [
    {
      "name": "Bosch",
      "summary": "Marca alemã conhecida por durabilidade"
    },
    {
      "name": "Makita",
      "summary": "Marca japonesa focada em performance"
    }
  ],
  "comparison": {
    "dimensions": [
      {
        "label": "Garantia Média",
        "brand1": "2 anos",
        "brand2": "3 anos",
        "winner": 2,
        "evidenceIds": ["ev_001"]
      }
    ]
  },
  "evidences": [ /* ... */ ]
}
```

#### Decision Compare
```json
{
  "version": "1.0",
  "type": "decision_compare",
  "slug": "parafusadeira-12v-vs-18v",
  "metadata": { /* ... */ },
  "hero": {
    "heading": "12V vs 18V: Qual Voltagem Escolher?",
    "subheading": "Comparação técnica entre voltagens"
  },
  "options": [
    {
      "name": "12V",
      "description": "Mais leve e compacta"
    },
    {
      "name": "18V",
      "description": "Mais potente e versátil"
    }
  ],
  "comparison": {
    "dimensions": [
      {
        "label": "Torque Típico",
        "option1": "30 Nm",
        "option2": "60 Nm",
        "winner": 2,
        "evidenceIds": ["ev_001"]
      }
    ]
  },
  "evidences": [ /* ... */ ]
}
```

### Passo 3: Validar e Build

```bash
npm run build
```

O build falhará se:
- Evidências referenciadas não existirem
- DERIVED não tiver `derived_from`
- Timestamps forem inválidos
- URLs estiverem malformadas
- `specs` ou `comparison.dimensions` não tiverem `evidenceIds`

## 🚀 Comandos

```bash
# Desenvolvimento
npm run dev

# Build (com validação)
npm run build

# Preview do build
npm run preview
```

## ✅ Validações Automáticas (Zod)

- ✅ Specs devem ter `evidenceIds` obrigatório
- ✅ Comparison dimensions devem ter `evidenceIds` obrigatório
- ✅ DERIVED evidence deve ter `derived_from` array não-vazio
- ✅ Timestamps devem ser ISO 8601 válidos
- ✅ URLs devem ser válidas (quando presentes)
- ✅ Type-safe: TypeScript valida toda a estrutura

## 🔧 SEO Automático

Cada página gera automaticamente:
- **Meta tags:** title, description, canonical
- **Open Graph:** og:title, og:description, og:url, og:type
- **Twitter Cards:** twitter:card, twitter:title, twitter:description
- **JSON-LD:** Article schema + BreadcrumbList schema
- **Sitemap:** `/sitemap.xml` (gerado dinamicamente)
- **Robots:** `/robots.txt`

## 📦 Output

Build gera em `/dist`:
- `/[slug]/index.html` para cada PageSpec
- `/sitemap.xml`
- `/robots.txt`
- HTML estático, sem JavaScript

## 🎨 Canonical Derivado

O canonical URL é gerado automaticamente:

```typescript
// Não repita manualmente em cada JSON:
"canonical": "https://example.com/slug"  // ❌

// Use apenas o slug:
"slug": "parafusadeira-dewalt-dcd777"    // ✅

// O canonical é derivado via buildCanonical(slug)
```

## 🔮 Futuro

Esta estrutura está preparada para:
- n8n gerar PageSpecs automaticamente
- Validação pre-commit via Git hooks
- CI/CD: push → validação → build → deploy
- Expansão para novos tipos de página

## 📋 Checklist para Nova Página

- [ ] Criar JSON em `src/content/pages/{tipo}/`
- [ ] Definir `slug` único
- [ ] Preencher `metadata` completo
- [ ] Adicionar todas as `evidences` referenciadas
- [ ] Garantir que `specs`/`dimensions` têm `evidenceIds`
- [ ] Se usar DERIVED, adicionar `derived_from`
- [ ] Rodar `npm run build` para validar
- [ ] Verificar HTML gerado em `/dist`

## 🚫 O Que NÃO Fazer

- ❌ Claims sem evidência
- ❌ Ratings numéricos sem metodologia
- ❌ "Fácil de limpar", "durabilidade excelente" sem OBSERVATION/MEASUREMENT
- ❌ Repetir canonical manualmente
- ❌ Misturar monetização com conteúdo editorial

## 📄 Licença

Projeto interno - não distribuir.
