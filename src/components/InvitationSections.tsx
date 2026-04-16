"use client";

import { Calendar, Clock, MapPin, ExternalLink, Mail, Shirt, Gift } from "lucide-react";
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
      <div ref={revealRef} className="z-10 reveal">
        <img src="/img/logo.png" alt="Logo Boda" style={{ width: "25em", height: "auto", marginBottom: "2rem" }} />
        <p className="text-xs uppercase tracking-hero text-eucalyptus" style={{ marginBottom: "1.5rem" }}>¡Nos Casamos!</p>
        <div style={{ width: "4rem", height: "1px", backgroundColor: "rgba(212, 175, 55, 0.5)", margin: "2rem auto" }} />
        <p className="text-lg md:text-2xl font-serif italic text-eucalyptus-dark">16 de Octubre de 2026</p>
        <Countdown />
      </div>
    </section>
  );
};

// --- Phrase 1 Section ---
export const Phrase = () => {
  return (
    <section className="section-phrase" style={{  padding: "0" }}>
      <div className="flex flex-col items-center">
        <img 
          src="/img/separator.png" 
          alt="" 
          style={{ width: "100%", height: "auto", display: "block" }} 
        />
        <div style={{ backgroundColor: "rgb(183 200 188)", padding: "2rem 2.5rem", textAlign: "center" }}>
          <p className="text-2xl md:text-3xl font-serif text-eucalyptus-dark italic" style={{ margin: 0 }}>
            "En cada historia de amor, hay un momento mágico en el que todo cambia para siempre.
            Ese momento es el día de nuestra boda, y queremos compartirlo con ustedes."
          </p>
        </div>
        <img 
          src="/img/separator.png" 
          alt="" 
          style={{ width: "100%", height: "auto", display: "block", transform: "rotate(180deg) rotateY(180deg)" }} 
        />
      </div>
    </section>
  );
};
// --- Ceremony Section ---
export const Ceremony = () => {
  const revealRef = useReveal();

  return (
    <section className="section-ceremony">
      <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus" style={{ marginBottom: "1rem" }}>El gran momento</p>
          <h2 className="text-4xl md:text-5xl font-serif text-eucalyptus-dark" style={{ marginBottom: "1.5rem" }}>La Ceremonia</h2>
          
          <h3 className="font-serif text-2xl text-gold-dark" style={{ marginBottom: "2rem" }}>Parroquia Jesús de las Bienaventuranzas</h3>
          
          <div style={{ marginBottom: "2.5rem", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <img 
              src="/img/iglesia.png" 
              alt="Parroquia Jesús de las Bienaventuranzas" 
              style={{ width: "100%", height: "auto", display: "block" }} 
            />
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <p className="font-serif text-xl text-gray-600" style={{ marginBottom: "0.5rem" }}>Calle 24 de septiembre N1-77 y Alfredo Tobar, Tababela</p>
            <p className="font-serif text-2xl text-eucalyptus-dark">16:00 Horas</p>
          </div>

          <a 
            href="https://maps.app.goo.gl/9yL1W2XfR3v5X8Z87" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2"
            style={{ textDecoration: "none", color: "inherit", display: "inline-flex" }}
          >
            <div style={{ 
              backgroundColor: "var(--white)",
              border: "1.5px solid black",  
              padding: "1.25rem", 
              borderRadius: "50%", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <MapPin className="text-gold" style={{ width: "2rem", height: "2rem" }} />
            </div>
            <span className="text-xs uppercase tracking-widest text-gold-dark" style={{ marginTop: "0.5rem", fontWeight: "bold" }}>Ver en Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Phrase 2 Section ---
export const Phrase2 = () => {
  return (
    <section className="section-phrase" style={{  padding: "0" }}>
      <div className="flex flex-col items-center">
        <img 
          src="/img/separator.png" 
          alt="" 
          style={{ width: "100%", height: "auto", display: "block" }} 
        />
      </div>
    </section>
  );
};

// --- Party Section ---
export const Party = () => {
  const revealRef = useReveal();
  return (
    <section className="section-party">
      <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus" style={{ marginBottom: "1rem" }}>A continuación</p>
          <h2 className="text-4xl md:text-5xl font-serif text-eucalyptus-dark" style={{ marginBottom: "1.5rem" }}>La Celebración</h2>
          
          <h3 className="font-serif text-2xl text-gold-dark" style={{ marginBottom: "2rem" }}>Quinta Luciana</h3>
          
          <div style={{ marginBottom: "2.5rem", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <img 
              src="/img/quinta.png" 
              alt="Quinta Luciana" 
              style={{ width: "100%", height: "auto", display: "block" }} 
            />
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <p className="font-serif text-xl text-gray-600">Troncal de la Sierra, Pifo</p>
              <p className="font-serif text-2xl text-eucalyptus-dark">17:30 Horas</p>
            </div>
          </div>

          <a 
            href="https://maps.app.goo.gl/9yL1W2XfR3v5X8Z87" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2"
            style={{ textDecoration: "none", color: "inherit", display: "inline-flex" }}
          >
            <div style={{ 
              backgroundColor: "var(--white)",
              border: "1.5px solid black",  
              padding: "1.25rem", 
              borderRadius: "50%", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <MapPin className="text-gold" style={{ width: "2rem", height: "2rem" }} />
            </div>
            <span className="text-xs uppercase tracking-widest text-eucalyptus-dark" style={{ marginTop: "0.5rem", fontWeight: "bold" }}>Ver en Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Gifts Section ---
export const Gifts = () => {
  const revealRef = useReveal();
  return (
    <section className="section-hero" style={{ backgroundColor: "var(--cream-light)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
        <div ref={revealRef} className="reveal">
          <Gift className="text-gold" style={{ width: "3rem", height: "3rem", margin: "0 auto 2rem" }} />
          <h2 className="text-4xl font-serif text-eucalyptus-dark" style={{ marginBottom: "1.5rem" }}>Regalos</h2>
          <p className="font-serif text-lg text-gray-600" style={{ lineHeight: "1.8", marginBottom: "2.5rem" }}>
            Vuestra presencia es nuestro mejor regalo, pero si deseáis tener un detalle con nosotros,
            agradeceríamos una contribución para nuestra futura vida juntos y nuestra luna de miel.
          </p>
          <button className="btn-outline">
            Ver Cuenta Bancaria
          </button>
        </div>
      </div>
    </section>
  );
};
