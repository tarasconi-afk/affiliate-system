# AI handoff — Ferramenta Clara

Leia este arquivo primeiro.

## Projeto

Ferramenta Clara é um projeto pessoal que busca provar SEO orgânico evidence-first e automatizar progressivamente a produção sem sacrificar qualidade.

Fase atual: primeiro checkpoint editorial, com 8 artigos publicados. O pipeline Codex → Claude já foi testado, mas toda publicação continua human-gated.

Stack: Astro estático, PageSpecs JSON, Git, auto-deploy e conteúdo evidence-first.

## Papéis atuais

- Humano: decisão final e autorização de push.
- Codex: implementação e orquestração.
- Claude: pesquisa, red-team e auditoria independente.

## Regras essenciais

- `SPEC` exige fonte primária.
- `DERIVED` exige inferência conservadora e `derived_from`.
- Ausência de evidência não é evidência de ausência.
- Campos semanticamente diferentes não são comparáveis automaticamente.
- Nunca inventar preço, rating, estoque, reviews ou experiência prática.
- Qualidade > velocidade > volume.

Workflow: discovery → Claude red-team → Codex implementa → Claude audita → Codex corrige apenas problemas seguros → commit → humano autoriza push → smoke test → Search Console.

Monetização: OFF. Roadmap futuro: AdSense e afiliados. Publicação automática: OFF.

Leia depois: `CURRENT_STATE.generated.md`, `PROJECT_RULES.md`, `RECOVERY_RUNBOOK.md`, `MONETIZATION_ROADMAP.md`, além de `AGENTS.md` e `ARCHITECTURE.md` na raiz do repositório.
