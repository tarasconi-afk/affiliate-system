# Recovery runbook

## Recuperar a partir de um bundle

1. Localize o snapshot apontado por `latest` ou escolha um diretório em `snapshots/`.
2. Valide a integridade:

   ```sh
   cd <snapshot>
   sha256sum -c SHA256SUMS
   git bundle verify affiliate-system.bundle
   ```

3. Reconstrua o repositório sem acessar o origin:

   ```sh
   git clone affiliate-system.bundle affiliate-system
   cd affiliate-system
   git checkout main
   ```

4. Compare o `HEAD` com `HEAD.txt` e leia `current-state.json`.
5. Prepare o ambiente:

   ```sh
   ./scripts/setup-dev.sh
   ```

## Recriar o backup

Na raiz dedicada de recovery, mantenha `mirror/`, `snapshots/`, `logs/`, `state/` e `scripts/`. Configure `SOURCE_REPO`, se necessário, sem inserir credenciais no script ou no cron. Rode `daily-recovery.sh` manualmente antes de automatizar.

## Limites

O recovery preserva somente o repositório pessoal e documentação derivada. DNS, Search Console, Hostinger, credenciais, sessões, `.env`, chaves SSH e serviços externos precisam ser recuperados nos respectivos provedores.
