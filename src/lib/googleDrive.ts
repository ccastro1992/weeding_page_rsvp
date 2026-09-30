const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

interface DriveFile {
  id: string;
  name: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

function getRootFolderId(): string {
  return requireEnv('GOOGLE_DRIVE_FOLDER_ID');
}

async function getAccessToken(): Promise<string> {
  if (typeof window !== 'undefined') throw new Error('googleDrive solo puede usarse en el servidor');
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: requireEnv('GOOGLE_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
      refresh_token: requireEnv('GOOGLE_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Google OAuth ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

interface ResumableSessionInput {
  name: string;
  mimeType: string;
  size: number;
  parentId: string;
  origin: string;
}

// El header Origin habilita CORS para que el navegador suba directo a la URL de sesión.
export async function createResumableUpload({ name, mimeType, size, parentId, origin }: ResumableSessionInput) {
  const token = await getAccessToken();
  const response = await fetch(`${DRIVE_UPLOAD_API}/files?uploadType=resumable&fields=id`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': String(size),
      Origin: origin,
    },
    body: JSON.stringify({ name, mimeType, parents: [parentId] }),
    cache: 'no-store',
  });

  const location = response.headers.get('location');
  if (!response.ok || !location) {
    throw new Error(`Drive upload session ${response.status}: ${await response.text()}`);
  }
  return location;
}

export async function uploadTextFile(name: string, content: string, parentId: string) {
  const token = await getAccessToken();
  const boundary = `recuerdo-${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name, mimeType: 'text/plain', parents: [parentId] });
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  const response = await fetch(`${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Drive text upload ${response.status}: ${await response.text()}`);
}

function normalizeFolderName(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

async function listGuestFolders(token: string): Promise<DriveFile[]> {
  const folders: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${getRootFolderId()}' in parents and mimeType = '${FOLDER_MIME}' and trashed = false`,
      fields: 'nextPageToken, files(id,name)',
      pageSize: '1000',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const response = await fetch(`${DRIVE_API}/files?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Drive list ${response.status}: ${await response.text()}`);
    const data = (await response.json()) as { files?: DriveFile[]; nextPageToken?: string };
    folders.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return folders;
}

async function renameFile(token: string, fileId: string, name: string) {
  const response = await fetch(`${DRIVE_API}/files/${encodeURIComponent(fileId)}?fields=id`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ name }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Drive rename ${response.status}: ${await response.text()}`);
}

// Se compara en código porque la búsqueda de Drive no ignora acentos.
export async function findOrCreateGuestFolder(displayName: string): Promise<string> {
  const token = await getAccessToken();
  const target = normalizeFolderName(displayName);
  const existing = (await listGuestFolders(token)).find(
    (folder) => normalizeFolderName(folder.name) === target
  );
  if (existing) {
    if (existing.name !== displayName) await renameFile(token, existing.id, displayName);
    return existing.id;
  }

  const response = await fetch(`${DRIVE_API}/files?fields=id`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ name: displayName, mimeType: FOLDER_MIME, parents: [getRootFolderId()] }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Drive create folder ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { id: string };
  return data.id;
}
