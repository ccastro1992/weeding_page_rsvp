"use client";

import { Calendar, Clock, MapPin, ExternalLink, Mail, Shirt } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// --- Reveal Hook ---
const useReveal = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return elementRef;
};

// --- Countdown Component ---
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-10-16T18:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.mins },
    { label: "Segundos", value: timeLeft.secs },
  ];

  return (
    <div className="flex justify-center" style={{ gap: "2rem", marginTop: "3rem" }}>
      {items.map((item) => (
        <div key={item.label} className="countdown-item">
          <div className="countdown-value font-serif" style={{ fontWeight: "lighter" }}>{item.value.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-widest text-eucalyptus-dark" style={{ opacity: 0.6, marginTop: "0.25rem" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- Hero Section ---
export const Hero = () => {
  const revealRef = useReveal();
  return (
    <section className="section-hero min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div ref={revealRef} className="z-10 reveal active">
        <img src="/img/logo.png" alt="Logo Boda" style={{ width: "25em", height: "auto", marginBottom: "2rem" }} />
        <p className="text-xs uppercase tracking-hero text-eucalyptus" style={{ marginBottom: "1.5rem" }}>¡Nos Casamos!</p>
        <h1 className="text-6xl md:text-9xl font-serif text-gold-dark" style={{ marginBottom: "1rem" }}>Kari & Cris</h1>
        <div style={{ width: "4rem", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.5)", margin: "2rem auto" }} />
        <p className="text-lg md:text-2xl font-serif italic text-eucalyptus-dark">16 de Octubre de 2026</p>
        <Countdown />
      </div>
    </section>
  );
};

// --- Ceremony Section ---
export const Ceremony = () => {
  const revealLeft = useReveal();
  const revealRight = useReveal();
  
  return (
    <section className="section-ceremony">
      <div className="grid-2">
        <div ref={revealLeft} className="reveal-left">
          <h2 className="text-4xl md:text-5xl font-serif text-eucalyptus-dark" style={{ marginBottom: "2rem" }}>La Ceremonia</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="flex" style={{ alignItems: "flex-start", gap: "1rem" }}>
              <Clock className="text-gold" style={{ width: "1.5rem", height: "1.5rem", marginTop: "0.25rem" }} />
              <div>
                <p className="font-serif text-xl">18:00 Horas</p>
                <p className="text-sm text-gray-500 font-sans">Se ruega puntualidad</p>
              </div>
            </div>
            <div className="flex" style={{ alignItems: "flex-start", gap: "1rem" }}>
              <MapPin className="text-gold" style={{ width: "1.5rem", height: "1.5rem", marginTop: "0.25rem" }} />
              <div>
                <p className="font-serif text-xl">Parroquia de San Jerónimo el Real</p>
                <p className="text-sm text-gray-500 font-sans">Calle de Moreto, 4, Madrid</p>
              </div>
            </div>
            <button className="btn-primary">
              Ver Ubicación <ExternalLink style={{ width: "1rem", height: "1rem" }} />
            </button>
          </div>
        </div>
        <div ref={revealRight} className="reveal-right relative" style={{ height: "400px", backgroundColor: "var(--cream)", borderRadius: "2px", overflow: "hidden", boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.608713045618!2d-3.6917454!3d40.4141676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422899479e0001%3A0xe67c0500e8f99e44!2sParroquia%20de%20San%20Jer%C3%B3nimo%20el%20Real!5e0!3m2!1ses!2ses!4v1717000000000!5m2!1ses!2ses" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

// --- Party Section ---
export const Party = () => {
  const revealRef = useReveal();
  return (
    <section className="section-party">
      <div style={{ maxWidth: "64rem", margin: "0 auto", textAlign: "center" }}>
        <div ref={revealRef} className="reveal">
          <h2 className="text-4xl md:text-5xl font-serif text-eucalyptus-dark" style={{ marginBottom: "4rem" }}>La Celebración</h2>
          
          <div className="grid-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--white)", borderRadius: "9999px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", marginBottom: "1rem" }}>
                <MapPin className="text-gold" style={{ width: "2rem", height: "2rem" }} />
              </div>
              <h3 className="font-serif text-2xl" style={{ marginBottom: "0.5rem" }}>Lugar</h3>
              <p className="text-gray-600 font-sans">Finca El Olivar</p>
              <p className="text-xs text-gray-400 uppercase tracking-tighter" style={{ marginTop: "0.25rem" }}>Habrá servicio de autobuses</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--white)", borderRadius: "9999px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", marginBottom: "1rem" }}>
                <Shirt className="text-gold" style={{ width: "2rem", height: "2rem" }} />
              </div>
              <h3 className="font-serif text-2xl" style={{ marginBottom: "0.5rem" }}>Dress Code</h3>
              <p className="text-gray-600 font-sans">Formal / Etiqueta</p>
              <p className="text-xs text-gray-400 italic" style={{ marginTop: "0.25rem" }}>Ponte tus mejores galas</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center" style={{ width: "4rem", height: "4rem", backgroundColor: "var(--white)", borderRadius: "9999px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", marginBottom: "1rem" }}>
                <Mail className="text-gold" style={{ width: "2rem", height: "2rem" }} />
              </div>
              <h3 className="font-serif text-2xl" style={{ marginBottom: "0.5rem" }}>Confirmar</h3>
              <p className="text-gray-600 font-sans italic" style={{ marginBottom: "1rem" }}>¿Nos acompañas?</p>
              <button className="btn-outline">
                Confirmar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
