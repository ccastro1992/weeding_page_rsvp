import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import MesasContent from '@/components/MesasContent';

export const metadata: Metadata = {
  title: 'Asignación de Mesas | Boda Kari & Cris',
  description: 'Consulta la mesa asignada para la boda de Kari y Cris.',
};

export default function MesasPage() {
  return (
    <>
      <MesasContent />
      <Analytics />
    </>
  );
}