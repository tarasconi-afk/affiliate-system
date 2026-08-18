# Recovery da Ferramenta Clara

Este diretório documenta como preservar, validar e reconstruir o projeto sem depender do computador atual, do origin Git ou das ferramentas de IA usadas hoje.

Ordem de leitura:

1. `AI_HANDOFF.md`
2. `PROJECT_RULES.md`
3. `RECOVERY_RUNBOOK.md`
4. `MONETIZATION_ROADMAP.md`
5. `SECRETS_INVENTORY.md`

Os arquivos versionados contêm regras e instruções. O estado operacional mais recente é gerado na VPS em `state/CURRENT_STATE.generated.md` e `state/current-state.json`; cada snapshot guarda sua própria cópia histórica. Uma IA futura deve confiar no `source_commit` do estado associado ao snapshot, não em um arquivo de estado versionado no Git.

O backup diário mantém um mirror Git, bundles verificáveis, checksums e 30 snapshots na VPS. Nenhum segredo faz parte desses artefatos.
