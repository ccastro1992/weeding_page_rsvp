import ProgramaContent from "@/components/ProgramaContent";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Programa | Boda Kari & Cris",
  description: "Conoce el itinerario y programa del día de nuestra boda.",
};

export default function ProgramaPage() {
  return (
    <main className="relative min-h-screen">
      <ProgramaContent />
      <Analytics />
    </main>
  );
}

