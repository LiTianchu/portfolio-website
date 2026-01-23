import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    prettierConfig,
    {
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
