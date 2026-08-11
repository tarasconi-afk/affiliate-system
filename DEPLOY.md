# Deploy na Hostinger - Guia Rápido

## ✅ Status Atual

- ✅ Código commitado no Git (commit `6715732`)
- ✅ Build gerado em `/dist` (4 páginas prontas)
- ✅ Working tree limpo

## 📦 Arquivos para Publicação

Todos os arquivos necessários estão em `/dist`:

```
dist/
├── index.html                                    (Homepage)
├── parafusadeira-dewalt-dcd777-vale-a-pena/      (Página 1)
│   └── index.html
├── bosch-ou-makita-parafusadeira/                (Página 2)
│   └── index.html
├── parafusadeira-12v-ou-18v/                     (Página 3)
│   └── index.html
├── sitemap.xml
├── robots.txt
└── _astro/                                       (CSS)
    └── *.css
```

## 🚀 Passos para Publicar na Hostinger

### Opção 1: Via FTP/SFTP (Recomendado)

1. **Acesse o painel da Hostinger**
   - Login em hpanel.hostinger.com

2. **Conecte via File Manager ou FTP**
   - Use o File Manager do hPanel, ou
   - Configure FTP client (FileZilla, WinSCP, etc)

3. **Navegue até o diretório público**
   - Geralmente é `public_html/` ou `www/`

4. **Faça upload de TODO o conteúdo de `/dist`**
   ```
   Origem: /home/builder/affiliate-system/dist/*
   Destino: public_html/ (ou diretório do domínio)
   ```

5. **Verifique a estrutura final**
   ```
   public_html/
   ├── index.html
   ├── parafusadeira-dewalt-dcd777-vale-a-pena/
   ├── bosch-ou-makita-parafusadeira/
   ├── parafusadeira-12v-ou-18v/
   ├── sitemap.xml
   ├── robots.txt
   └── _astro/
   ```

### Opção 2: Via Git Deploy (Se disponível)

1. **Configure Git no hPanel**
   - Vá em "Git" no painel Hostinger
   - Conecte este repositório

2. **Configure build script**
   - Branch: `main`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

3. **Deploy automático**
   - Push para `main` → deploy automático

### Opção 3: Via SSH + rsync (Avançado)

```bash
# Conecte via SSH na Hostinger
ssh usuario@seu-dominio.com

# Na VPS, clone o repositório
git clone <repo-url> affiliate-system
cd affiliate-system

# Instale dependências e faça build
npm install
npm run build

# Copie dist/ para public_html/
rsync -av dist/ ~/public_html/
```

## ⚙️ Configuração Importante

### Atualizar domínio no `astro.config.mjs`

Antes do build final para produção, edite:

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://seu-dominio.com',  // ← TROCAR AQUI
  // ...
});
```

Depois rode:
```bash
npm run build
```

Isso garantirá que:
- Canonical URLs apontem para o domínio correto
- Sitemap tenha URLs corretas
- Robots.txt aponte para sitemap correto

## 🔍 Verificações Pós-Deploy

Após publicar, verifique:

- [ ] `https://seu-dominio.com/` → Homepage carrega
- [ ] `https://seu-dominio.com/parafusadeira-dewalt-dcd777-vale-a-pena/` → Página 1
- [ ] `https://seu-dominio.com/bosch-ou-makita-parafusadeira/` → Página 2
- [ ] `https://seu-dominio.com/parafusadeira-12v-ou-18v/` → Página 3
- [ ] `https://seu-dominio.com/sitemap.xml` → Sitemap acessível
- [ ] `https://seu-dominio.com/robots.txt` → Robots acessível
- [ ] Estilos CSS carregando corretamente
- [ ] Links entre páginas funcionando
- [ ] Links de evidências (#ev_001) funcionando

## 📊 SEO Checklist Pós-Deploy

- [ ] Submeter sitemap no Google Search Console
  - URL: `https://seu-dominio.com/sitemap.xml`

- [ ] Verificar propriedade no Google Search Console
  - Método recomendado: Meta tag HTML

- [ ] Verificar canonical URLs
  - Inspecione source de cada página
  - Confirme que apontam para domínio correto

- [ ] Verificar JSON-LD schemas
  - Use Google Rich Results Test
  - URL: https://search.google.com/test/rich-results

- [ ] Verificar Open Graph
  - Use Facebook Sharing Debugger
  - URL: https://developers.facebook.com/tools/debug/

## 🔄 Workflow Futuro

Para adicionar novas páginas:

1. **Criar novo PageSpec JSON**
   ```bash
   src/content/pages/{tipo}/{slug}.json
   ```

2. **Rodar build localmente**
   ```bash
   npm run build
   ```

3. **Commit e push**
   ```bash
   git add src/content/pages/
   git commit -m "feat: adiciona nova página X"
   git push origin main
   ```

4. **Deploy**
   - Upload de `/dist` via FTP, ou
   - Git deploy automático (se configurado)

## 🐛 Troubleshooting

### Páginas retornam 404
- Verifique se a estrutura de diretórios foi mantida
- Certifique-se que subdiretórios têm `index.html` dentro

### CSS não carrega
- Verifique se pasta `_astro/` foi copiada
- Confirme que permissões de arquivo estão corretas (644 para arquivos)

### Links relativos quebrados
- Todas as URLs internas usam trailing slash: `/parafusadeira-12v-ou-18v/`
- Certifique-se que não há redirecionamentos removendo a barra

### Canonical URLs errados
- Atualize `site` em `astro.config.mjs`
- Refaça o build: `npm run build`
- Faça novo upload de `/dist`

## 📝 Notas

- Todo o conteúdo é HTML estático (sem servidor necessário)
- Sem banco de dados necessário
- Sem variáveis de ambiente necessárias (neste MVP)
- Funciona em qualquer hospedagem que sirva arquivos estáticos

## ✅ Checklist Final

Antes de considerar deploy completo:

- [ ] Domínio configurado e apontando para Hostinger
- [ ] `astro.config.mjs` atualizado com domínio real
- [ ] Build final gerado: `npm run build`
- [ ] Todos arquivos de `/dist` copiados para `public_html/`
- [ ] 4 páginas acessíveis via navegador
- [ ] Sitemap submetido no Search Console
- [ ] Propriedade verificada no Search Console
- [ ] Canonical URLs corretos
- [ ] JSON-LD schemas validados

---

**Status:** Pronto para publicação na Hostinger
**Última atualização:** 2026-08-11
