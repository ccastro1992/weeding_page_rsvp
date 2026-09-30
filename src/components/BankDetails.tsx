"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const bankDetails = {
  bank: "Banco Pichincha",
  accountType: "Ahorros",
  accountNumber: "2215335037",
  owner: "Cristhian Castro",
  ci: "1727003939",
  email: "cristhianc10@hotmail.com"
};

export default function BankDetails() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `
Banco: ${bankDetails.bank}
Tipo: ${bankDetails.accountType}
Cuenta: ${bankDetails.accountNumber}
Beneficiario: ${bankDetails.owner}
CI: ${bankDetails.ci}
Email: ${bankDetails.email}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bank-details text-left bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
        <div className="mb-1">
          <img src="/img/qr.png" alt="DeUna" className="bank-img" />
        </div>

        <div className="mb-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Banco</p>
          <p className="font-serif text-xl text-gray-700">{bankDetails.bank}</p>
        </div>

        <div className="mb-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Tipo de Cuenta</p>
          <p className="font-serif text-xl text-gray-700">{bankDetails.accountType}</p>
        </div>

        <div className="mb-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Número de Cuenta</p>
          <p className="font-serif text-xl  font-bold">{bankDetails.accountNumber}</p>
        </div>

        <div className="mb-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Beneficiario</p>
          <p className="font-serif text-xl text-gray-700">{bankDetails.owner}</p>
        </div>

        <div className="mb-1">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">C.I. / RUC</p>
          <p className="font-serif text-xl text-gray-700">{bankDetails.ci}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Correo Electrónico</p>
          <p className="font-serif text-xl text-gray-700">{bankDetails.email}</p>
        </div>
      </div>

      <div className="recuerdos-submit">
        <button type="button" className="mesas-primary" onClick={copyToClipboard}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? '¡Copiado!' : 'Copiar datos'}
        </button>
      </div>
    </>
  );
}
