'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, Heart, ImagePlus, Loader2, Mic, RotateCcw, Send, Square, Trash2, X } from 'lucide-react';
import StandardFooter from '@/components/StandardFooter';
import StandardHeader, { OrnamentalDivider } from '@/components/StandardHeader';
import {
  AUDIO_EXTENSIONS,
  baseMime,
  compressSelfie,
  isAudioRecordingSupported,
  MAX_AUDIO_BYTES,
  MAX_AUDIO_SECONDS,
  MAX_NAME_LENGTH,
  MAX_TEXT_LENGTH,
  pickRecorderMime,
  SendStage,
  submitRecuerdo,
  toTitleCase,
} from '@/lib/recuerdos';

type RecorderState = 'idle' | 'recording' | 'recorded';
type SendStatus = 'idle' | 'sending' | 'sent';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function RecuerdosContent() {
  const [nombre, setNombre] = useState('');
  const [texto, setTexto] = useState('');

  const [canRecord, setCanRecord] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [processingSelfie, setProcessingSelfie] = useState(false);
  const [selfieError, setSelfieError] = useState<string | null>(null);

  const [status, setStatus] = useState<SendStatus>('idle');
  const [sendStage, setSendStage] = useState<SendStage>('preparing');
  const [formError, setFormError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCanRecord(isAudioRecordingSupported());
    // `capture` solo abre la cámara en móviles; en escritorio se ignora.
    setHasCamera(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  useEffect(() => () => {
    if (selfieUrl) URL.revokeObjectURL(selfieUrl);
  }, [selfieUrl]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    stopStream();
  }, [stopStream]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  }, []);

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
    setRecorderState('idle');
  };

  const startRecording = async () => {
    setMicError(null);
    setFormError(null);
    clearAudio();

    let stream: MediaStream;
    try {
      // El procesamiento de llamada (eco/ruido) recorta la voz con el micrófono integrado del celular.
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true },
      });
    } catch (error) {
      const denied = error instanceof DOMException && error.name === 'NotAllowedError';
      setMicError(
        denied
          ? 'No tenemos permiso para usar el micrófono. Actívalo en la configuración del navegador o déjanos un mensaje de texto.'
          : 'No pudimos acceder al micrófono. Puedes dejarnos un mensaje de texto.'
      );
      return;
    }

    const mimeType = pickRecorderMime();
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      setMicError('Tu navegador no permite grabar audio. Puedes dejarnos un mensaje de texto.');
      return;
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      stopStream();
      const type = baseMime(recorder.mimeType || mimeType || chunks[0]?.type || '');
      const blob = new Blob(chunks, { type });

      if (!AUDIO_EXTENSIONS[type] || blob.size === 0) {
        setMicError('No pudimos procesar la grabación. Intenta de nuevo o escribe tu mensaje.');
        setRecorderState('idle');
        return;
      }
      if (blob.size > MAX_AUDIO_BYTES) {
        setMicError('La grabación es demasiado pesada. Intenta con un mensaje más corto.');
        setRecorderState('idle');
        return;
      }

      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
      setRecorderState('recorded');
    };

    streamRef.current = stream;
    recorderRef.current = recorder;
    stream.getAudioTracks().forEach((track) => {
      track.onended = stopRecording;
    });
    recorder.onerror = stopRecording;
    // Fragmentos cada segundo para no perder audio si el navegador interrumpe la grabación.
    recorder.start(1000);
    setRecorderState('recording');

    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setSeconds(Math.min(elapsed, MAX_AUDIO_SECONDS));
      if (elapsed >= MAX_AUDIO_SECONDS) stopRecording();
    }, 250);
  };

  const handleSelfieChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setSelfieError(null);
    setProcessingSelfie(true);
    try {
      const blob = await compressSelfie(file);
      setSelfieBlob(blob);
      setSelfieUrl(URL.createObjectURL(blob));
    } catch (error) {
      setSelfieError(error instanceof Error ? error.message : 'No pudimos procesar la foto');
    } finally {
      setProcessingSelfie(false);
    }
  };

  const clearSelfie = () => {
    setSelfieBlob(null);
    setSelfieUrl(null);
    setSelfieError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!nombre.trim()) {
      setFormError('Escribe tu nombre para saber de quién es el recuerdo.');
      return;
    }
    if (!audioBlob && !texto.trim()) {
      setFormError('Graba un mensaje de voz o escríbenos unas palabras.');
      return;
    }

    setSendStage('preparing');
    setStatus('sending');
    try {
      await submitRecuerdo({
        nombre: nombre.trim(),
        texto: texto.trim(),
        audio: audioBlob,
        selfie: selfieBlob,
        onStage: setSendStage,
      });
      setStatus('sent');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No pudimos enviar tu mensaje');
      setStatus('idle');
    }
  };

  const sendAnother = () => {
    clearAudio();
    clearSelfie();
    setNombre('');
    setTexto('');
    setMicError(null);
    setFormError(null);
    setStatus('idle');
  };

  const isSending = status === 'sending';
  const isRecording = recorderState === 'recording';

  return (
    <main className="mesas-page recuerdos-page animate-fade-in">
      <StandardHeader title="Tus Buenos Deseos" />

      {status === 'sent' ? (
        <section className="mesas-results" aria-live="polite">
          <div className="mesas-panel recuerdos-thanks">
            <Heart className="recuerdos-accent" size={30} strokeWidth={1.5} />
            <h2>¡Gracias, {toTitleCase(nombre)}!</h2>
            <OrnamentalDivider />
            <p>Tu mensaje ya forma parte de nuestros recuerdos. Lo guardaremos con mucho cariño.</p>
            <button type="button" className="mesas-primary" onClick={sendAnother}>
              <RotateCcw size={16} /> Enviar otro mensaje
            </button>
          </div>
        </section>
      ) : (
        <form className="mesas-results recuerdos-form" onSubmit={handleSubmit} noValidate>
          <p className="recuerdos-intro">
            Déjanos un mensaje de voz o unas palabras escritas, y si quieres, acompáñalo con una selfie.
            Lo guardaremos como recuerdo de este día.
          </p>

          <div className="mesas-panel recuerdos-panel">
            <label className="mesas-eyebrow" htmlFor="recuerdos-nombre">Tu nombre</label>
            <input
              id="recuerdos-nombre"
              className="recuerdos-input"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              maxLength={MAX_NAME_LENGTH}
              placeholder="¿Quién nos deja este recuerdo?"
              autoComplete="name"
              disabled={isSending}
              required
            />
          </div>

          <div className="mesas-panel recuerdos-panel">
            <p className="mesas-eyebrow">Mensaje de voz</p>

            {!canRecord ? (
              <p className="recuerdos-notice">
                <AlertCircle size={16} /> Tu navegador no permite grabar audio. Ábrelo en Safari, Chrome o
                Firefox, o déjanos un mensaje de texto.
              </p>
            ) : (
              <>
                {recorderState !== 'recorded' && (
                  <div className="recuerdos-recorder">
                    <button
                      type="button"
                      className={`recuerdos-record ${isRecording ? 'is-recording' : ''}`}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isSending}
                      aria-label={isRecording ? 'Detener grabación' : 'Comenzar grabación'}
                    >
                      {isRecording ? <Square size={22} fill="currentColor" /> : <Mic size={26} strokeWidth={1.5} />}
                    </button>
                    <p className="recuerdos-timer" aria-live="polite">
                      {isRecording
                        ? `${formatTime(seconds)} / ${formatTime(MAX_AUDIO_SECONDS)}`
                        : `Toca para grabar (máx. ${formatTime(MAX_AUDIO_SECONDS)})`}
                    </p>
                  </div>
                )}

                {recorderState === 'recorded' && audioUrl && (
                  <div className="recuerdos-preview">
                    <audio controls src={audioUrl} preload="metadata" />
                    <div className="recuerdos-actions">
                      <button type="button" onClick={startRecording} disabled={isSending}>
                        <RotateCcw size={14} /> Grabar de nuevo
                      </button>
                      <button type="button" onClick={clearAudio} disabled={isSending}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {micError && <p className="recuerdos-notice"><AlertCircle size={16} /> {micError}</p>}
          </div>

          <div className="mesas-panel recuerdos-panel">
            <label className="mesas-eyebrow" htmlFor="recuerdos-texto">Mensaje escrito</label>
            <textarea
              id="recuerdos-texto"
              className="recuerdos-input recuerdos-textarea"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              maxLength={MAX_TEXT_LENGTH}
              rows={4}
              placeholder="Escríbenos unas palabras..."
              disabled={isSending}
            />
            <p className="recuerdos-counter">{texto.length} / {MAX_TEXT_LENGTH}</p>
          </div>

          <div className="mesas-panel recuerdos-panel">
            <p className="mesas-eyebrow">Selfie (opcional)</p>
            <input
              ref={cameraInputRef}
              className="recuerdos-file"
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleSelfieChange}
              disabled={isSending || processingSelfie}
            />
            <input
              ref={galleryInputRef}
              className="recuerdos-file"
              type="file"
              accept="image/*"
              onChange={handleSelfieChange}
              disabled={isSending || processingSelfie}
            />

            {selfieUrl ? (
              <div className="recuerdos-selfie">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selfieUrl} alt="Vista previa de tu selfie" />
                <button type="button" onClick={clearSelfie} disabled={isSending} aria-label="Quitar selfie">
                  <X size={16} />
                </button>
              </div>
            ) : processingSelfie ? (
              <div className="recuerdos-selfie-picker">
                <Loader2 className="mesas-spin" size={22} />
                <span>Procesando foto...</span>
              </div>
            ) : (
              <div className="recuerdos-selfie-options">
                {hasCamera && (
                  <button
                    type="button"
                    className="recuerdos-selfie-picker"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isSending}
                  >
                    <Camera size={22} strokeWidth={1.5} />
                    <span>Tomar selfie</span>
                  </button>
                )}
                <button
                  type="button"
                  className="recuerdos-selfie-picker"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isSending}
                >
                  <ImagePlus size={22} strokeWidth={1.5} />
                  <span>{hasCamera ? 'Elegir de galería' : 'Elegir foto'}</span>
                </button>
              </div>
            )}

            {selfieError && <p className="recuerdos-notice"><AlertCircle size={16} /> {selfieError}</p>}
          </div>

          {formError && (
            <p className="recuerdos-notice recuerdos-form-error" role="alert">
              <AlertCircle size={16} /> {formError}
            </p>
          )}

          <div className="recuerdos-submit">
            <button type="submit" className="mesas-primary" disabled={isSending || isRecording || processingSelfie}>
              {isSending ? <Loader2 className="mesas-spin" size={16} /> : <Send size={16} />}
              {isSending ? 'Enviando...' : 'Enviar recuerdo'}
            </button>
          </div>
        </form>
      )}

      <StandardFooter showHomeLink />

      {isSending && (
        <div className="recuerdos-sending" role="status" aria-live="polite">
          <div className="recuerdos-sending-card">
            <span className="recuerdos-sending-icon">
              <Loader2 className="recuerdos-sending-ring" size={64} strokeWidth={1} />
              <Heart className="recuerdos-sending-heart" size={24} strokeWidth={1.5} />
            </span>
            <h2>Enviando tu recuerdo</h2>
            <p>
              {sendStage === 'preparing'
                ? 'Preparando tu mensaje...'
                : 'Subiendo tus archivos, no cierres esta página...'}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
