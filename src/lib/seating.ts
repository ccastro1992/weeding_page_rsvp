import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface GuestSeat {
  id: string;
  nombre: string;
  mesa: string;
  familia: string | null;
}

export type SeatingSearchStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'error';

const DEMO_GUESTS: GuestSeat[] = [
  { id: '1', nombre: 'Carlos Castro', mesa: 'Mesa de Honor - Los Laureles', familia: 'castro-gomez' },
  { id: '2', nombre: 'Karla Gómez', mesa: 'Mesa de Honor - Los Laureles', familia: 'castro-gomez' },
  { id: '3', nombre: 'Sofía Castro', mesa: 'Mesa de Honor - Los Laureles', familia: 'castro-gomez' },
  { id: '4', nombre: 'Alejandro Martínez', mesa: 'Mesa 2 - Eucalipto', familia: 'martinez-hernandez' },
  { id: '5', nombre: 'Valeria Hernández', mesa: 'Mesa 2 - Eucalipto', familia: 'martinez-hernandez' },
  { id: '6', nombre: 'Mateo López', mesa: 'Mesa 3 - Magnolias', familia: 'lopez-fernandez' },
  { id: '7', nombre: 'Lucía Fernández', mesa: 'Mesa 3 - Magnolias', familia: 'lopez-fernandez' },
  { id: '8', nombre: 'Diego Rodríguez', mesa: 'Mesa 4 - Olivo', familia: 'rodriguez-morales' },
  { id: '9', nombre: 'Camila Morales', mesa: 'Mesa 4 - Olivo', familia: 'rodriguez-morales' },
  { id: '10', nombre: 'Elena Navarro', mesa: 'Mesa 6 - Almendros', familia: null },
  { id: '11', nombre: 'Iñaki Núñez', mesa: 'Mesa 7 - Orquídeas', familia: null },
  { id: '12', nombre: 'Juan Calderón', mesa: 'Mesa 8 - Los Pinos', familia: null },
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n');
}

export function buildAccentInsensitiveRegex(text: string): string {
  return text
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[aáAÁ]/g, '[aáAÁ]')
    .replace(/[eéEÉ]/g, '[eéEÉ]')
    .replace(/[iíIÍ]/g, '[iíIÍ]')
    .replace(/[oóOÓ]/g, '[oóOÓ]')
    .replace(/[uúUÚ]/g, '[uúUÚ]')
    .replace(/[nñNÑ]/g, '[nñNÑ]');
}

export async function searchGuestSeats(searchTerm: string): Promise<GuestSeat[]> {
  const query = searchTerm.trim();
  if (!query) return [];

  if (!isSupabaseConfigured) {
    const normalizedQuery = normalizeText(query);
    return DEMO_GUESTS.filter((guest) => normalizeText(guest.nombre).includes(normalizedQuery));
  }

  const cleanQuery = query.replace(/[%_,]/g, '');
  if (!cleanQuery) return [];

  const { data: regexData, error: regexError } = await supabase
    .from('mesas')
    .select('id, nombre, mesa, familia')
    .filter('nombre', 'imatch', buildAccentInsensitiveRegex(cleanQuery))
    .order('nombre', { ascending: true })
    .limit(10);

  if (!regexError && regexData?.length) return regexData as GuestSeat[];

  const { data: rpcData, error: rpcError } = await supabase.rpc('buscar_invitado', {
    search_term: cleanQuery,
  });

  if (!rpcError && (rpcData as GuestSeat[] | null)?.length) return rpcData as GuestSeat[];

  const { data, error } = await supabase
    .from('mesas')
    .select('id, nombre, mesa, familia')
    .ilike('nombre', `%${cleanQuery}%`)
    .order('nombre', { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);
  return (data as GuestSeat[] | null) || [];
}

export async function getFamilyTablemates(guest: GuestSeat): Promise<GuestSeat[]> {
  if (!guest.familia) return [];

  if (!isSupabaseConfigured) {
    return DEMO_GUESTS
      .filter((member) => (
        member.id !== guest.id &&
        member.familia === guest.familia &&
        member.mesa === guest.mesa
      ))
      .sort((first, second) => first.nombre.localeCompare(second.nombre, 'es'));
  }

  const { data, error } = await supabase
    .from('mesas')
    .select('id, nombre, mesa, familia')
    .eq('familia', guest.familia)
    .eq('mesa', guest.mesa)
    .neq('id', guest.id)
    .order('nombre', { ascending: true });

  if (error) return [];
  return (data as GuestSeat[] | null) || [];
}