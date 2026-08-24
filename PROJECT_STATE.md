# Estado atual

Atualizado em 24/08/2026.

Marca:  
Ferramenta Clara

Domínio:  
ferramentaclara.com.br

Nicho inicial:  
ferramentas elétricas e decisões de compra

## Fase atual

Primeiro checkpoint editorial pós-lançamento, com 9 artigos publicados e indexação liberada.

## Conteúdo publicado

- DeWalt DCD777 vale a pena
- Bosch ou Makita
- Parafusadeira 12V ou 18V
- Parafusadeira com ou sem impacto
- Bateria de parafusadeira serve em outra marca
- Furadeira de impacto ou martelete
- O que significa Nm em uma parafusadeira
- Parafusadeira brushless ou com escovas
- Furadeira com fio ou a bateria

Sitemap em produção: homepage + 9 artigos = 10 URLs indexáveis. A página de créditos permanece fora dessa contagem.

Prelaunch: `false`

Indexação:  
liberada; o `robots.txt` HTTPS contém `Allow: /`

Monetização:  
não ativa

## Search Console

- Search Console está operacional.
- A baseline inicial de 19/08/2026 registrou 12 impressões e 0 cliques.
- Várias páginas do cluster já receberam impressões.
- A coleta via n8n foi testada e funcionou.
- Este é um recorte inicial, não evidência de ranking estável.

## Verificação de produção

O alerta “Indexada, mas bloqueada pelo robots.txt” referia-se a `http://ferramentaclara.com.br/`. A produção foi verificada em 19/08/2026:

- homepage HTTP: `301` para HTTPS, seguida de `200`;
- `robots.txt` HTTP: `301` para HTTPS, seguido de `200`;
- `robots.txt` HTTPS: `Allow: /`;
- canonical da homepage: HTTPS.

Nenhuma correção técnica foi necessária.

## Automação editorial

O MVP editorial autônomo v0.1 foi validado end-to-end em produção com a Página 9, “Furadeira com fio ou a bateria”. O workflow autônomo chegou ao commit local; push e publicação continuaram sob autorização e ação humana. A produção recebeu status `PRODUCTION_PASS` no smoke completo.

O site já possui uma V2/V2.1 de identidade visual. Não iniciar novo redesign completo sem decisão explícita.
