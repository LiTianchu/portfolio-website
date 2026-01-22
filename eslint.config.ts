import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,svelte}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser, parserOptions: { parser: tseslint.parser } },
        ignores: ['build/', 'dist/', '.svelte-kit/']
    },
    tseslint.configs.recommended,
    ...svelte.configs['flat/recommended'],
    eslintConfigPrettier,
    ...svelte.configs['flat/prettier']
]);
