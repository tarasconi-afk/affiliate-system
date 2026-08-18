# Recovery da Ferramenta Clara

Este diretório documenta como preservar, validar e reconstruir o projeto sem depender do computador atual, do origin Git ou das ferramentas de IA usadas hoje.

Ordem de leitura:

1. `AI_HANDOFF.md`
2. `CURRENT_STATE.generated.md`
3. `PROJECT_RULES.md`
4. `RECOVERY_RUNBOOK.md`
5. `MONETIZATION_ROADMAP.md`
6. `SECRETS_INVENTORY.md`

Os arquivos `CURRENT_STATE.generated.md` e `current-state.json` são produzidos por `scripts/recovery/generate-current-state.mjs`. O backup diário mantém um mirror Git, bundles verificáveis, checksums e 30 snapshots na VPS. Nenhum segredo faz parte desses artefatos.
