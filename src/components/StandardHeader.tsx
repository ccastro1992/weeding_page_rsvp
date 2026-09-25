import { Sparkles } from 'lucide-react';
import WeddingLogo from '@/components/WeddingLogo';

interface StandardHeaderProps {
  title: string;
}

export function OrnamentalDivider() {
  return (
    <div className="standard-divider" aria-hidden="true">
      <span />
      <Sparkles size={17} />
      <span />
    </div>
  );
}

export default function StandardHeader({ title }: StandardHeaderProps) {
  return (
    <header className="standard-header">
      <WeddingLogo />
      <p className="standard-header-date">Viernes 16 de Octubre de 2026</p>
      <OrnamentalDivider />
      <h1>{title}</h1>
    </header>
  );
}