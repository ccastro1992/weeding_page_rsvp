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
        <div className={`lid ${isOpen ? 'open' : ''}`}>
          <div className="lid-content">
            <p className="lid-text">Kari &nbsp; y &nbsp; Cris</p>
          </div>
           <div className="card-divider"/>
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
          <h2 className="card-title">
            ¡Hola, Invitado!
          </h2>
          <div className="card-divider" />
          <p className="card-names">
            No podíamos imaginar este paso tan importante sin las personas que han sido parte de nuestra historia.
            Prepárate para bailar y disfrutar con nosotros.
            <br/>
            <br/>
            Tenemos reservados para ti: <b>2 pases</b>.
          </p>
          <br/>
          <br/>
          <p className="flap-click-hint">¡ver los detalles!</p>
        </div>
      </div>
    </div >
  );
}
