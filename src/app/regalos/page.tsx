import RegalosContent from "@/components/RegalosContent";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Regalos | Boda Kari & Cris",
  description: "Datos bancarios y código QR para regalos de nuestra boda.",
};

export default function RegalosPage() {
  return (
    <main className="relative min-h-screen">
      <RegalosContent />
      <Analytics />
    </main>
  );
}
