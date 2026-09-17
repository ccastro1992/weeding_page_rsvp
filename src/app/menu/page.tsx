import MenuContent from "@/components/MenuContent";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Menú de 2 Tiempos | Boda Kari & Cris",
  description: "Conoce y selecciona las opciones gastronómicas de dos tiempos para nuestra boda.",
};

export default function MenuPage() {
  return (
    <main className="relative min-h-screen">
      <MenuContent />
      <Analytics />
    </main>
  );
}

