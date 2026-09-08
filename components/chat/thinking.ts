const OPEN = '<think>';
const CLOSE = '</think>';

export type SplitReply = {
  /** El preámbulo de razonamiento del modelo, sin etiquetas. */
  reasoning: string;
  /** La respuesta visible, ya sin el preámbulo. */
  answer: string;
  /** true mientras el preámbulo sigue abierto (aún está pensando). */
  thinking: boolean;
};

/**
 * Separa el preámbulo `<think>…</think>` que el prompt le pide al modelo del
 * texto de la respuesta. Tolera el streaming: mientras la etiqueta llega a
 * trozos ("<", "<thi"…) no se pinta nada, y si el modelo no usa el preámbulo
 * —los modelos de respaldo pueden saltárselo— la respuesta sale entera.
 */
export function splitReply(text: string): SplitReply {
  const start = text.indexOf(OPEN);

  if (start === -1) {
    // La etiqueta puede estar llegando carácter a carácter: no la enseñes a medias.
    const head = text.trimStart();
    if (head.length > 0 && head.length < OPEN.length && OPEN.startsWith(head)) {
      return { reasoning: '', answer: '', thinking: true };
    }
    return { reasoning: '', answer: text, thinking: false };
  }

  const before = text.slice(0, start);
  const rest = text.slice(start + OPEN.length);
  const end = rest.indexOf(CLOSE);

  if (end === -1) {
    return { reasoning: rest.trim(), answer: before.trim(), thinking: true };
  }

  return {
    reasoning: rest.slice(0, end).trim(),
    answer: (before + rest.slice(end + CLOSE.length)).trim(),
    thinking: false,
  };
}
