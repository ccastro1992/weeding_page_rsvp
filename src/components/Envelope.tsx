"use client";

import { useState } from "react";

interface EnvelopeProps {
  onOpen: () => void;
  onOpenStart: () => void;
  guestName?: string;
  numberInvitations?: number;
}

export default function Envelope({ onOpen, onOpenStart, guestName, numberInvitations }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    if (!isOpen) {
      setIsOpen(true);
      onOpenStart(); // Activa el audio en el padre
    } else {
      setIsExiting(true);
      setTimeout(onOpen, 800);
    }
  };

  return (
    <div className={`envelope-screen ${isExiting ? 'exiting' : ''}`}>
      <div className="envelope-body" onClick={handleOpen}>

        {/* Solapa Superior (Tapa) */}
        <div className={`lid ${isOpen ? 'open' : ''}`}>
          <div className="lid-content">
            <p className="lid-text">Kari &nbsp; y &nbsp; Cris</p>
          </div>
        </div>

        {/* Solapa Inferior */}
        <div className={`flap flap-bottom ${isOpen ? 'open' : ''}`}>
          <div className="flap-content">
            <p className="flap-text">Tenemos una noticia...</p>
            <p className="flap-click-hint">¡Pulsa Aquí!</p>
          </div>
        </div>

        {/* Sello de Lacre (Imagen) */}
        <div className={`stamp-container ${isOpen ? 'open' : ''}`}>
          <img src="/img/stamp.png" alt="Sello" className="stamp-img" />
        </div>

        {/* Carta Interior */}
        <div className={`card ${isOpen && !isExiting ? 'visible' : ''}`}>
          <p className="text-xs uppercase tracking-hero text-gray-600 mb-6">¡Nos Casamos!</p>
          <h2 className="card-title">
            ¡Hola, {guestName || "Invitado"}!
          </h2>
          <div className="card-divider" />
          <p className="card-names">
            No podíamos imaginar este paso tan importante sin las personas que han sido parte de nuestra historia.
            Hoy queremos celebrar este nuevo comienzo rodeados de su cariño.
            <br/>
            <br/>
            ¡Prepárate para bailar y disfrutar con nosotros!
            <br/>
            <br/>
            Tenemos reservados para ti: <br/><b style={{fontSize: "1.3rem", color: "black"}}>{numberInvitations} pases</b>.
          </p>
          <br/>
          <br/>
          <p className="flap-click-hint">¡ver los detalles!</p>
        </div>
      </div>
    </div >
  );
}
