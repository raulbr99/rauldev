'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUp, Check, Copy, MessageSquare, RotateCcw, Square, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useTranslations, useLocale } from 'next-intl';
import Markdown from './Markdown';
import ReasoningTrace from './ReasoningTrace';
import { splitReply } from './thinking';

const SUGGESTION_KEYS = ['whatIBuild', 'challenge', 'availability', 'aiExperience', 'teamwork', 'whyHire', 'stack', 'contact'] as const;

const MAX_CHARS = 500;
/** Altura máxima del campo antes de hacerse scrollable (unas 4 líneas). */
const INPUT_MAX_HEIGHT = 112;

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const stickToBottom = useRef(true);

  // Pasa el idioma de la página como pista por defecto (la regla principal es
  // responder en el idioma del mensaje del usuario).
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { locale } }),
    [locale]
  );
  const { messages, sendMessage, status, stop, error, setMessages, clearError } = useChat({ transport });

  const busy = status === 'submitted' || status === 'streaming';
  const rateLimited = error?.message.includes('rate_limited') ?? false;

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (!stickToBottom.current) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, busy, reduce]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Al abrir, el foco va al campo de texto; Escape cierra y devuelve el foco
  // al botón flotante (patrón de diálogo accesible).
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const resizeInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, INPUT_MAX_HEIGHT)}px`;
  }, []);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    clearError();
    stickToBottom.current = true;
    sendMessage({ text: value });
    setInput('');
    requestAnimationFrame(resizeInput);
  };

  const reset = () => {
    stop();
    clearError();
    setMessages([]);
    setInput('');
    requestAnimationFrame(resizeInput);
    inputRef.current?.focus();
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
    } catch {
      // Sin portapapeles (contexto no seguro o permiso denegado): no pasa nada.
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('close') : t('open')}
        aria-expanded={open}
        aria-controls="chat-dialog"
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center bg-[#D1FF26] text-[#0A0A0A] shadow-[0_0_0_1px_rgba(209,255,38,0.5),0_14px_40px_-12px_rgba(209,255,38,0.75)] transition-transform hover:scale-105 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping bg-[#D1FF26] opacity-75" />
            <span className="relative inline-flex h-3 w-3 bg-[#D1FF26]" />
          </span>
        )}
      </button>

      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-dialog"
            role="dialog"
            aria-label={t('dialogLabel')}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed inset-x-3 bottom-24 z-[90] flex h-[min(36rem,calc(100dvh-8rem))] flex-col border border-[#252525] bg-[#0F0F0F] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-[25rem]"
          >
            {/* Filo superior: el acento de la marca antes que nada */}
            <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#D1FF26]/70 to-transparent" />

            {/* Header */}
            <header className="flex items-center gap-3 border-b border-[#252525] bg-[#1A1A1A] px-3.5 py-3">
              <div className="relative shrink-0">
                <div className="relative h-10 w-10 overflow-hidden border border-[#D1FF26]/40">
                  <Image src="/me.jpg" alt="" fill sizes="40px" className="object-cover" />
                </div>
                <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border-2 border-[#0F0F0F] bg-[#D1FF26]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold leading-tight text-white">{t('title')}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#606060]">
                  <span className={`h-1 w-1 shrink-0 ${busy ? 'animate-pulse bg-[#D1FF26]' : 'bg-[#D1FF26]'}`} aria-hidden />
                  <span className={`truncate ${busy ? 'text-[#D1FF26]/90' : ''}`}>{busy ? t('typing') : t('status')}</span>
                </p>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    aria-label={t('reset')}
                    title={t('reset')}
                    className="flex h-8 w-8 items-center justify-center text-[#606060] transition-colors hover:bg-white/5 hover:text-[#D1FF26]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="flex h-8 w-8 items-center justify-center text-[#606060] transition-colors hover:bg-white/5 hover:text-[#D1FF26]"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </header>

            {/* Mensajes */}
            <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto" aria-live="polite">
              <div className="flex min-h-full flex-col justify-end space-y-3.5 px-3.5 py-4">
                {/* Saludo */}
                <div className="border-l-2 border-[#D1FF26]/50 bg-white/[0.035] px-3.5 py-2.5 text-sm leading-relaxed text-[#A0A0A0]">
                  {t('greeting')}
                </div>

                {/* Sugerencias: etiqueta corta a la vista, pregunta completa al modelo */}
                {messages.length === 0 && (
                  <div className="pt-1">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#606060]">
                      {t('suggestionsTitle')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTION_KEYS.map((key) => (
                        <button
                          key={key}
                          onClick={() => submit(t(`suggestions.${key}`))}
                          title={t(`suggestions.${key}`)}
                          className="group flex items-center gap-1.5 border border-[#252525] bg-[#0A0A0A] px-2.5 py-1.5 font-mono text-[11px] text-[#A0A0A0] transition-colors hover:border-[#D1FF26]/50 hover:bg-[#D1FF26]/10 hover:text-[#D1FF26]"
                        >
                          {t(`suggestionLabels.${key}`)}
                          <span aria-hidden className="text-[#404040] transition-transform group-hover:translate-x-0.5 group-hover:text-[#D1FF26]">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => {
                  const raw = m.parts
                    .filter((p) => p.type === 'text')
                    .map((p) => p.text)
                    .join('');
                  const isUser = m.role === 'user';
                  const isLast = i === messages.length - 1;

                  // El razonamiento llega de dos sitios: los `reasoning` parts
                  // nativos (si el modelo los emite) y el preámbulo <think> que
                  // le pide el prompt, que funciona con cualquier modelo.
                  const nativeParts = m.parts.filter((p) => p.type === 'reasoning');
                  const { reasoning: preamble, answer, thinking } = splitReply(raw);
                  const text = isUser ? raw : answer;
                  const reasoning = [nativeParts.map((p) => p.text).join('\n\n'), preamble]
                    .filter(Boolean)
                    .join('\n\n')
                    .trim();
                  const reasoningLive =
                    nativeParts.some((p) => p.state === 'streaming') || (thinking && isLast && busy);

                  if (isUser) {
                    return (
                      <motion.div
                        key={m.id}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="flex justify-end"
                      >
                        <p className="max-w-[85%] whitespace-pre-wrap bg-[#D1FF26] px-3.5 py-2 text-sm font-medium leading-relaxed text-[#0A0A0A]">
                          {text}
                        </p>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={m.id}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className="group space-y-1.5"
                    >
                      {reasoning && <ReasoningTrace text={reasoning} streaming={reasoningLive} />}

                      {text && (
                        <div className="border-l-2 border-[#D1FF26]/50 bg-white/[0.035] px-3.5 py-2.5 text-sm text-[#A0A0A0]">
                          <Markdown>{text}</Markdown>
                        </div>
                      )}

                      {text && !busy && (
                        <button
                          onClick={() => copy(m.id, text)}
                          aria-label={t('copy')}
                          className="ml-0.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#606060] opacity-0 transition-opacity hover:text-[#D1FF26] focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="h-3 w-3" aria-hidden /> {t('copied')}
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" aria-hidden /> {t('copy')}
                            </>
                          )}
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {status === 'submitted' && (
                  <div className="flex" aria-label={t('thinking')}>
                    <div className="flex gap-1 border-l-2 border-[#D1FF26]/50 bg-white/[0.035] px-3.5 py-3.5">
                      <span className="h-1.5 w-1.5 animate-bounce bg-[#D1FF26] [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce bg-[#D1FF26] [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce bg-[#D1FF26]" />
                    </div>
                  </div>
                )}

                {error && (
                  <div role="alert" className="border-l-2 border-red-500/60 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
                    {rateLimited ? t('rateLimited') : t('error')}
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-[#252525] p-2.5"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t('placeholder')}
              </label>
              <div className="flex items-end gap-2 border border-[#252525] bg-[#0A0A0A] px-2.5 py-1 transition-colors focus-within:border-[#D1FF26]/70 focus-within:bg-white/[0.05]">
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    resizeInput();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  placeholder={t('placeholder')}
                  maxLength={MAX_CHARS}
                  autoComplete="off"
                  enterKeyHint="send"
                  className="max-h-28 min-w-0 flex-1 resize-none bg-transparent py-2 font-mono text-sm leading-relaxed text-white outline-none placeholder:text-[#606060]"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    aria-label={t('stop')}
                    className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center border border-[#252525] text-white transition-colors hover:border-[#D1FF26]/60 hover:text-[#D1FF26]"
                  >
                    <Square className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label={t('send')}
                    disabled={!input.trim()}
                    className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center bg-[#D1FF26] text-[#0A0A0A] transition-colors hover:bg-[#D1FF26]/90 disabled:cursor-not-allowed disabled:bg-[#252525] disabled:text-[#606060]"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-2 flex items-start gap-2 px-0.5">
                <p className="min-w-0 flex-1 font-mono text-[10px] leading-snug text-[#606060]">{t('disclaimer')}</p>
                {input.length > MAX_CHARS * 0.8 && (
                  <span className="shrink-0 font-mono text-[10px] text-[#606060]">
                    {input.length}/{MAX_CHARS}
                  </span>
                )}
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
