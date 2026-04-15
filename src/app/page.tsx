"use client";

import { useState } from "react";
import Envelope from "@/components/Envelope";
import { Hero, Ceremony, Party } from "@/components/InvitationSections";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="relative min-h-screen">
      {!isOpened && (
        <Envelope onOpen={() => setIsOpened(true)} />
      )}

      {isOpened && (
        <div className="central-strip animate-fade-in">
          <Hero />
          <Ceremony />
          <Party />
          
          <footer className="text-center" style={{ padding: "3rem 0", backgroundColor: "var(--white)", borderTop: "1px solid var(--gray-100)" }}>
            <p className="font-serif text-gold-dark italic text-xl">
              ¡Os esperamos con mucha ilusión!
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-gray-300" style={{ marginTop: "1rem" }}>
              María & Alejandro • 2026
            </p>
          </footer>
        </div>
      )}
    </main>
  );
}
