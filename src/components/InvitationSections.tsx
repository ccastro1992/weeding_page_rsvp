"use client";

import { Calendar, Clock, MapPin, ExternalLink, Mail, Shirt, Gift, Hourglass } from "lucide-react";
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
    <div className="countdown-container">
      {items.map((item) => (
        <div key={item.label} className="countdown-item">
          <div className="countdown-value font-serif" style={{ fontWeight: "lighter" }}>{item.value.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-widest text-eucalyptus-dark opacity-60 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- Hero Section ---
export const Hero = () => {
  const revealRef = useReveal();
  return (
    <section className="section-hero flex flex-col items-center text-center overflow-hidden">
      <div ref={revealRef} className="z-10 reveal">
        <img src="/img/logo.png" alt="Logo Boda" className="logo-hero" />
        <p className="text-xs uppercase tracking-hero text-eucalyptus mb-6">¡Nos Casamos!</p>
        <div className="card-divider" />
        <p className="text-lg md:text-2xl font-serif italic text-eucalyptus-dark date-ceremony-text">Viernes 16 de Octubre de 2026</p>
        <Countdown />
      </div>
    </section>
  );
};

// --- Phrase 1 Section ---
export const Phrase = () => {
  return (
    <section className="section-phrase">
      <div className="flex flex-col items-center">
        <img
          src="/img/separator.png"
          alt=""
          className="separator-img"
        />
        <div className="phrase-content">
          <p className="text-2xl md:text-3xl font-serif text-eucalyptus-dark italic no-margin">
            "En cada historia de amor, hay un momento mágico en el que todo cambia para siempre.
            Ese momento es el día de nuestra boda, y queremos compartirlo con ustedes."
          </p>
        </div>
        <img
          src="/img/separator.png"
          alt=""
          className="separator-img-flipped"
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
      <div className="container-narrow text-center">
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus mb-4">El gran momento</p>
          <h2 className="text-4xl font-serif text-eucalyptus-dark mb-6">La Ceremonia</h2>
          <img
            src="/img/ceremony.png"
            className="img-section"
            alt="Código de Vestimenta"
          />
          <h3 className="font-serif text-2xl text-gold-dark mb-8">Parroquia Jesús de las Bienaventuranzas</h3>

          <div className="img-container-styled">
            <img
              src="/img/iglesia.png"
              alt="Parroquia Jesús de las Bienaventuranzas"
              className="separator-img"
            />
          </div>

          <div className="mb-10">
            <p className="font-serif text-xl text-gray-600 mb-2">Calle 24 de septiembre N1-77 y Alfredo Tobar, Tababela</p>
            <p className="font-serif text-2xl text-eucalyptus-dark">16:00 Horas</p>
          </div>

          <a
            href="https://maps.app.goo.gl/9yL1W2XfR3v5X8Z87"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-container flex flex-col items-center gap-2"
          >
            <div className="map-icon-wrapper">
              <MapPin style={{ width: "2rem", height: "2rem" }} />
            </div>
            <span className="text-xs uppercase tracking-widest text-gold-dark mt-2 font-bold">Pulsa para Ver en Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Phrase 2 Section ---
export const Phrase2 = () => {
  return (
    <section className="section-phrase">
      <div className="flex flex-col items-center">
        <img
          src="/img/separator.png"
          alt=""
          className="separator-img"
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
      <div className="container-narrow text-center">
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus mb-4">A continuación</p>
          <h2 className="text-4xl font-serif text-eucalyptus-dark mb-6">La Celebración</h2>
          <img
            src="/img/party.png"
            className="img-section"
            alt="Código de Vestimenta"
          />
          <h3 className="font-serif text-2xl text-gold-dark mb-8">Quinta Luciana</h3>

          <div className="img-container-styled">
            <img
              src="/img/quinta.png"
              alt="Quinta Luciana"
              className="separator-img"
            />
          </div>

          <div className="mb-12">
            <div className="mb-8">
              <p className="font-serif text-xl text-gray-600">Troncal de la Sierra, Pifo</p>
              <p className="font-serif text-2xl text-eucalyptus-dark">17:30 Horas</p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/9yL1W2XfR3v5X8Z87"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-container flex flex-col items-center gap-2"
          >
            <div className="map-icon-wrapper">
              <MapPin style={{ width: "2rem", height: "2rem" }} />
            </div>
            <span className="text-xs uppercase tracking-widest text-eucalyptus-dark mt-2 font-bold">Pulsa para Ver en Maps</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Phrase 3 Section ---
export const Phrase3 = () => {
  return (
    <section className="section-phrase">
      <div className="flex flex-col items-center">
        <img
          src="/img/separator.png"
          alt=""
          className="separator-img-flipped"
        />
      </div>
    </section>
  );
};

// --- Dress Code Section ---
export const DressCode = () => {
  const revealRef = useReveal();
  return (
    <section className="section-dress-code">
      <div className="container-narrow text-center">
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus mb-4">¿Qué me pongo?</p>
          <h2 className="text-4xl font-serif text-eucalyptus-dark mb-6">Código de Vestimenta</h2>

          <div className="img-container-dress-styled">
            <img
              src="/img/tie.png"
              className="img-tie-code"
              alt="Código de Vestimenta"
            />
            <img
              src="/img/dress.png"
              className="img-dress-code"
              alt="Código de Vestimenta"
            />
          </div>
          <h3 className="font-serif text-2xl text-gold-dark mb-8">Formal</h3>
          <div className="mb-12">
            <div className="mb-8">
              <p className="font-serif text-xl text-gray-600">El blanco está reservado para la novia, puedes elegir cualquier otro color.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Gifts Section ---
export const Gifts = () => {
  const revealRef = useReveal();
  return (
    <section className="section-gifts">
      <div className="container-narrow text-center">
        <div ref={revealRef} className="reveal">
          <p className="text-xs uppercase tracking-hero text-eucalyptus mb-4">Un detalle con amor</p>
          <h2 className="text-4xl font-serif text-eucalyptus-dark mb-6">Regalos</h2>
          <img
            src="/img/gift.png"
            className="img-section"
            alt="Código de Vestimenta"
          />
          <p className="font-serif text-xl text-gray-600 line-height-relaxed mb-10">
            <b>¡Qué alegría compartir nuestra historia con ustedes!</b><br />Para darnos ese empujoncito extra en esta nueva etapa, habilitamos la siguiente cuenta bancaria. Todo lo recaudado irá directo a nuestro proyecto de vida y nuestra luna de miel.
          </p>
          <button className="btn-outline text-xs uppercase tracking-widest text-eucalyptus-dark mt-2 font-bold">
            Ver Cuenta Bancaria
          </button>
        </div>
      </div>
    </section>
  );
};
