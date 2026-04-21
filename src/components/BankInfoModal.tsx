"use client";

import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface BankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankInfoModal({ isOpen, onClose }: BankInfoModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bankDetails = {
    bank: "Banco Pichincha",
    accountType: "Ahorros",
    accountNumber: "2215335037",
    owner: "Cristhian Castro",
    ci: "1727003939",
    email: "cristhianc10@hotmail.com"
  };

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
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in-up">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="text-2xl font-serif text-orange-dark mb-6">Cuenta Bancaria</h2>

        <div className="text-left bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
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

        <button
          className={`btn-outline w-full  items-center justify-center gap-2 ${copied ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
          onClick={copyToClipboard}
        >
          {copied ? (
            <div className="flex items-center justify-center gap-2">
              <Check size={18} />
              &nbsp;¡Copiado!
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Copy size={18} />
              &nbsp;Copiar Datos
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
