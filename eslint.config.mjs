import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Flat config nativa. Next 16 eliminó el comando `next lint` y
 * @next/eslint-plugin-next ya exporta flat config, así que no hace falta el
 * puente FlatCompat de eslintrc que había aquí.
 */
const eslintConfig = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // eslint-plugin-react 7.37 detecta la versión de React con una API que
    // ESLint 10 ya no expone, y revienta al arrancar. Declarándola a mano se
    // salta esa detección. Se puede quitar cuando el plugin se actualice.
    settings: { react: { version: '19.2' } },
  },
];

export default eslintConfig;
