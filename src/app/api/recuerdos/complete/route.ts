import { NextResponse } from 'next/server';
import { findFilesContaining } from '@/lib/googleDrive';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  if (typeof id !== 'string' || !UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: row, error: rowError } = await admin
      .from('mensajes_recuerdo')
      .select('audio_path, selfie_path')
      .eq('id', id)
      .eq('estado', 'pendiente')
      .maybeSingle();

    if (rowError) throw rowError;
    if (!row) return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 });

    const files = await findFilesContaining(id);
    const byName = new Map(files.map((file) => [file.name, file.id]));
    const missing = [row.audio_path, row.selfie_path].some((name) => name && !byName.has(name));
    if (missing) {
      return NextResponse.json({ error: 'Faltan archivos por subir' }, { status: 400 });
    }

    const { error: updateError } = await admin
      .from('mensajes_recuerdo')
      .update({
        estado: 'completo',
        audio_drive_id: row.audio_path ? byName.get(row.audio_path) : null,
        selfie_drive_id: row.selfie_path ? byName.get(row.selfie_path) : null,
      })
      .eq('id', id);
    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error al completar recuerdo:', error);
    return NextResponse.json({ error: 'No pudimos guardar tu mensaje' }, { status: 500 });
  }
}
