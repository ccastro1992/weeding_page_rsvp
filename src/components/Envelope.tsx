"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar audio (asegúrate de colocar music.mp3 en public/audio/)
    const audio = new Audio("/audio/music.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fadeInAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play().catch(e => console.log("Autoplay bloqueado:", e));
    
    let vol = 0;
    const interval = setInterval(() => {
      if (audioRef.current && vol < 0.4) {
        vol += 0.05;
        audioRef.current.volume = Math.min(vol, 0.4);
      } else {
        clearInterval(interval);
      }
    }, 200);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    if (!isOpen) {
      setIsOpen(true);
      fadeInAudio();
      setShowControls(true);
    } else {
      setIsExiting(true);
      setTimeout(onOpen, 800);
    }
  };

  return (
    <>
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
      </div>

      {/* Control de Audio Persistente */}
      {showControls && (
        <button 
          onClick={toggleMute}
          className="audio-control"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}
    </>
  );
}
