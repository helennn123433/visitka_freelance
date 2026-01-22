module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'vue/script-setup-uses-vars': 'error',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
  overrides: [
    {
      files: ['**/tests/**/*.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};

