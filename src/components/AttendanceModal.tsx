"use client";

import { useState, useEffect } from "react";
import { X, Check, XCircle, Loader2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxPasses: number;
  idInvitation: number;
}

export default function AttendanceModal({ isOpen, onClose, maxPasses, idInvitation }: AttendanceModalProps) {
  const [attending, setAttending] = useState<boolean | null>(true);
  const [passes, setPasses] = useState(maxPasses);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && idInvitation) {
      checkExistingConfirmation();
    }
  }, [isOpen, idInvitation]);

  const checkExistingConfirmation = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('confirmados')
        .select('id')
        .eq('invitacion_id', idInvitation)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setAlreadyConfirmed(true);
      } else {
        setAlreadyConfirmed(false);
      }
    } catch (error) {
      console.error("Error al verificar confirmación:", error);
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('confirmados')
        .insert([
          { 
            invitacion_id: idInvitation, 
            pases: attending ? passes : 0,
            respuesta: attending ? 'SI' : 'NO'
          }
        ]);

      if (error) throw error;
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      alert("Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in-up">
        {checking ? (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto animate-spin text-orange-dark mb-4" size={40} />
            <p className="font-serif text-xl text-gray-500">Verificando invitación...</p>
          </div>
        ) : alreadyConfirmed ? (
          <div className="py-8 text-center animate-fade-in-modal">
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={32} />
            </div>
            <h2 className="text-2xl font-serif text-orange-dark mb-6">Respuesta Confirmada</h2>
            <p className="font-serif text-xl text-gray-500 mb-6">Ya hemos recibido tu respuesta previamente. ¡Muchas gracias!</p>
            <button className="btn-outline w-full" onClick={onClose}>
              Entendido
            </button>
          </div>
        ) : !submitted ? (
          <>
            <button className="modal-close" onClick={onClose} disabled={loading}>
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
                  disabled={loading}
                >
                  <Check size={18} className="mr-2" />&nbsp;Sí, asistiré
                </button>
                <button 
                  className={`btn-choice ${attending === false ? 'active' : ''}`}
                  onClick={() => {
                    setAttending(false);
                    setPasses(0);
                  }}
                  disabled={loading}
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
                    disabled={passes <= 1 || loading}
                  >
                    -
                  </button>
                  <span className="text-2xl font-serif text-orange-dark w-8">{passes}</span>
                  <button 
                    className="btn-counter" 
                    onClick={() => setPasses(Math.min(maxPasses, passes + 1))}
                    disabled={passes >= maxPasses || loading}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Máximo {maxPasses} pases</p>
              </div>
            )}

            {attending !== null && (
              <button 
                className="btn-outline w-full mt-4" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} />
                    &nbsp;Enviando...
                  </>
                ) : (
                  'Enviar Confirmación'
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-8 text-center animate-fade-in-modal">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-serif text-orange-dark mb-2">¡Gracias!</h2>
            <p className="font-serif text-xl text-gray-500 mb-4">Tu respuesta ha sido enviada exitosamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
