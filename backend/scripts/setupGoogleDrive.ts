import { google } from 'googleapis';
import http from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Recria o __dirname para o escopo de ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações e caminhos
const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const TOKEN_PATH = path.join(__dirname, '../data/google_token.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

async function authenticateCli() {
  console.log('\n=== Autenticação de Backup do MSAM para o Google Drive ===\n');

  // Cria o servidor temporário para interceptar o redirecionamento
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url && req.url.startsWith('/callback')) {
        // Utiliza a API nativa URL para extrair os parâmetros
        const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
        const code = reqUrl.searchParams.get('code');

        if (code) {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);

          const dir = path.dirname(TOKEN_PATH);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

          // Resposta exibida no navegador
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>Autenticação concluída com sucesso!</h1><p>Você já pode fechar esta aba e voltar ao terminal.</p>');

          console.log('\n[✔] Código capturado automaticamente!');
          console.log(`[✔] Tokens de acesso salvos em: ${TOKEN_PATH}\n`);

          // Encerra o servidor e o script
          server.close(() => process.exit(0));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Erro: Código de autorização não retornado.');
          console.error('\n[X] Falha: Nenhum código retornado pelo Google.');
          server.close(() => process.exit(1));
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
      }
    } catch (error) {
      console.error('\n[X] Erro ao processar o callback:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro interno no servidor de autenticação temporário.');
      server.close(() => process.exit(1));
    }
  });

  // Inicia o servidor temporário
  server.listen(PORT, () => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive.file'],
    });

    console.log(`Servidor local aguardando autorização na porta ${PORT}...\n`);
    console.log('1. Acesse o seguinte link no seu navegador:\n');
    console.log(`   \x1b[36m${authUrl}\x1b[0m\n`);
    console.log('2. Faça login com a sua conta do Google e autorize a permissão.');
    console.log('3. O terminal detectará a resposta automaticamente.');
  });
}

authenticateCli();