import { config } from 'zod';

/**
 * El chat valida sus mensajes con Zod (lo trae el SDK de IA). Zod 4 comprueba
 * al arrancar si puede compilar validadores con `Function("")`; la CSP del
 * sitio no deja usar eval, así que el navegador lo bloquea y lo apunta como
 * incidencia de seguridad (Lighthouse baja «buenas prácticas»). En modo
 * `jitless` Zod no hace esa prueba y valida igual, sin compilar.
 */
config({ jitless: true });
