"use client";

import { X } from "lucide-react";
import BankDetails from "@/components/BankDetails";

interface BankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankInfoModal({ isOpen, onClose }: BankInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay bank-modal-overlay">
      <div className="modal-content bank-modal animate-fade-in-up">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar información de regalos" title="Cerrar">
          <X size={24} />
        </button>

        <h2 className="bank-title text-2xl font-serif text-orange-dark">Cuenta Bancaria</h2>

        <BankDetails />
      </div>
    </div>
  );
}
