# Estado atual

Atualizado em 19/08/2026.

Marca:  
Ferramenta Clara

Domínio:  
ferramentaclara.com.br

Nicho inicial:  
ferramentas elétricas e decisões de compra

## Fase atual

Primeiro checkpoint editorial pós-lançamento, com 8 artigos publicados e indexação liberada.

## Conteúdo publicado

- DeWalt DCD777 vale a pena
- Bosch ou Makita
- Parafusadeira 12V ou 18V
- Parafusadeira com ou sem impacto
- Bateria de parafusadeira serve em outra marca
- Furadeira de impacto ou martelete
- O que significa Nm em uma parafusadeira
- Parafusadeira brushless ou com escovas

Sitemap esperado: homepage + 8 artigos = 9 URLs indexáveis. A página de créditos permanece fora dessa contagem.

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

O experimento autônomo Página 9 v1 terminou em `SAFE_STOP`, sem alterações e sem commit. Duas chamadas Claude de discovery ficaram sem stdout; o gate se comportou corretamente e não aprovou candidato sem red-team independente.

Gargalo atual: tornar o fluxo Codex → Claude previsível.

Estratégia v2: avaliar um candidato por chamada, com prompt pequeno, timeout explícito e retry limitado.

O site já possui uma V2/V2.1 de identidade visual. Não iniciar novo redesign completo sem decisão explícita.
