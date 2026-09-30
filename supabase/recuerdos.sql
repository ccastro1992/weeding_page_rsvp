-- Mensajes de recuerdo (voz / texto / selfie). Ejecutar en el SQL Editor de Supabase.
-- Los archivos viven en Google Drive; aquí solo se guardan nombre, texto y referencias.

create table if not exists public.mensajes_recuerdo (
  id uuid primary key,
  created_at timestamptz not null default now(),
  nombre text not null check (char_length(btrim(nombre)) between 1 and 80),
  texto text check (texto is null or char_length(texto) <= 1000),
  audio_path text,
  audio_mime text,
  selfie_path text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'completo')),
  constraint mensajes_recuerdo_contenido check (audio_path is not null or texto is not null)
);

-- audio_path / selfie_path guardan el nombre del archivo en Drive.
alter table public.mensajes_recuerdo add column if not exists audio_drive_id text;
alter table public.mensajes_recuerdo add column if not exists selfie_drive_id text;

create index if not exists mensajes_recuerdo_created_at_idx
  on public.mensajes_recuerdo (created_at desc);

-- Sin políticas: solo la service role (API routes de Next) puede leer/escribir.
alter table public.mensajes_recuerdo enable row level security;
