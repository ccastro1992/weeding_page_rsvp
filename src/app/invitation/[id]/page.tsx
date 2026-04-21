import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import InvitationContent from '@/components/InvitationContent';

interface PageProps {
  params: { id: string };
}

export default async function InvitationPage({ params }: PageProps) {
  const { id } = params;
  console.log('ID recibido:', id);
  // Consultar el nombre del invitado en Supabase
  const { data: guest, error } = await supabase
    .from('invitaciones')
    .select('id, nombre_sobre, pases, relacionados')
    .eq('identificador', id)
    .single();

  // Si hay error o no existe el invitado, mostrar 404
  if (error || !guest) {
    return notFound();
  }

  return (
    <InvitationContent 
      guestName={guest.nombre_sobre} 
      numberInvitations={guest.pases} 
      idInvitation={guest.id}
      relacionados={guest.relacionados}
    />
  );
}
