"use client";

import React from "react";
import Link from "next/link";

export default function MenuContent() {
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

        {/* TÍTULO ELEGANTE Y FINO */}
        <div className="my-4">
          <h1 className="font-serif text-3xl md:text-4xl text-orange-dark font-normal tracking-widest uppercase mb-1">
            Menú
          </h1>
          <div className="card-divider" style={{ margin: "0.75rem auto 1.5rem auto" }} />
        </div>

        {/* SECCIONES DEL MENÚ - TIPOGRAFÍA DELICADA Y LEGIBLE */}
        <div className="sections-div">
          
          {/* PRIMER TIEMPO */}
          <div className="section-food mx-auto">
            <p className="font-serif italic text-2xl md:text-3xl text-orange-dark mb-1"  style={{ fontFamily: "var(--font-cursive)" }}>
              Primer Tiempo
            </p>
            <h2 className="font-serif text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Vol-au-vent de pollo mechado en salsa pomodoro
            </h2>
            <p className="font-serif text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Crujiente hojaldre relleno de jugoso pollo desmechado, bañado en salsa pomodoro casera.
            </p>
          </div>

          <div className="w-12 h-px bg-amber-200/60 mx-auto opacity-60 my-4" />

          {/* SEGUNDO TIEMPO */}
          <div className="section-food mx-auto">
            <p className="font-serif italic text-2xl md:text-3xl text-orange-dark mb-1" style={{ fontFamily: "var(--font-cursive)" }}>
              Segundo Tiempo
            </p>
            <h2 className="font-serif text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Medallón de lomo en salsa Strogonoff
            </h2>
            <p className="font-serif text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Jugoso lomo de res, bañado en salsa Strogonoff tradicional, acompañado de croquetas de papa, arroz con choclo y vegetales al grill.
            </p>
          </div>

          <div className="w-12 h-px bg-amber-200/60 mx-auto opacity-60 my-4" />

          {/* PARA FINALIZAR */}
          <div className="section-food mx-auto">
            <p className="font-serif italic text-2xl md:text-3xl text-orange-dark mb-1" style={{ fontFamily: "var(--font-cursive)" }}>
              Para Finalizar
            </p>
            <h2 className="font-serif text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Pastel de Bodas & Mesa de Dulces
            </h2>
            <p className="font-serif text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Bizcocho artesanal de naranja con crema de maracuyá, acompañado de bocadillos para dar inicio a la fiesta.
            </p>
          </div>

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
