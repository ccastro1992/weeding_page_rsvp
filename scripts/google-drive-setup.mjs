// Obtiene GOOGLE_REFRESH_TOKEN y crea la carpeta de Drive (scope drive.file).
// Uso: node --env-file=.env.local scripts/google-drive-setup.mjs
import { createServer } from 'node:http';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'Recuerdos Boda Kari & Cris';
const port = 53682;
const redirectUri = `http://127.0.0.1:${port}`;

if (!clientId || !clientSecret) {
  console.error('Define GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local');
  process.exit(1);
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/drive.file',
  access_type: 'offline',
  prompt: 'consent',
}).toString();

async function exchangeCode(code) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function createFolder(accessToken) {
  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' }),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

const server = createServer(async (req, res) => {
  const code = new URL(req.url, redirectUri).searchParams.get('code');
  if (!code) {
    res.writeHead(400).end('Sin código de autorización');
    return;
  }

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) throw new Error('Google no devolvió refresh_token; revoca el acceso y reintenta');
    const folder = await createFolder(tokens.access_token);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Listo, puedes cerrar esta ventana.');
    console.log('\nAgrega a .env.local y a Vercel:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_DRIVE_FOLDER_ID=${folder.id}`);
    console.log(`\nCarpeta: ${folder.webViewLink}`);
  } catch (error) {
    res.writeHead(500).end('Error, revisa la terminal');
    console.error(error);
  } finally {
    server.close();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('Abre esta URL en el navegador e inicia sesión con la cuenta de Google:\n');
  console.log(authUrl.toString());
});
