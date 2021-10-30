module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    'import',
    'eslint-comments',
    'simple-import-sort',
  ],
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    allowAutomaticSingleRunInference: true,
    ecmaVersion: 12,
    EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
    project: ['./tsconfig.eslint.json', './*/tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  rules: {
    // ================== //
    // @typescript-eslint //
    // ================== //
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 5,
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string',
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean',
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number',
          },
          Symbol: {
            message: 'Use symbol instead',
            fixWith: 'symbol',
          },
          Function: {
            message: [
              'The `Function` type accepts any function-like value.',
              'It provides no type safety when calling the function, which can be a common source of bugs.',
              'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
              'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
            ].join('\n'),
          },
          '{}': {
            message: [
              '`{}` actually means "any non-nullish value".',
              '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.',
            ].join('\n'),
          },
        },
        extendDefaults: false,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['arrowFunctions'] },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true,
        allowNullish: true,
        allowRegExp: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],

    // =========== //
    // eslint base //
    // =========== //
    curly: ['error', 'all'],
    'linebreak-style': ['error', 'unix'],
    'no-mixed-operators': 'error',
    'no-console': 'error',
    'no-process-exit': 'error',
    'no-fallthrough': [
      'error',
      { commentPattern: '.*intentional fallthrough.*' },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],

    // ============================ //
    // eslint-plugin-eslint-comment //
    // ============================ //
    // Require a eslint-enable comment for every eslint-disable comment
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
    // Disallow a eslint-enable comment for multiple eslint-disable comments
    'eslint-comments/no-aggregating-enable': 'error',
    // Disallow duplicate eslint-disable comments
    'eslint-comments/no-duplicate-disable': 'error',
    // Disallow eslint-disable comments without rule names
    'eslint-comments/no-unlimited-disable': 'error',
    // Disallow unused eslint-disable comments
    'eslint-comments/no-unused-disable': 'error',
    // Disallow unused eslint-enable comments
    'eslint-comments/no-unused-enable': 'error',
    // Disallow ESLint directive-comments
    'eslint-comments/no-use': [
      'error',
      {
        allow: [
          'eslint-disable',
          'eslint-disable-line',
          'eslint-disable-next-line',
          'eslint-enable',
        ],
      },
    ],

    // ==================== //
    // eslint-plugin-import //
    // ==================== //
    // Disallow non-import statements appearing before import statements
    'import/first': 'error',
    // Require a newline after the last import/require in a group
    'import/newline-after-import': 'error',
    // Forbid import of modules using absolute paths
    'import/no-absolute-path': 'error',
    // Disallow AMD require/define
    'import/no-amd': 'error',
    // Forbid the use of extraneous packages
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        peerDependencies: true,
        optionalDependencies: false,
      },
    ],
    // Forbid mutable exports
    'import/no-mutable-exports': 'error',
    // Forbid a module from importing itself
    'import/no-self-import': 'error',

    // ================================ //
    // eslint-plugin-simple-import-sort //
    // ================================ //
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    // JavaScript files
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
        'no-process-exit': 'off',
      },
    },
    // Test files
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**/*.ts'],
      env: {
        'jest/globals': true,
      },
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-alias-methods': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-done-callback': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/prefer-to-be': 'error',
        'jest/prefer-to-contain': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/prefer-spy-on': 'error',
        'jest/valid-expect': 'error',
        'jest/no-deprecated-functions': 'error',
      },
    },
    // React files
    {
      files: ['frontend/**/*.tsx', 'frontend/**/*.ts'],
      env: {
        browser: true,
        es2021: true,
      },
      plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
        'jsx-a11y',
        'import',
        'eslint-comments',
        'simple-import-sort',
      ],
      extends: [
        'plugin:jsx-a11y/strict',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'react/jsx-boolean-value': ['error', 'always'],
        'react/jsx-sort-props': 'error',
        // Checks effect dependencies
        'react-hooks/exhaustive-deps': 'error',
        // Checks rules of Hooks
        'react-hooks/rules-of-hooks': 'error',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages. `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              [
                '^(app|assets|components|constants|contexts|data|routes|sections|utils)(/.*|$)',
              ],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` behind, and style imports last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$', '^.+\\.s?css$'],
            ],
          },
        ],
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    // TypeScript backend files
    {
      files: ['history/**/*.ts', 'pairing/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages packages come first.
              ['^@?\\w'],
              // Internal packages.
              [
                '^(constants|controllers|lib|middlewares|policies|routes|services|socket|structures|types|utils)(/.*|$)',
              ],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
