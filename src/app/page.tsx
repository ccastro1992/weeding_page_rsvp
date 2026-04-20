import { notFound } from "next/navigation";

export default function Home() {
  // Deshabilita la página raíz redirigiendo a 404
  return notFound();
}
