'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, Heart, ImagePlus, Loader2, Mic, Paperclip, RotateCcw, Send, Square, Trash2, X } from 'lucide-react';
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

type RecorderState = 'idle' | 'starting' | 'recording' | 'finalizing' | 'recorded';
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
  const [previewState, setPreviewState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [micError, setMicError] = useState<string | null>(null);
  const [inputLevel, setInputLevel] = useState(0);

  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [processingSelfie, setProcessingSelfie] = useState(false);
  const [selfieError, setSelfieError] = useState<string | null>(null);

  const [status, setStatus] = useState<SendStatus>('idle');
  const [sendStage, setSendStage] = useState<SendStage>('preparing');
  const [formError, setFormError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingSessionRef = useRef<object | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingErrorRef = useRef<string | null>(null);
  const stopRequestedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
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
    recordingSessionRef.current = null;
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      if (recorder.state !== 'inactive') recorder.stop();
    }
    streamRef.current?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = null;
    recorder?.stream.getTracks().forEach((track) => track.stop());
    const context = audioContextRef.current;
    audioContextRef.current = null;
    analyserRef.current = null;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stopStream, [stopStream]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state !== 'recording') return;
    stopRequestedRef.current = true;
    setRecorderState('finalizing');
    setInputLevel(0);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    recorderRef.current.stop();
  }, []);

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setPreviewState('loading');
    setSeconds(0);
    setInputLevel(0);
    setRecorderState('idle');
  };

  const startRecording = async () => {
    if (recordingSessionRef.current || status === 'sending') return;
    const session = {};
    recordingSessionRef.current = session;
    setMicError(null);
    setFormError(null);
    clearAudio();
    setRecorderState('starting');
    recordingErrorRef.current = null;
    stopRequestedRef.current = false;

    let stream: MediaStream;
    let context: AudioContext | undefined;
    try {
      context = new AudioContext();
      audioContextRef.current = context;
      void context.resume().catch(() => {});
    } catch {
      context = undefined;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (recordingSessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
    } catch (error) {
      if (recordingSessionRef.current !== session) return;
      stopStream();
      setRecorderState('idle');
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
    streamRef.current = stream;
    try {
      if (context) {
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
      }
    } catch {
      analyserRef.current = null;
    }
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      stopStream();
      setRecorderState('idle');
      setMicError('Tu navegador no permite grabar audio. Puedes dejarnos un mensaje de texto.');
      return;
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      if (recorderRef.current !== recorder) return;
      const failure = recordingErrorRef.current
        || (!stopRequestedRef.current ? 'El micrófono se interrumpió. Vuelve a grabar o adjunta un audio del teléfono.' : null);
      stopStream();
      setInputLevel(0);
      if (failure) {
        setMicError(failure);
        setRecorderState('idle');
        return;
      }
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

    recorderRef.current = recorder;
    stream.getAudioTracks().forEach((track) => {
      track.onended = stopRecording;
    });
    recorder.onerror = () => {
      recordingErrorRef.current = 'La grabación falló. Vuelve a grabar o adjunta un audio del teléfono.';
      stopRecording();
    };
    try {
      recorder.start();
    } catch {
      stopStream();
      setRecorderState('idle');
      setMicError('No pudimos iniciar la grabación. Intenta de nuevo o escribe tu mensaje.');
      return;
    }
    setRecorderState('recording');

    const startedAt = performance.now();
    const samples = new Float32Array(2048);
    timerRef.current = window.setInterval(() => {
      samples.fill(0);
      if (audioContextRef.current?.state === 'running') {
        analyserRef.current?.getFloatTimeDomainData(samples);
      }
      const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
      setInputLevel(Math.min(1, rms * 16));
      const elapsed = (performance.now() - startedAt) / 1000;
      setSeconds(Math.min(elapsed, MAX_AUDIO_SECONDS));
      if (elapsed >= MAX_AUDIO_SECONDS) stopRecording();
    }, 100);
  };

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || recordingSessionRef.current || status === 'sending') return;
    setMicError(null);
    const aliases: Record<string, string> = {
      'audio/x-m4a': 'audio/mp4',
      'audio/mp3': 'audio/mpeg',
      'audio/x-wav': 'audio/wav',
      'audio/wave': 'audio/wav',
    };
    const suppliedType = baseMime(file.type);
    const extension = file.name.split('.').pop()?.toLowerCase();
    const inferredType = Object.entries(AUDIO_EXTENSIONS).find(([, value]) => value === extension)?.[0];
    const type = aliases[suppliedType] || suppliedType || inferredType || '';
    if (!Object.hasOwn(AUDIO_EXTENSIONS, type)) {
      setMicError('Formato no compatible. Elige un audio M4A, MP3, WAV, AAC, OGG o WebM.');
      return;
    }
    if (file.size === 0 || file.size > MAX_AUDIO_BYTES) {
      setMicError('El audio debe contener datos y pesar como máximo 10 MB.');
      return;
    }
    clearAudio();
    setFormError(null);
    const blob = file.type === type ? file : new Blob([file], { type });
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
    setRecorderState('recorded');
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
    if (recordingSessionRef.current || recorderState === 'starting' || recorderState === 'recording' || recorderState === 'finalizing') return;
    setFormError(null);

    if (!nombre.trim()) {
      setFormError('Escribe tu nombre para saber de quién es el mensaje.');
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
  const isFinalizing = recorderState === 'finalizing';
  const isStarting = recorderState === 'starting';
  const isAudioBusy = isStarting || isRecording || isFinalizing;

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

            {!canRecord && (
              <p className="recuerdos-notice">
                <AlertCircle size={16} /> Tu navegador no permite grabar audio. Puedes adjuntar una grabación o escribir un mensaje.
              </p>
            )}
              <>
                {canRecord && recorderState !== 'recorded' && (
                  <div className="recuerdos-recorder">
                    <button
                      type="button"
                      className={`recuerdos-record ${isRecording ? 'is-recording' : ''}`}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isSending || isStarting || isFinalizing}
                      aria-label={isStarting ? 'Conectando micrófono' : isFinalizing ? 'Preparando audio' : isRecording ? 'Detener grabación' : 'Comenzar grabación'}
                    >
                      {isStarting || isFinalizing ? <Loader2 className="mesas-spin" size={26} /> : isRecording ? <Square size={22} fill="currentColor" /> : <Mic size={26} strokeWidth={1.5} />}
                    </button>
                    <p className="recuerdos-timer" aria-live="polite">
                      {isStarting ? 'Conectando micrófono...' : isFinalizing ? 'Preparando audio...' : isRecording
                        ? `${formatTime(seconds)} / ${formatTime(MAX_AUDIO_SECONDS)}`
                        : `Toca para grabar (máx. ${formatTime(MAX_AUDIO_SECONDS)})`}
                    </p>
                    {isRecording && (
                      <meter className="recuerdos-level" min={0} max={1} value={inputLevel} aria-label="Nivel del micrófono" />
                    )}
                  </div>
                )}

                {recorderState === 'recorded' && audioUrl && (
                  <div className="recuerdos-preview">
                    <audio
                      key={audioUrl}
                      controls={previewState === 'ready'}
                      src={audioUrl}
                      preload="auto"
                      onCanPlay={() => setPreviewState('ready')}
                      onError={() => setPreviewState('error')}
                    />
                    {previewState === 'loading' && (
                      <p className="recuerdos-notice" role="status">
                        <Loader2 className="mesas-spin" size={16} /> Preparando audio...
                      </p>
                    )}
                    {previewState === 'error' && (
                      <p className="recuerdos-notice" role="alert">
                        <AlertCircle size={16} /> No pudimos reproducir el audio. Puedes grabarlo de nuevo o enviar la grabación.
                      </p>
                    )}
                    <div className="recuerdos-actions">
                      <button type="button" onClick={startRecording} disabled={isSending || !canRecord}>
                        <RotateCcw size={14} /> Grabar de nuevo
                      </button>
                      <button type="button" onClick={clearAudio} disabled={isSending}>
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </>

            {/* <input
              ref={audioInputRef}
              className="recuerdos-file"
              type="file"
              accept="audio/*,.m4a,.mp3,.wav,.aac,.ogg,.webm,.3gp"
              onChange={handleAudioChange}
              disabled={isSending || isAudioBusy}
              aria-label="Adjuntar archivo de audio"
            />
            <div className="recuerdos-actions">
              <button type="button" onClick={() => audioInputRef.current?.click()} disabled={isSending || isAudioBusy}>
                <Paperclip size={14} /> Adjuntar audio
              </button>
            </div> */}

            {micError && <p className="recuerdos-notice" role="alert"><AlertCircle size={16} /> {micError}</p>}
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
            <button type="submit" className="mesas-primary" disabled={isSending || isAudioBusy || processingSelfie}>
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
