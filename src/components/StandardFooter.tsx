import FloatingHomeButton from '@/components/FloatingHomeButton';

interface StandardFooterProps {
  showHomeLink?: boolean;
}

export default function StandardFooter({ showHomeLink = false }: StandardFooterProps) {
  return (
    <footer className="standard-footer">
      {showHomeLink && <FloatingHomeButton />}
      {/* <p className="team-marker font-sans">Kari &amp; Cris • 2026</p> */}
    </footer>
  );
}