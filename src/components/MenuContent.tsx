"use client";

import React from "react";
import Link from "next/link";
import StandardFooter from "@/components/StandardFooter";
import StandardHeader from "@/components/StandardHeader";

export default function MenuContent() {
  return (
    <div className="central-strip animate-fade-in flex flex-col justify-between" style={{ padding: "0 1rem 4rem", minHeight: "100vh" }}>
      <div className="standard-typography w-full max-w-[380px] mx-auto text-center px-2">
        <StandardHeader title="Menú" />

        {/* SECCIONES DEL MENÚ - TIPOGRAFÍA DELICADA Y LEGIBLE */}
        <div className="sections-div">
          
          {/* PRIMER TIEMPO */}
          <div className="section-food mx-auto">
            <p className="italic text-2xl md:text-3xl text-orange-dark mb-1">
              Primer Tiempo
            </p>
            <h2 className="text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Vol-au-vent de pollo mechado en salsa pomodoro
            </h2>
            <p className="text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Crujiente hojaldre relleno de jugoso pollo desmechado, bañado en salsa pomodoro casera.
            </p>
          </div>

          <div className="w-12 h-px bg-amber-200/60 mx-auto opacity-60 my-4" />

          {/* SEGUNDO TIEMPO */}
          <div className="section-food mx-auto">
            <p className="italic text-2xl md:text-3xl text-orange-dark mb-1">
              Segundo Tiempo
            </p>
            <h2 className="text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Medallón de lomo en salsa Strogonoff
            </h2>
            <p className="text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Jugoso lomo de res, bañado en salsa Strogonoff tradicional, acompañado de croquetas de papa, arroz con choclo y vegetales al grill.
            </p>
          </div>

          <div className="w-12 h-px bg-amber-200/60 mx-auto opacity-60 my-4" />

          {/* PARA FINALIZAR */}
          <div className="section-food mx-auto">
            <p className="italic text-2xl md:text-3xl text-orange-dark mb-1">
              Para Finalizar
            </p>
            <h2 className="text-base md:text-lg font-medium text-gray-800 tracking-wide mb-1.5">
              Pastel de Bodas & Mesa de Dulces
            </h2>
            <p className="text-sm md:text-base text-gray-500 italic max-w-[320px] mx-auto" style={{ lineHeight: "1.6" }}>
              Bizcocho artesanal de naranja con crema de maracuyá, acompañado de bocadillos para dar inicio a la fiesta.
            </p>
          </div>

        </div>
      </div>

      <StandardFooter />
    </div>
  );
}
