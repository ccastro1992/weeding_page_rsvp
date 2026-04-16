"use client";

import { useState, useEffect, useRef } from "react";
import Envelope from "@/components/Envelope";
import { Hero, Phrase, Phrase2, Ceremony, Party, DressCode, Gifts, Phrase3 } from "@/components/InvitationSections";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
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
  };

  return (
    <main className="relative min-h-screen">
      {!isOpened && (
        <Envelope 
          onOpen={() => setIsOpened(true)} 
          onOpenStart={handleOpenStart}
        />
      )}

      {isOpened && (
        <div className="central-strip animate-fade-in">
          <Hero />
          <Phrase />
          <Ceremony />
          <Phrase2 />
          <Party />
          <Phrase3 />
          <DressCode />
          <Phrase2 />
          <Gifts />
          <Phrase3 />
          <footer className="text-center" style={{ padding: "2rem 0", backgroundColor: "var(--white)" }}>
            <p className="font-serif text-gold-dark italic text-2xl font-bold" style={{ marginBottom: "1rem" }}>
              ¡Los esperamos con mucha ilusión!
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-gray-600">
              Kari & Cris • 2026
            </p>
          </footer>
        </div>
      )}

      {/* Control de Audio Persistente - Disponible siempre después de abrir */}
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
