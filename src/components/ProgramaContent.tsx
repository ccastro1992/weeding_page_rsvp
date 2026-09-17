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
    <div className="central-strip animate-fade-in" style={{ padding: "2.5rem 1rem 4rem 1rem", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto", textAlign: "center" }}>

        {/* LOGO */}
        <div style={{ marginBottom: "0.75rem" }}>
          <img src="/img/logo2.png" alt="Kari & Cris" className="logo-hero mx-auto" style={{ maxWidth: "260px", width: "100%", height: "auto" }} />
        </div>

        {/* FECHA */}
        <p className="font-serif italic" style={{ fontSize: "1.5rem", color: "#6b7280", marginBottom: "1.5rem", letterSpacing: "0.02em", fontWeight: "500" }}>
          Viernes 16 de Octubre de 2026
        </p>

        {/* TÍTULO */}
        <div style={{ margin: "1rem 0 1.5rem 0" }}>
          <h1 className="font-serif" style={{ fontSize: "2rem", color: "var(--orange-dark)", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Programa
          </h1>
          <div className="card-divider" style={{ margin: "0.75rem auto 1.5rem auto" }} />
        </div>

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
                  <span className="font-sans" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {item.time}
                  </span>
                </div>

                {/* TÍTULO */}
                <h2 className="font-serif" style={{ fontSize: "1.1rem", fontWeight: 400, color: "#1f2937", marginBottom: "2px", lineHeight: 1.3 }}>
                  {item.title}
                </h2>

                {/* UBICACIÓN */}
                {item.location && (
                  <p className="font-serif" style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic", lineHeight: 1.4 }}>
                    {item.location}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* FRASE PUNTUALIDAD */}
        <div style={{ borderTop: "1px solid rgba(212,175,55,0.3)", paddingTop: "1.25rem", marginTop: "1.5rem", textAlign: "center" }}>
          <p className="font-serif" style={{ fontSize: "0.9rem", color: "var(--orange-dark)", fontStyle: "italic", lineHeight: "1.6", maxWidth: "300px", margin: "0 auto" }}>
            ✨ Durante la recepción: Los invitamos a visitar nuestra estación de recuerdos. No se vayan sin tomarse su foto instantánea, escribirnos un mensaje y dejar su marca en el árbol de huellas.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <p className="team-marker font-sans" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#6b7280" }}>
          Kari & Cris • 2026
        </p>
      </div>
    </div>
  );
}
