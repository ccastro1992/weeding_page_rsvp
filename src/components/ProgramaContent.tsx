"use client";

import React from "react";
import Link from "next/link";
import { Users, Church, Wine, Utensils, Music } from "lucide-react";
import StandardFooter from "@/components/StandardFooter";
import StandardHeader from "@/components/StandardHeader";

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
    <div className="central-strip animate-fade-in" style={{ padding: "0 1rem 4rem", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div className="standard-typography" style={{ width: "100%", maxWidth: "360px", margin: "0 auto", textAlign: "center" }}>
        <StandardHeader title="Programa" />

        {/* LÍNEA DE TIEMPO */}
        <div style={{ position: "relative", paddingLeft: "36px", textAlign: "left", margin: "0 auto", maxWidth: "300px" }}>

          {/* LÍNEA VERTICAL CONTINUA */}
          <div style={{
            position: "absolute",
            left: "10px",
            top: "8px",
            bottom: "8px",
            width: "2px",
            backgroundColor: "var(--orange-dark)",
            opacity: 0.35,
          }} />

          {schedule.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} style={{ position: "relative", marginBottom: "2rem" }}>

                {/* PUNTO DORADO */}
                <div style={{
                  position: "absolute",
                  left: "-30px",
                  top: "4px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: "var(--orange-dark)",
                  border: "2px solid white",
                  boxShadow: "0 0 0 2px var(--orange-dark)",
                  zIndex: 2,
                }} />

                {/* HORA E ÍCONO */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: "var(--orange-dark)" }}>
                  <Icon size={15} />
                  <span className="standard-item-label">
                    {item.time}
                  </span>
                </div>

                {/* TÍTULO */}
                <h2 className="standard-item-title">
                  {item.title}
                </h2>

                {/* UBICACIÓN */}
                {item.location && (
                  <p className="standard-item-description">
                    {item.location}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* FRASE PUNTUALIDAD */}
        <div style={{ borderTop: "1px solid rgba(212,175,55,0.3)", paddingTop: "1.25rem", marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--orange-dark)", fontStyle: "italic", lineHeight: "1.6", maxWidth: "300px", margin: "0 auto" }}>
            ✨ Durante la recepción: Los invitamos a visitar nuestra estación de recuerdos. No se vayan sin tomarse su foto instantánea, escribirnos un mensaje y dejar su marca en el árbol de huellas.
          </p>
        </div>

      </div>

      <StandardFooter />
    </div>
  );
}
