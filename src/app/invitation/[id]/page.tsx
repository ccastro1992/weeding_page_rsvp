import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import InvitationContent from '@/components/InvitationContent';

// Inicialización del cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: { id: string };
}

export default async function InvitationPage({ params }: PageProps) {
  const { id } = params;
  console.log('ID recibido:', id);
  // Consultar el nombre del invitado en Supabase
  const { data: guest, error } = await supabase
    .from('invitados')
    .select('nombre_sobre, pases')
    .eq('identificador', id)
    .single();

  // Si hay error o no existe el invitado, mostrar 404
  if (error || !guest) {
    return notFound();
  }

  return (
    <InvitationContent guestName={guest.nombre_sobre} numberInvitations={guest.pases} />
  );
}
