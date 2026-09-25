"use client";

import React from "react";
import { Beef, CakeSlice, Soup } from "lucide-react";
import StandardFooter from "@/components/StandardFooter";
import StandardHeader from "@/components/StandardHeader";

const menuSections = [
  {
    label: "Primer Tiempo",
    title: "Vol-au-vent de pollo mechado en salsa pomodoro",
    description: "Crujiente hojaldre relleno de jugoso pollo desmechado, bañado en salsa pomodoro casera.",
    icon: Soup,
  },
  {
    label: "Segundo Tiempo",
    title: "Medallón de lomo en salsa Strogonoff",
    description: "Jugoso lomo de res, bañado en salsa Strogonoff tradicional, acompañado de croquetas de papa, arroz con choclo y vegetales al grill.",
    icon: Beef,
  },
  {
    label: "Para Finalizar",
    title: "Pastel de Bodas & Mesa de Dulces",
    description: "Bizcocho artesanal de naranja con crema de maracuyá, acompañado de bocadillos para dar inicio a la fiesta.",
    icon: CakeSlice,
  },
];

export default function MenuContent() {
  return (
    <div className="central-strip animate-fade-in flex flex-col justify-between" style={{ padding: "0 1rem 4rem", minHeight: "100vh" }}>
      <div className="standard-typography w-full max-w-[380px] mx-auto text-center px-2">
        <StandardHeader title="Menú" />

        {/* SECCIONES DEL MENÚ - TIPOGRAFÍA DELICADA Y LEGIBLE */}
        <div className="sections-div">
          {menuSections.map(({ label, title, description, icon: Icon }, index) => (
            <React.Fragment key={label}>
              <section className="section-food mx-auto">
                <Icon className="menu-section-icon" size={28} strokeWidth={1.4} aria-hidden="true" />
                <p className="standard-item-label">{label}</p>
                <h2 className="standard-item-title">{title}</h2>
                <p className="standard-item-description">{description}</p>
              </section>
              {index < menuSections.length - 1 && (
                <div className="w-12 h-px bg-amber-200/60 mx-auto opacity-60 my-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <StandardFooter />
    </div>
  );
}
