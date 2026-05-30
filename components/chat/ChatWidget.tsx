'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { MessageSquare, X, Send, Square } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useTranslations, useLocale } from 'next-intl';
import Markdown from './Markdown';

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pasa el idioma de la página como pista por defecto (la regla principal es
  // responder en el idioma del mensaje del usuario).
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { locale } }),
    [locale]
  );
  const { messages, sendMessage, status, stop, error } = useChat({ transport });

  const busy = status === 'submitted' || status === 'streaming';

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput('');
  };

  const suggestions = [
    t('suggestions.stack'),
    t('suggestions.experience'),
    t('suggestions.available'),
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('close') : t('open')}
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
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
          </span>
        )}
      </button>

      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[90] flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col border border-white/15 bg-slate-950/95 backdrop-blur-md shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-techgrid px-4 py-3">
              <div className="relative h-9 w-9 overflow-hidden border border-cyan-400/40">
                <Image src="/me.png" alt="Raúl" fill sizes="36px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{t('title')}</p>
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-gray-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {t('status')}
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t('close')} className="ml-auto text-gray-500 transition-colors hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {/* Saludo + sugerencias */}
              <div className="max-w-[85%] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-200">
                {t('greeting')}
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="border border-white/15 px-2.5 py-1.5 font-mono text-[11px] text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
                    >
                      {s}
                    </button>
                  ))}
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
                <div className="flex justify-start">
                  <div className="flex gap-1 border border-white/10 bg-white/[0.04] px-3 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                  </div>
                </div>
              )}

              {error && (
                <div className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {t('error')}
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
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                maxLength={500}
                className="min-w-0 flex-1 border border-white/15 bg-white/[0.04] px-3 py-2.5 font-mono text-sm text-white placeholder-gray-500 transition-colors focus:border-cyan-400 focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  aria-label="Stop"
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
            <p className="pb-2 text-center font-mono text-[10px] text-gray-600">{t('disclaimer')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
