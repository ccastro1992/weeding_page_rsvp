import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import CoctelesContent from '@/components/CoctelesContent';

export const metadata: Metadata = {
  title: 'Carta de Cócteles | Boda Kari & Cris',
  description: 'Conoce la selección de cócteles disponibles en nuestra barra libre.',
};

export default function CoctelesPage() {
  return (
    <>
      <CoctelesContent />
      <Analytics />
    </>
  );
}