import { Citrus, GlassWater, Martini, Sunrise, Wine } from 'lucide-react';
import StandardFooter from '@/components/StandardFooter';
import StandardHeader from '@/components/StandardHeader';

const cocktails = [
  {
    name: 'Mojito',
    variants: 'Clásico · Maracuyá · Frutos rojos',
    icon: Citrus,
  },
  {
    name: 'Cuba Libre',
    variants: 'Ron, cola y limón',
    icon: GlassWater,
  },
  {
    name: 'Paloma',
    variants: 'Tequila y toronja',
    icon: Martini,
  },
  {
    name: 'Tequila Sunrise',
    variants: 'Tequila, naranja y granadina',
    icon: Sunrise,
  },
  {
    name: 'Whisky en las rocas',
    variants: 'Servido sobre hielo',
    icon: Wine,
  },
] as const;

export default function CoctelesContent() {
  return (
    <main className="standard-content-page central-strip animate-fade-in">
      <div className="standard-typography cocktails-content">
        <StandardHeader title="Carta de Cócteles" />

        <p className="cocktails-intro">Una selección para brindar, celebrar y disfrutar.</p>

        <div className="cocktails-list">
          {cocktails.map(({ name, variants, icon: Icon }) => (
            <section key={name} className="cocktail-item">
              <span className="cocktail-icon" aria-hidden="true">
                <Icon size={23} strokeWidth={1.4} />
              </span>
              <span>
                <h2>{name}</h2>
                <p>{variants}</p>
              </span>
            </section>
          ))}
        </div>
      </div>

      <StandardFooter showHomeLink />
    </main>
  );
}