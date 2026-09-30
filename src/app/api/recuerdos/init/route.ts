import { NextResponse } from 'next/server';
import { createResumableUpload, findOrCreateGuestFolder, uploadTextFile } from '@/lib/googleDrive';
import {
  AUDIO_EXTENSIONS,
  MAX_AUDIO_BYTES,
  MAX_NAME_LENGTH,
  MAX_SELFIE_BYTES,
  MAX_TEXT_LENGTH,
  toTitleCase,
} from '@/lib/recuerdos';

const FILE_TIMEZONE = 'America/Mexico_City';

interface InitBody {
  nombre?: unknown;
  texto?: unknown;
  audioMime?: unknown;
  audioSize?: unknown;
  selfieSize?: unknown;
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function toSize(value: unknown): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : 0;
}

function dateParts(date: Date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: FILE_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value])
  );
}

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return null;
  try {
    return new URL(origin).host === host ? origin : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const origin = getAllowedOrigin(request);
  if (!origin) return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 });

  let body: InitBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Solicitud inválida');
  }

  const nombre = typeof body.nombre === 'string' ? toTitleCase(body.nombre) : '';
  const texto = typeof body.texto === 'string' ? body.texto.trim() : '';
  const audioMime = typeof body.audioMime === 'string' ? body.audioMime : null;
  const audioSize = toSize(body.audioSize);
  const selfieSize = toSize(body.selfieSize);

  if (!nombre || nombre.length > MAX_NAME_LENGTH) return badRequest('Escribe tu nombre');
  if (texto.length > MAX_TEXT_LENGTH) return badRequest('El mensaje es demasiado largo');
  if (audioMime && (!AUDIO_EXTENSIONS[audioMime] || !audioSize)) return badRequest('Formato de audio no soportado');
  if (audioSize > MAX_AUDIO_BYTES) return badRequest('La grabación es demasiado pesada');
  if (selfieSize > MAX_SELFIE_BYTES) return badRequest('La foto es demasiado pesada');
  if (!audioMime && !texto) return badRequest('Graba un audio o escribe un mensaje');

  const now = dateParts(new Date());
  const prefix = `${now.year}-${now.month}-${now.day}_${now.hour}-${now.minute}-${now.second}`;
  const audioName = audioMime ? `${prefix}_audio.${AUDIO_EXTENSIONS[audioMime]}` : null;
  const selfieName = selfieSize ? `${prefix}_selfie.jpg` : null;

  try {
    const folderId = await findOrCreateGuestFolder(nombre);

    const [audioUploadUrl, selfieUploadUrl] = await Promise.all([
      audioName && audioMime
        ? createResumableUpload({ name: audioName, mimeType: audioMime, size: audioSize, parentId: folderId, origin })
        : null,
      selfieName
        ? createResumableUpload({ name: selfieName, mimeType: 'image/jpeg', size: selfieSize, parentId: folderId, origin })
        : null,
      texto
        ? uploadTextFile(
            `${prefix}_mensaje.txt`,
            `Nombre: ${nombre}\nFecha: ${now.day}/${now.month}/${now.year} ${now.hour}:${now.minute}\n\n${texto}\n`,
            folderId
          )
        : null,
    ]);

    return NextResponse.json({ audioUploadUrl, selfieUploadUrl });
  } catch (error) {
    console.error('Error al guardar recuerdo:', error);
    return NextResponse.json({ error: 'No pudimos preparar el envío' }, { status: 500 });
  }
}
