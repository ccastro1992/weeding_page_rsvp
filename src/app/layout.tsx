import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Parisienne,Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-serif",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  title: "Kari & Cris | Nuestra Boda",
  description: "¡Nos casamos! Estás invitado a celebrar nuestro gran día.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${montserrat.variable} ${greatVibes.variable}`}>
        {children}
      </body>
    </html>
  );
}
