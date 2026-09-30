const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export interface DriveFile {
  id: string;
  name: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

export function getDriveFolderId(): string {
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
  origin: string;
}

// El header Origin habilita CORS para que el navegador suba directo a la URL de sesión.
export async function createResumableUpload({ name, mimeType, size, origin }: ResumableSessionInput) {
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
    body: JSON.stringify({ name, mimeType, parents: [getDriveFolderId()] }),
    cache: 'no-store',
  });

  const location = response.headers.get('location');
  if (!response.ok || !location) {
    throw new Error(`Drive upload session ${response.status}: ${await response.text()}`);
  }
  return location;
}

export async function findFilesContaining(fragment: string): Promise<DriveFile[]> {
  const token = await getAccessToken();
  const safeFragment = fragment.replace(/['\\]/g, '');
  const params = new URLSearchParams({
    q: `'${getDriveFolderId()}' in parents and name contains '${safeFragment}' and trashed = false`,
    fields: 'files(id,name)',
    pageSize: '10',
  });

  const response = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Drive list ${response.status}: ${await response.text()}`);
  const data = (await response.json()) as { files?: DriveFile[] };
  return data.files ?? [];
}
