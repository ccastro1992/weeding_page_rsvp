import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import HomeContent from '@/components/HomeContent';

export const metadata: Metadata = {
  title: 'Kari & Cris | Nuestra Boda',
  description: 'Consulta las mesas, el menú, el programa y la información de regalos.',
};

export default function HomePage() {
  return (
    <>
      <HomeContent />
      <Analytics />
    </>
  );
}
