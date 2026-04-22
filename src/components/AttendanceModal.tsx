"use client";

import { useState, useEffect } from "react";
import { X, Check, XCircle, Loader2, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxPasses: number;
  idInvitation: number;
  relacionados?: { invitados: string[] };
}

export default function AttendanceModal({ isOpen, onClose, maxPasses, idInvitation, relacionados }: AttendanceModalProps) {
  const [attending, setAttending] = useState<boolean | null>(true);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [passes, setPasses] = useState(maxPasses);

  useEffect(() => {
    if (relacionados?.invitados) {
      setSelectedGuests(relacionados.invitados);
      setPasses(relacionados.invitados.length);
    } else {
      setPasses(maxPasses);
    }
  }, [relacionados, maxPasses]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [prevResponse, setPrevResponse] = useState<string | null>(null);

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
        .select('id, respuesta')
        .eq('invitacion_id', idInvitation)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setAlreadyConfirmed(true);
        setPrevResponse(data.respuesta);
      } else {
        setAlreadyConfirmed(false);
        setPrevResponse(null);
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
      // Usamos upsert para actualizar si ya existe o insertar si no
      const { error } = await supabase
        .from('confirmados')
        .upsert({ 
          invitacion_id: idInvitation, 
          pases: attending ? passes : 0,
          respuesta: attending && selectedGuests.length > 0 ? 'SI' : 'NO',
          confirmados: attending ? { invitados: selectedGuests } : { invitados: [] }
        }, { onConflict: 'invitacion_id' });

      if (error) throw error;
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setAlreadyConfirmed(false);
      }, 2000);
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
      alert("Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlans = () => {
    setAlreadyConfirmed(false);
    setAttending(true);
    if (relacionados?.invitados) {
      setSelectedGuests(relacionados.invitados);
      setPasses(relacionados.invitados.length);
    } else {
      setPasses(maxPasses);
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
          <>
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>
            <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={32} />
            </div>
            <h2 className="text-2xl font-serif text-orange-dark mb-2">Respuesta Recibida</h2>
            <p className="font-serif text-xl text-gray-500 mb-6">
              {prevResponse === 'NO' 
                ? "Habías indicado que no podrías asistir. ¿Han cambiado tus planes?"
                : "Ya hemos recibido tu confirmación previamente. ¡Muchas gracias!"}
            </p>
            
            <div>
              <button className="btn-outline w-full mt-4" onClick={onClose}>
              Entendido
              </button>
              <br/>
              <br/>
              <button className="btn-outline-link w-full mt-4" onClick={handleChangePlans}>
              Cambio de Planes
              </button>
            </div>
          </>
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
                    if (relacionados?.invitados) {
                      setSelectedGuests(relacionados.invitados);
                      setPasses(relacionados.invitados.length);
                    } else if (passes === 0) {
                      setPasses(maxPasses);
                    }
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
              <div className="mb-8 animate-fade-in-modal max-w-[280px] mx-auto">
                <p className="font-serif text-xl text-gray-500 mb-4 text-center">¿Quiénes asistirán?</p>
                <div className="space-y-3 mb-6">
                  {relacionados?.invitados ? (
                    relacionados.invitados.map((nombre) => (
                      <div 
                        key={nombre} 
                        className="flex items-center justify-center gap-3 cursor-pointer group"
                        onClick={() => {
                          if (loading) return;
                          const newSelection = selectedGuests.includes(nombre)
                            ? selectedGuests.filter(g => g !== nombre)
                            : [...selectedGuests, nombre];
                          setSelectedGuests(newSelection);
                          setPasses(newSelection.length);
                        }}
                      >
                        <div 
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            selectedGuests.includes(nombre) 
                              ? 'bg-orange-dark border-orange-dark text-white' 
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selectedGuests.includes(nombre) && <Check size={12} strokeWidth={4} />}
                        </div>
                        <span className={`font-serif text-lg transition-all ${
                          selectedGuests.includes(nombre) 
                            ? 'text-orange-dark font-bold' 
                            : 'text-gray-400 line-through'
                        }`}>
                          &nbsp;&nbsp;{nombre}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        className="btn-counter" 
                        onClick={() => setPasses(Math.max(1, passes - 1))}
                        disabled={passes <= 1 || loading}
                      >
                        -
                      </button>
                      <span className="text-2xl font-serif text-orange-dark w-8 text-center">{passes}</span>
                      <button 
                        className="btn-counter" 
                        onClick={() => setPasses(Math.min(maxPasses, passes + 1))}
                        disabled={passes >= maxPasses || loading}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                
                <hr className="mb-2" style={{border: "0.5px solid var(--gray-100)"}}/>
                <div className="border-t border-gray-100 pt-4 text-center">
                  <p className="text-xs font-sans uppercase tracking-widest text-gray-400 mb-1">Total Confirmados</p>
                  <p className="text-xl font-serif text-orange-dark font-bold">
                    {passes} {passes === 1 ? 'pase' : 'pases'}
                  </p>
                </div>
              </div>
            )}

            {attending !== null && (
              <button 
                className="btn-outline w-full mt-4" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="mr-2 animate-spin" size={18} />
                    &nbsp;Enviando...
                  </div>
                ) : (
                  'Enviar Confirmación'
                )}
              </button>
            )}
            <p className="text-xs font-sans mb-2" style={{color: "var(--gray-500)", paddingTop: "15px"}}>*Desmarca los invitados que no asistirán</p>
          </>
        ) : (
          <div className="py-8 text-center animate-fade-in-modal">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-serif text-orange-dark mb-2">¡Gracias!</h2>
            <p className="font-serif text-xl text-gray-500 mb-4">Tu confirmación ha sido enviada exitosamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
