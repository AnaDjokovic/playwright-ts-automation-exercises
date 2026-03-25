import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
);
