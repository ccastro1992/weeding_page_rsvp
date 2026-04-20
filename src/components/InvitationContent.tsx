"use client";

import { useState, useEffect, useRef } from "react";
import Envelope from "@/components/Envelope";
import { Hero, Phrase, Phrase2, Ceremony, Party, DressCode, Gifts, Phrase3, Separator1, Photos, Confirmation} from "@/components/InvitationSections";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

interface InvitationContentProps {
  guestName?: string;
  numberInvitations?: number;
}

export default function InvitationContent({ guestName, numberInvitations }: InvitationContentProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    const handleScroll = () => {
      if (!isOpened) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Ocultar si estamos a menos de 100px del final
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Verificar posición inicial al abrir
    if (isOpened) handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpened]);

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

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleOpenStart = () => {
    fadeInAudio();
    setShowControls(true);
    // Mostrar el indicador de scroll después de un pequeño delay para que la animación de fade-in de la página empiece
    setTimeout(() => setShowScrollIndicator(true), 1500);
  };

  return (
    <main className="relative min-h-screen">
      {!isOpened && (
        <Envelope 
          onOpen={() => setIsOpened(true)} 
          onOpenStart={handleOpenStart}
          guestName={guestName}
          numberInvitations={numberInvitations}
        />
      )}

      {isOpened && (
        <div className="central-strip animate-fade-in">
          <Hero />
          <Separator1 />
          <Confirmation />
          <Separator1 />
          <Photos />
          <Phrase />
          <Ceremony />
          <Phrase2 />
          <Party />
          <Phrase3 />
          <DressCode />
          <Phrase2 />
          <Gifts />
          <Phrase3 />
          <footer className="footer-main">
            <p className="font-serif text-orange-dark italic font-bold" style={{ fontSize: "1.25rem", lineHeight: "1.5", margin: "0rem 1rem 1rem 1rem" }}>
              ¡No aceptamos un 'no' por respuesta! <br/>
              Los esperamos para darlo todo en la pista.
            </p>
            <button className="btn-outline-inverse btn-outline text-xs uppercase tracking-widest font-bold">
              Confirmar Asistencia
            </button>
            <p className="team-marker font-sans text-xs uppercase tracking-widest text-gray-600">
              Kari & Cris • 2026
            </p>
          </footer>
        </div>
      )}

      {showScrollIndicator && isOpened && (
        <div className={`scroll-indicator ${!showScrollIndicator ? 'hidden' : ''}`}>
          <span className="scroll-text">Desliza</span>
          <ChevronDown className="scroll-icon" size={32} />
        </div>
      )}

      {showControls && (
        <button 
          onClick={toggleMute}
          className="audio-control"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}
    </main>
  );
}
