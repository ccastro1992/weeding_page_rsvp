"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    if (!isOpen) {
      setIsOpen(true);
      // Removed the automatic timeout
    } else {
      // If already open, the next click triggers the exit
      setIsExiting(true);
      setTimeout(onOpen, 800);
    }
  };

  return (
    <div className={`envelope-screen ${isExiting ? 'exiting' : ''}`}>
      <div className="envelope-body" onClick={handleOpen}>
        
        {/* Solapa Superior (Tapa) */}
        <div className={`lid ${isOpen ? 'open' : ''}`} />

        {/* Solapa Inferior */}
        <div className={`flap flap-bottom ${isOpen ? 'open' : ''}`} />

        {/* Sello de Lacre (Botón) */}
        <div className={`wax-seal-container ${isOpen ? 'open' : ''}`}>
          <div className="wax-seal">M&A</div>
        </div>

        {/* Carta Interior */}
        <div className={`card ${isOpen && !isExiting ? 'visible' : ''}`}>
          <h2 className="card-title">Estás Invitado</h2>
          <div className="card-divider" />
          <p className="card-names">
            María & Alejandro
          </p>
        </div>

        <p className="pulse" style={{ position: "absolute", bottom: "40px", width: "100%", textAlign: "center", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.7rem" }}>
          Toca para abrir
        </p>
      </div>
    </div>
  );
}
