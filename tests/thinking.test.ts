import { describe, expect, it } from 'vitest';
import { splitReply } from '@/components/chat/thinking';

describe('splitReply', () => {
  it('separa el preámbulo de la respuesta', () => {
    const { reasoning, answer, thinking } = splitReply('<think>Miro Talkrev.</think>El reto fue el RAG.');
    expect(reasoning).toBe('Miro Talkrev.');
    expect(answer).toBe('El reto fue el RAG.');
    expect(thinking).toBe(false);
  });

  it('marca que sigue pensando mientras el preámbulo está abierto', () => {
    const { reasoning, answer, thinking } = splitReply('<think>Me pregunta por mi stack');
    expect(reasoning).toBe('Me pregunta por mi stack');
    expect(answer).toBe('');
    expect(thinking).toBe(true);
  });

  it('no pinta la etiqueta a medio llegar', () => {
    expect(splitReply('<thi')).toEqual({ reasoning: '', answer: '', thinking: true });
  });

  it('devuelve el texto tal cual si el modelo no usa el preámbulo', () => {
    expect(splitReply('Trabajo en Nanonino SL.')).toEqual({
      reasoning: '',
      answer: 'Trabajo en Nanonino SL.',
      thinking: false,
    });
  });
});
