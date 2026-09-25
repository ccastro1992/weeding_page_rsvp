'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FloatingHomeButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <Link href="/" className="standard-footer-home" aria-label="Ir al menú principal" title="Menú principal">
      <Home size={21} strokeWidth={1.6} aria-hidden="true" />
    </Link>,
    document.body
  );
}