'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  HelpCircle,
  Loader2,
  RefreshCw,
  Search,
  SearchX,
  Sparkles,
  Users,
  Utensils,
  X,
} from 'lucide-react';
import {
  getFamilyTablemates,
  GuestSeat,
  searchGuestSeats,
  SeatingSearchStatus,
} from '@/lib/seating';
import StandardFooter from '@/components/StandardFooter';
import StandardHeader, { OrnamentalDivider } from '@/components/StandardHeader';

export default function MesasContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<SeatingSearchStatus>('idle');
  const [results, setResults] = useState<GuestSeat[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestSeat | null>(null);
  const [familyTablemates, setFamilyTablemates] = useState<GuestSeat[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    setFamilyTablemates([]);
    if (!selectedGuest) return;

    let cancelled = false;
    getFamilyTablemates(selectedGuest).then((members) => {
      if (!cancelled) setFamilyTablemates(members);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedGuest]);

  const runSearch = useCallback(async (term: string) => {
    const currentRequest = ++requestId.current;
    setSelectedGuest(null);

    if (!term.trim()) {
      setStatus('idle');
      setResults([]);
      return;
    }

    setStatus('loading');
    try {
      const guests = await searchGuestSeats(term);
      if (currentRequest !== requestId.current) return;

      setResults(guests);
      setStatus(guests.length ? 'success' : 'not-found');
      if (guests.length === 1) setSelectedGuest(guests[0]);
    } catch (error) {
      console.error('Error al buscar la mesa:', error);
      if (currentRequest === requestId.current) {
        setResults([]);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => runSearch(searchTerm), 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm, runSearch]);

  const resetSearch = () => {
    requestId.current += 1;
    setSearchTerm('');
    setStatus('idle');
    setResults([]);
    setSelectedGuest(null);
  };

  return (
    <main className="mesas-page animate-fade-in">
      <StandardHeader title="Asignación de Mesas" />

      <div className="mesas-search">
        {status === 'loading' ? <Loader2 className="mesas-spin" size={20} /> : <Search size={20} />}
        <input
          type="text"
          role="searchbox"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') runSearch(searchTerm);
          }}
          placeholder="Busca por tu nombre o apellido..."
          aria-label="Buscar por nombre o apellido"
          autoComplete="off"
          spellCheck={false}
        />
        {searchTerm && (
          <button type="button" onClick={resetSearch} aria-label="Limpiar búsqueda" title="Limpiar búsqueda">
            <X size={18} />
          </button>
        )}
      </div>

      <section className="mesas-results" aria-live="polite">
        {status === 'idle' && (
          <div className="mesas-panel mesas-help">
            <Sparkles className="mesas-accent" size={25} />
            <h2>¿Cómo funciona la búsqueda?</h2>
            <p>Escribe tu nombre. Consultaremos la lista oficial para mostrarte la mesa asignada.</p>
            <ol>
              <li><strong>1</strong><span>Escribe tu nombre</span></li>
              <li><strong>2</strong><span>Ubica tu mesa</span></li>
              <li><strong>3</strong><span>¡A disfrutar!</span></li>
            </ol>
          </div>
        )}

        {(status === 'not-found' || status === 'error') && (
          <div className="mesas-panel mesas-empty">
            {status === 'error' ? <HelpCircle size={28} /> : <SearchX size={28} />}
            <h2>{status === 'error' ? 'No pudimos consultar la lista' : 'No encontramos tu reservación'}</h2>
            <p>
              {status === 'error'
                ? 'Intenta nuevamente en unos momentos o pide apoyo al equipo de protocolo.'
                : 'Revisa la ortografía o intenta únicamente con tu primer nombre o apellido.'}
            </p>
            <button type="button" className="mesas-primary" onClick={resetSearch}>
              <RefreshCw size={16} /> Intentar otra búsqueda
            </button>
          </div>
        )}

        {status === 'success' && !selectedGuest && results.length > 1 && (
          <div className="mesas-panel">
            <p className="mesas-eyebrow">Coincidencias encontradas ({results.length})</p>
            <h2>Selecciona tu nombre</h2>
            <div className="mesas-list">
              {results.map((guest) => (
                <button type="button" key={guest.id} onClick={() => setSelectedGuest(guest)}>
                  <span className="mesas-avatar">{guest.nombre[0]}</span>
                  <span><strong>{guest.nombre}</strong><small>Mesa: {guest.mesa}</small></span>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedGuest && (
          <div className="mesas-panel mesas-seat">
            <span className="mesas-badge"><Sparkles size={14} /> Lugar reservado</span>
            <h2>{selectedGuest.nombre}</h2>
            <OrnamentalDivider />
            <p className="mesas-eyebrow">Tu mesa asignada</p>
            <div className="mesas-table"><Utensils size={23} /> {selectedGuest.mesa}</div>

            {familyTablemates.length > 0 && (
              <div className="mesas-family">
                <h3><Users size={17} /> Te acompañan en tu mesa</h3>
                <ul>
                  {familyTablemates.map((member) => (
                    <li key={member.id}><span className="mesas-avatar">{member.nombre[0]}</span>{member.nombre}</li>
                  ))}
                </ul>
              </div>
            )}

            <button type="button" className="mesas-reset" onClick={resetSearch}>
              <RefreshCw size={14} /> Buscar otro nombre
            </button>
          </div>
        )}
      </section>

      <StandardFooter showHomeLink />
    </main>
  );
}