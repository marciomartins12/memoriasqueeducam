const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '../src/public/img');
const SKIP_FOLDERS = ['_original', 'node_modules'];
const EXT_IMG = ['.jpg', '.jpeg', '.png'];

let totalAntes = 0;
let totalDepois = 0;
let arqsOtimizados = 0;
let arqsMantidos = 0;
let arqsErro = 0;

async function processarArquivo(arqPath) {
  const ext = path.extname(arqPath).toLowerCase();
  if (!EXT_IMG.includes(ext)) return;
  const stats = fs.statSync(arqPath);
  const sizeAntes = stats.size;
  totalAntes += sizeAntes;

  let buffer;
  try {
    if (ext === '.png') {
      buffer = await sharp(arqPath)
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
          quality: 92,
          effort: 10
        })
        .toBuffer();
    } else {
      buffer = await sharp(arqPath)
        .jpeg({
          quality: 82,
          mozjpeg: true,
          progressive: true,
          optimiseScans: true,
          overshootDeringing: true
        })
        .toBuffer();
    }
  } catch (e) {
    console.error(`  [ERRO] ${path.relative(ROOT, arqPath)} :: ${e.message}`);
    arqsErro++;
    totalDepois += sizeAntes;
    return;
  }

  const rel = path.relative(ROOT, arqPath);
  if (buffer.length < sizeAntes) {
    const tmp = arqPath + '.opt.tmp';
    fs.writeFileSync(tmp, buffer);
    fs.renameSync(tmp, arqPath);
    const kbAnt = (sizeAntes / 1024).toFixed(1);
    const kbDep = (buffer.length / 1024).toFixed(1);
    const poup = Math.round((1 - buffer.length / sizeAntes) * 100);
    console.log(`  [-${poup}%] ${rel}  ${kbAnt}KB → ${kbDep}KB`);
    totalDepois += buffer.length;
    arqsOtimizados++;
  } else {
    console.log(`  [mantido] ${rel} (ficaria maior)`);
    totalDepois += sizeAntes;
    arqsMantidos++;
  }
}

async function varrerPasta(dir) {
  const itens = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of itens) {
    const caminho = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (SKIP_FOLDERS.includes(it.name)) continue;
      await varrerPasta(caminho);
    } else if (it.isFile()) {
      await processarArquivo(caminho);
    }
  }
}

(async function () {
  console.log(`Iniciando otimizacao em: ${ROOT}\n`);
  await varrerPasta(ROOT);
  console.log(`\n====== RESUMO ======`);
  console.log(`Arquivos processados : ${arqsOtimizados + arqsMantidos + arqsErro}`);
  console.log(`Otimizados com ganho : ${arqsOtimizados}`);
  console.log(`Mantidos (menor era)  : ${arqsMantidos}`);
  console.log(`Com erros            : ${arqsErro}`);
  const mbA = (totalAntes / 1024 / 1024).toFixed(2);
  const mbD = (totalDepois / 1024 / 1024).toFixed(2);
  const economiaPct = totalAntes > 0 ? Math.round((1 - totalDepois / totalAntes) * 100) : 0;
  console.log(`Tamanho ANTES        : ${mbA} MB`);
  console.log(`Tamanho DEPOIS       : ${mbD} MB`);
  console.log(`Economia             : ${economiaPct}%  (${((totalAntes - totalDepois) / 1024 / 1024).toFixed(2)} MB salvos)`);
})();
