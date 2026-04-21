"use client";

import { useState } from "react";
import { X, Check, XCircle } from "lucide-react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxPasses: number;
  idInvitation: number;
}

export default function AttendanceModal({ isOpen, onClose, maxPasses, idInvitation }: AttendanceModalProps) {
  const [attending, setAttending] = useState<boolean | null>(true);
  const [passes, setPasses] = useState(maxPasses);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Aquí se manejaría la lógica de guardado
    console.log("Confirmación:", { attending, passes: attending ? passes : 0, idInvitation });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in-up">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-serif text-orange-dark mb-6">Confirmar Asistencia</h2>
        
        <div className="mb-8">
          <p className="font-serif text-xl text-gray-500 mb-4">¿Te unes a este momento con nosotros?</p>
          <div className="flex justify-center gap-4">
            <button 
              className={`btn-choice ${attending === true ? 'active' : ''}`}
              onClick={() => {
                setAttending(true);
                if (passes === 0) setPasses(maxPasses);
              }}
            >
              <Check size={18} className="mr-2" />&nbsp;Sí, asistiré
            </button>
            <button 
              className={`btn-choice ${attending === false ? 'active' : ''}`}
              onClick={() => {
                setAttending(false);
                setPasses(0);
              }}
            >
              <XCircle size={18} className="mr-2" />&nbsp;No podré asistir
            </button>
          </div>
        </div>

        {attending === true && (
          <div className="mb-8 animate-fade-in-modal">
            <p className="font-serif text-xl text-gray-500 mb-4">¿Cuántos pases utilizarás?</p>
            <div className="flex items-center justify-center gap-4">
              <button 
                className="btn-counter" 
                onClick={() => setPasses(Math.max(1, passes - 1))}
                disabled={passes <= 1}
                defaultValue={passes}
              >
                -
              </button>
              <span className="text-2xl font-serif text-orange-dark w-8">{passes}</span>
              <button 
                className="btn-counter" 
                onClick={() => setPasses(Math.min(maxPasses, passes + 1))}
                disabled={passes >= maxPasses}
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Máximo {maxPasses} pases</p>
          </div>
        )}

        {attending !== null && (
          <button className="btn-outline w-full mt-4" onClick={handleSubmit}>
            Enviar Confirmación
          </button>
        )}
      </div>
    </div>
  );
}
