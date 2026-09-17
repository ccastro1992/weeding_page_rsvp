"use client";

import React from "react";
import Link from "next/link";
import { Users, Church, Wine, Utensils, Music } from "lucide-react";

export default function ProgramaContent() {
  const schedule = [
    {
      time: "15:30 h",
      title: "Bienvenida de Invitados",
      location: "Parroquia Jesús de las Bienaventuranzas",
      icon: Users,
    },
    {
      time: "16:00 h",
      title: "Ceremonia Religiosa",
      location: "",
      icon: Church,
    },
    {
      time: "17:30 h",
      title: "Cóctel de Bienvenida",
      location: "Quinta Luciana",
      icon: Wine,
    },
    {
      time: "19:00 h",
      title: "Recepción y Banquete",
      location: "Salón Quinta Luciana",
      icon: Utensils,
    },
    {
      time: "20:00 h",
      title: "Apertura de la Pista y Fiesta",
      location: "",
      icon: Music,
    },
  ];

  return (
    <div className="central-strip animate-fade-in flex flex-col justify-between" style={{ padding: "2.5rem 1rem 4rem 1rem", minHeight: "100vh" }}>
      <div className="w-full max-w-[380px] mx-auto text-center px-2">
        {/* LOGO OFICIAL DE LA INVITACIÓN */}
        <div className="mb-2">
          <img 
            src="/img/logo2.png" 
            alt="Kari & Cris" 
            className="logo-hero mx-auto" 
            style={{ maxWidth: "260px", width: "100%", height: "auto" }}
          />
        </div>

        {/* FECHA DEL EVENTO DEBAJO DEL LOGO */}
        <p className="font-serif italic text-sm md:text-base text-gray-600 mb-2">
          Viernes, 16 de Octubre 2026
        </p>

        {/* TÍTULO ELEGANTE Y FINO */}
        <div className="my-4">
          <h1 className="font-serif text-3xl md:text-4xl text-orange-dark font-normal tracking-widest uppercase mb-1">
            Programa
          </h1>
          <div className="card-divider" style={{ margin: "0.75rem auto 1.5rem auto" }} />
        </div>

        {/* ITINERARIO DEL DÍA */}
        <div className="sections-div">
          {schedule.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={index}>
                <div className="section-food mx-auto">
                  <div className="flex items-center justify-center gap-1.5 mb-1 text-orange-dark opacity-90">
                    <Icon size={16} className="shrink-0" />
                    <span className="font-sans text-xs md:text-sm font-medium tracking-widest uppercase">
                      {item.time}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg md:text-xl font-normal text-gray-800 mb-1 tracking-wide">
                    {item.title}
                  </h2>
                  {item.location && (
                    <p className="font-serif text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.5" }}>
                      {item.location}
                    </p>
                  )}
                </div>

                {index < schedule.length - 1 && (
                  <div className="w-12 h-px bg-amber-200/60 mx-auto my-4" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* FRASE PUNTUALIDAD */}
        <div className="pt-5 mt-6 border-t border-amber-200/60 text-center">
          <p className="font-serif text-sm md:text-base text-orange-dark italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
            "Les agradecemos de corazón llegar a tiempo para compartir juntos cada instante mágico de nuestro gran día."
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-6">
        <p className="team-marker font-sans text-xs uppercase tracking-widest text-gray-600">
          Kari & Cris • 2026
        </p>
      </div>
    </div>
  );
}
