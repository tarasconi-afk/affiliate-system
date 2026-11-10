// Publicação da V2 (motor ferramenta-clara-motor): o site já vem construído e validado em release-v2/.
// A Hostinger roda `npm run build` e serve dist/; aqui só copiamos, sem reconstruir, para o publicado
// ser byte a byte o artefato aprovado. Rollback: git revert deste commit (volta o build Astro do V1).
import { cpSync, existsSync, rmSync } from 'node:fs';
if (!existsSync('release-v2/index.html') || !existsSync('release-v2/sitemap.xml')) {
  console.error('release-v2/ incompleto: abortando para não publicar site vazio');
  process.exit(1);
}
rmSync('dist', { recursive: true, force: true });
cpSync('release-v2', 'dist', { recursive: true });
console.log('dist/ = release-v2/');
