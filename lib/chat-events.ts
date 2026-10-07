/**
 * Puente para abrir el chat desde fuera del widget (p. ej. el hero). El widget
 * se monta de forma diferida, así que si la petición llega antes de que exista
 * queda anotada y el widget la recoge al montarse.
 */
export const OPEN_CHAT_EVENT = 'rauldev:open-chat';

let pending = false;

export function requestOpenChat(): void {
  pending = true;
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

/** Devuelve si había una petición pendiente y la da por atendida. */
export function consumePendingOpen(): boolean {
  const wasPending = pending;
  pending = false;
  return wasPending;
}
