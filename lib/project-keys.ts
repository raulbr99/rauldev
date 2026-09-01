/**
 * Mapa id de `data/projects.json` → clave del namespace `projects.data` en
 * `messages/*.json`. Lo comparten la tarjeta visible y el JSON-LD para que
 * ambos muestren el mismo título/descripción traducidos.
 */
export const projectKeyMap: Record<string, string> = {
  'bomkai-generator': 'bomkai',
  'fadesso-saas': 'fadesso',
  cuotia: 'cuotia',
  'portfolio-website': 'portfolio',
  'clinica-dental-marina': 'clinicaDentalMarina',
  'estudio-aire': 'estudioAire',
  'gestoria-llobet': 'gestoriaLlobet',
  'taller-bernabeu': 'tallerBernabeu',
  'casa-ribes': 'casaRibes',
  'altea-suite-vault': 'alteaSuiteVault',
};
