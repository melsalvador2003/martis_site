import fs from 'fs';
import path from 'path';
import https from 'https';

const UTILS = {
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
};

const targetDir = path.join(process.cwd(), 'public', 'models');
const targetFile = path.join(targetDir, 'Teste23d.glb');

const urls = [
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/main/public/models/Teste23d.glb',
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/master/public/models/Teste23d.glb',
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/main/models/Teste23d.glb',
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/master/models/Teste23d.glb',
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/main/Teste23d.glb',
  'https://raw.githubusercontent.com/lucasbuzato/teste23d/master/Teste23d.glb',
];

function download(url) {
  return new Promise((resolve, reject) => {
    console.log(`Tentando baixar de: ${url}`);
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          // GitHub pages return HTML for page not found, make sure it looks like a binary/GLTF file.
          if (buffer.length > 5000 && !buffer.toString('utf8', 0, 100).includes('<!DOCTYPE html>')) {
            resolve(buffer);
          } else {
            reject(new Error(`Tamanho inválido ou HTML retornado de ${url}`));
          }
        });
      } else {
        reject(new Error(`Status: ${response.statusCode} para ${url}`));
      }
    });

    request.on('error', (err) => {
      reject(err);
    });
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout para ${url}`));
    });
  });
}

async function run() {
  UTILS.ensureDir(targetDir);
  
  if (fs.existsSync(targetFile)) {
    console.log(`O arquivo já existe em ${targetFile}. Pulando download.`);
    return;
  }

  for (const url of urls) {
    try {
      const buffer = await download(url);
      fs.writeFileSync(targetFile, buffer);
      console.log(`Sucesso! Arquivo baixado e salvo em ${targetFile} (${buffer.length} bytes)`);
      return;
    } catch (err) {
      console.log(`Erro ao baixar de ${url}: ${err.message}`);
    }
  }

  console.log('Não foi possível fazer o download do modelo real GLB. Criaremos um aviso/modelo mock para fallbacks.');
}

run();
