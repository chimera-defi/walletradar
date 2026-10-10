import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    // Mount/hydration effects (theme, SSR guards) intentionally set state in effects.
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
  { ignores: ['out/**', '.next/**'] },
];

export default config;
