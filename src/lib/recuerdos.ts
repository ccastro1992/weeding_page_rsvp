export const MAX_NAME_LENGTH = 80;
export const MAX_TEXT_LENGTH = 1000;
export const MAX_AUDIO_SECONDS = 120;
export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
export const MAX_SELFIE_BYTES = 5 * 1024 * 1024;

export const AUDIO_EXTENSIONS: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/aac': 'aac',
  'audio/3gpp': '3gp',
};

const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

export function baseMime(mime: string): string {
  return mime.split(';')[0].trim().toLowerCase();
}

export function toTitleCase(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es')
    .replace(/(^|[\s-])(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toLocaleUpperCase('es'));
}

export function isAudioRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof window.AudioContext !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

// Safari/iOS graba en audio/mp4; Chrome/Firefox en webm/ogg.
export function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder.isTypeSupported !== 'function') return undefined;
  return RECORDER_MIME_CANDIDATES.find((mime) => MediaRecorder.isTypeSupported(mime));
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No pudimos leer la imagen'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export async function compressSelfie(file: File, maxSide = 1600): Promise<Blob> {
  const image = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('No pudimos procesar la imagen');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.85, 0.7, 0.55]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= MAX_SELFIE_BYTES) return blob;
  }
  throw new Error('La foto es demasiado pesada, intenta con otra');
}

interface InitResponse {
  audioUploadUrl: string | null;
  selfieUploadUrl: string | null;
}

export type SendStage = 'preparing' | 'uploading';

interface SubmitRecuerdoInput {
  nombre: string;
  texto: string;
  audio: Blob | null;
  selfie: Blob | null;
  onStage?: (stage: SendStage) => void;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'No pudimos enviar tu mensaje');
  return data as T;
}

async function uploadToDrive(uploadUrl: string, file: Blob, contentType: string) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  }).catch(() => null);
  if (!response?.ok) throw new Error('No pudimos subir los archivos, intenta de nuevo');
}

export async function submitRecuerdo({ nombre, texto, audio, selfie, onStage }: SubmitRecuerdoInput) {
  const audioMime = audio ? baseMime(audio.type) : null;

  onStage?.('preparing');
  const init = await postJson<InitResponse>('/api/recuerdos/init', {
    nombre,
    texto,
    audioMime,
    audioSize: audio?.size ?? 0,
    selfieSize: selfie?.size ?? 0,
  });

  if (init.audioUploadUrl || init.selfieUploadUrl) onStage?.('uploading');
  await Promise.all([
    audio && audioMime && init.audioUploadUrl ? uploadToDrive(init.audioUploadUrl, audio, audioMime) : null,
    selfie && init.selfieUploadUrl ? uploadToDrive(init.selfieUploadUrl, selfie, 'image/jpeg') : null,
  ]);
}
