# AI handoff — Ferramenta Clara

Leia este arquivo primeiro.

## Projeto

Ferramenta Clara é um projeto pessoal que busca provar SEO orgânico evidence-first e automatizar progressivamente a produção sem sacrificar qualidade.

Fase atual: primeiro checkpoint editorial pós-lançamento, com 9 artigos publicados, `prelaunch = false` e sitemap de 10 URLs indexáveis (homepage + 9 artigos). O MVP editorial autônomo v0.1 foi validado end-to-end em produção, mas toda publicação continua human-gated.

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

## Estado operacional confirmado em 19/08/2026

- Search Console está operacional; a baseline inicial registrou 12 impressões e 0 cliques, com várias páginas do cluster já recebendo impressões.
- A coleta de Search Console via n8n foi testada e funcionou.
- O alerta “Indexada, mas bloqueada pelo robots.txt” referia-se à homepage HTTP.
- A produção foi verificada: homepage HTTP redireciona com `301` para HTTPS `200`; `robots.txt` HTTP redireciona com `301` para HTTPS `200`; o arquivo HTTPS contém `Allow: /`; o canonical da homepage aponta para HTTPS.
- Nenhuma correção técnica foi necessária para esse alerta.

## Checkpoint autônomo v0.1 — 24/08/2026

- Página 9 publicada: “Furadeira com fio ou a bateria”.
- Commit publicado: `274e849a51400ba1aa2de033b952ccacceca4ca3`.
- Produção recebeu status `PRODUCTION_PASS` no smoke completo; o sitemap contém 10 URLs indexáveis.
- O workflow autônomo concluiu discovery, pesquisa, implementação, auditorias, QA e commit local.
- Push e publicação permaneceram sob gate humano; o push deste checkpoint foi realizado manualmente pelo humano.
- No fechamento do checkpoint, `HEAD` e `origin/main` estavam sincronizados.

Leia depois: `PROJECT_RULES.md`, `RECOVERY_RUNBOOK.md`, `MONETIZATION_ROADMAP.md`, além de `AGENTS.md` e `ARCHITECTURE.md` na raiz do repositório.

Regras e instruções ficam versionadas. Estado operacional é volátil: na VPS, leia `state/CURRENT_STATE.generated.md` e valide o `source_commit` em `state/current-state.json`. Para um backup histórico, confie na cópia de estado dentro do próprio snapshot e confirme que seu `source_commit` corresponde ao HEAD do bundle; não procure um `CURRENT_STATE` versionado no Git.
