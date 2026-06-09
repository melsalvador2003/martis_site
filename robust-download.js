import fs from 'fs';
import path from 'path';
import https from 'https';

const targetDir = path.join(process.cwd(), 'public', 'models');
const targetFile = path.join(targetDir, 'Teste23d.glb');

const url = 'https://raw.githubusercontent.com/lucasbuzato/teste23d/main/public/models/Teste23d.glb';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadModel() {
  return new Promise((resolve, reject) => {
    ensureDir(targetDir);
    
    // Delete existing file before downloading to avoid any partial issues
    if (fs.existsSync(targetFile)) {
      console.log("Removendo arquivo existente para baixar do zero...");
      fs.unlinkSync(targetFile);
    }

    console.log(`Iniciando download completo de: ${url}`);
    
    const fileStream = fs.createWriteStream(targetFile);
    
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fileStream.close();
        fs.unlinkSync(targetFile);
        reject(new Error(`Server returned status code ${response.statusCode}`));
        return;
      }

      const expectedBytes = parseInt(response.headers['content-length'] || '0', 10);
      console.log(`Tamanho esperado: ${expectedBytes} bytes`);

      let receivedBytes = 0;
      
      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        fileStream.write(chunk);
        
        // Dynamic progress printing
        if (Math.random() < 0.05) {
          const percent = ((receivedBytes / expectedBytes) * 100).toFixed(1);
          console.log(`Progresso: ${receivedBytes} de ${expectedBytes} bytes (${percent}%)`);
        }
      });

      response.on('end', () => {
        fileStream.end();
      });

      fileStream.on('finish', () => {
        const actualBytes = fs.statSync(targetFile).size;
        console.log(`Fim da transferência de stream. Bytes reais em disco: ${actualBytes}`);
        
        if (expectedBytes && actualBytes !== expectedBytes) {
          fs.unlinkSync(targetFile);
          reject(new Error(`Tamanho diferente! Esperado: ${expectedBytes}, Recebido: ${actualBytes}`));
        } else {
          console.log(`Download concluído com sucesso e gravado em disco: ${targetFile}`);
          resolve(actualBytes);
        }
      });
    });

    request.on('error', (err) => {
      fileStream.close();
      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      fileStream.close();
      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
      reject(new Error("Timeout de conexão (30 segundos)"));
    });
  });
}

async function run() {
  let attempts = 3;
  while (attempts > 0) {
    try {
      const size = await downloadModel();
      console.log(`Sucesso na tentativa! Tamanho final: ${size} bytes`);
      break;
    } catch (e) {
      console.error(`Falha na tentativa (${4 - attempts}/3): ${e.message}`);
      attempts--;
      if (attempts > 0) {
        console.log("Remontando a conexão e tentando novamente em 2 segundos...");
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.error("Não foi possível transferir o arquivo completo de Marte.");
      }
    }
  }
}

run();
