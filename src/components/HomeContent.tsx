'use client';

import Link from 'next/link';
import { CalendarDays, Church, Gift, LayoutGrid, MapPin, Utensils } from 'lucide-react';
import { useState } from 'react';
import BankInfoModal from '@/components/BankInfoModal';
import StandardFooter from '@/components/StandardFooter';
import StandardHeader from '@/components/StandardHeader';
import { EVENT_LOCATIONS } from '@/lib/event';

const navigationItems = [
  { href: '/mesas', label: 'Mesas', description: 'Encuentra tu lugar', icon: LayoutGrid },
  { href: '/menu', label: 'Menú', description: 'Conoce los tiempos', icon: Utensils },
  { href: '/programa', label: 'Programa', description: 'Consulta el itinerario', icon: CalendarDays },
] as const;

export default function HomeContent() {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  return (
    <main className="home-page central-strip animate-fade-in">
      <div className="standard-typography home-content">
        <StandardHeader title="Nuestra Boda" />

        <p className="home-intro">
          Todo lo que necesitas para acompañarnos en este día especial.
        </p>

        <nav className="home-navigation" aria-label="Información de la boda">
          <a
            href={EVENT_LOCATIONS.church}
            target="_blank"
            rel="noopener noreferrer"
            className="home-navigation-item"
          >
            <span className="home-navigation-icon" aria-hidden="true">
              <Church size={24} strokeWidth={1.5} />
            </span>
            <span>
              <strong>Iglesia</strong>
              <small>Abrir ubicación</small>
            </span>
          </a>

          <a
            href={EVENT_LOCATIONS.venue}
            target="_blank"
            rel="noopener noreferrer"
            className="home-navigation-item"
          >
            <span className="home-navigation-icon" aria-hidden="true">
              <MapPin size={24} strokeWidth={1.5} />
            </span>
            <span>
              <strong>Quinta</strong>
              <small>Abrir ubicación</small>
            </span>
          </a>

          {navigationItems.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="home-navigation-item">
              <span className="home-navigation-icon" aria-hidden="true">
                <Icon size={24} strokeWidth={1.5} />
              </span>
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </Link>
          ))}

          <button
            type="button"
            className="home-navigation-item"
            onClick={() => setIsBankModalOpen(true)}
          >
            <span className="home-navigation-icon" aria-hidden="true">
              <Gift size={24} strokeWidth={1.5} />
            </span>
            <span>
              <strong>Regalos</strong>
              <small>Ver código QR</small>
            </span>
          </button>
        </nav>
      </div>

      <StandardFooter />

      <BankInfoModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />
    </main>
  );
}