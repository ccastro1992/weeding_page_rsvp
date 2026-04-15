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
        
        {/* Solapa Izquierda */}
        <div className={`flap flap-left ${isOpen ? 'open' : ''}`} style={{ 
          clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)", 
          backgroundColor: "#ffffff", 
          filter: "drop-shadow(2px 0 2px rgba(0,0,0,0.1))",
          zIndex: 12
        }} />
        
        {/* Solapa Derecha */}
        <div className={`flap flap-right ${isOpen ? 'open' : ''}`} style={{ 
          clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)", 
          backgroundColor: "#ffffff", 
          filter: "drop-shadow(-2px 0 2px rgba(0,0,0,0.1))",
          zIndex: 12
        }} />
        
        {/* Solapa Inferior */}
        <div className={`flap flap-bottom ${isOpen ? 'open' : ''}`} style={{ 
          clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)", 
          backgroundColor: "#fcfcfc", /* Un tono imperceptiblemente distinto para dar contraste */
          filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.15))",
          zIndex: 13
        }} />

        {/* Solapa Superior (Tapa) */}
        <div className={`lid ${isOpen ? 'open' : ''}`}>
          <div style={{ 
            width: "100%", 
            height: "100%", 
            clipPath: "polygon(0% 0%, 50% 50%, 100% 0%)", 
            backgroundColor: "#ffffff",
            filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.2))",
            zIndex: 25
          }} />
        </div>

        {/* Sello de Lacre (Botón) */}
        <div className={`wax-seal-container ${isOpen ? 'open' : ''}`}>
          <div className="wax-seal">M&A</div>
        </div>

        {/* Carta Interior */}
        <div className={`card ${isOpen ? 'visible' : ''}`}>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold)", fontSize: "2rem", marginBottom: "10px" }}>Estás Invitado</h2>
          <div style={{ width: "60px", height: "1px", background: "var(--gold)", margin: "20px auto", opacity: 0.3 }} />
          <p style={{ textTransform: "uppercase", letterSpacing: "3px", color: "var(--gray-500)", fontSize: "0.8rem" }}>
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
