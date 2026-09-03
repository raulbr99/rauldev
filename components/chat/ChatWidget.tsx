'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageSquare, X, Send, Square, RotateCcw, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useTranslations, useLocale } from 'next-intl';
import Markdown from './Markdown';

const SUGGESTION_KEYS = ['achievement', 'challenge', 'teamwork', 'availability', 'aiExperience'] as const;

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

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

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    clearError();
    sendMessage({ text: value });
    setInput('');
  };

  const reset = () => {
    stop();
    clearError();
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
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
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center border border-cyan-400/40 bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105 active:scale-95"
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
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
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
            className="fixed bottom-24 right-5 z-[90] flex h-[min(34rem,calc(100dvh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col border border-white/15 bg-slate-950/95 backdrop-blur-md shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-techgrid px-4 py-3">
              <div className="relative h-9 w-9 overflow-hidden border border-cyan-400/40">
                <Image src="/me.png" alt="" fill sizes="36px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{t('title')}</p>
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-gray-400">
                  <Sparkles className="h-3 w-3 text-cyan-300" aria-hidden />
                  {t('status')}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={reset}
                    aria-label={t('reset')}
                    title={t('reset')}
                    className="-m-1 p-1 text-gray-400 transition-colors hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="-m-1 p-1 text-gray-400 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {/* Saludo + sugerencias */}
              <div className="max-w-[85%] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-gray-200">
                {t('greeting')}
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTION_KEYS.map((key) => {
                    const label = t(`suggestions.${key}`);
                    return (
                      <button
                        key={key}
                        onClick={() => submit(label)}
                        className="border border-white/15 px-2.5 py-1.5 font-mono text-[11px] text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {messages.map((m) => {
                const text = m.parts
                  .filter((p) => p.type === 'text')
                  .map((p) => (p as { text: string }).text)
                  .join('');
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3 py-2 text-sm ${
                        isUser
                          ? 'whitespace-pre-wrap bg-cyan-400 text-slate-950'
                          : 'border border-white/10 bg-white/[0.04] text-gray-200'
                      }`}
                    >
                      {isUser ? text : <Markdown>{text}</Markdown>}
                    </div>
                  </div>
                );
              })}

              {status === 'submitted' && (
                <div className="flex justify-start" aria-label={t('thinking')}>
                  <div className="flex gap-1 border border-white/10 bg-white/[0.04] px-3 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                  </div>
                </div>
              )}

              {error && (
                <div role="alert" className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {rateLimited ? t('rateLimited') : t('error')}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t('placeholder')}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                maxLength={500}
                autoComplete="off"
                enterKeyHint="send"
                className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-3 py-2.5 font-mono text-sm text-white placeholder-gray-500 transition-colors focus:border-cyan-400 focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label={t('stop')}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/20 text-white transition-colors hover:border-cyan-400/60"
                >
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label={t('send')}
                  disabled={!input.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-cyan-400 text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </form>
            <p className="px-3 pb-2 text-center font-mono text-[10px] leading-snug text-gray-500">{t('disclaimer')}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
