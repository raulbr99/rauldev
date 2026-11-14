/**
 * Mapa id de `data/projects.json` → clave del namespace `projects.data` en
 * `messages/*.json`. Lo comparten la tarjeta visible y el JSON-LD para que
 * ambos muestren el mismo título/descripción traducidos.
 */
export const projectKeyMap: Record<string, string> = {
  'bomkai-generator': 'bomkai',
  cuotia: 'cuotia',
  'alicante-voxels': 'alicanteVoxels',
  'callosa-voxels': 'callosaVoxels',
  duskline: 'duskline',
  'portfolio-website': 'portfolio',
};
