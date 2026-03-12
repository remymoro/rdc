import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // Le domaine ne dépend de rien
            {
              sourceTag: 'scope:domain',
              onlyDependOnLibsWithTags: [],
            },
            // shared ne dépend de rien
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: [],
            },
            // L'API peut dépendre du domaine et des DTOs partagés
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:domain', 'scope:shared'],
            },
            // Le frontend ne peut dépendre QUE des DTOs partagés — jamais du domaine
            {
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
