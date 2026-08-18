# Inventário de secrets

Valores nunca devem ser registrados neste arquivo, no Git, nos snapshots ou nos logs.

## Estado do recovery

Os scripts atuais usam o origin Git público e não exigem segredo. Se o origin deixar de ser público, configure autenticação fora do repositório e não incorpore credenciais na URL.

## CLAUDE_CODE_OAUTH_TOKEN

- Valor: NUNCA registrar.
- Uso: autenticação do Claude CLI automatizado, quando aplicável.
- Onde configurar: secret store ou configuração local da ferramenta, fora do projeto.
- Como regenerar: refazer a autenticação oficial no novo ambiente.

Credenciais de Hostinger, Search Console, Git, afiliados e anúncios devem ser recriadas nos respectivos provedores somente quando esses serviços forem configurados; seus valores não pertencem ao recovery.
