import RecuerdosContent from "@/components/RecuerdosContent";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Buenos Deseos | Boda Kari & Cris",
  description: "Déjanos un mensaje de voz o texto y una selfie como recuerdo de nuestra boda.",
};

export default function RecuerdosPage() {
  return (
    <main className="relative min-h-screen">
      <RecuerdosContent />
      <Analytics />
    </main>
  );
}
