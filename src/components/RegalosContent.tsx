import BankDetails from '@/components/BankDetails';
import StandardFooter from '@/components/StandardFooter';
import StandardHeader from '@/components/StandardHeader';

export default function RegalosContent() {
  return (
    <main className="standard-content-page central-strip animate-fade-in">
      <div className="standard-typography regalos-content">
        <StandardHeader title="Regalos" />

        <p className="regalos-intro">
          Tu presencia es nuestro mejor regalo. Si deseas sumar un detalle a este nuevo comienzo,
          lo recibiremos con infinita gratitud.
        </p>

        <div className="regalos-divider" aria-hidden="true" />

        <BankDetails />
      </div>

      <StandardFooter showHomeLink />
    </main>
  );
}
