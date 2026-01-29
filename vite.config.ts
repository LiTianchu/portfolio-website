import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    base: '/portfolio-website/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@comp': path.resolve(__dirname, './src/Components'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@states': path.resolve(__dirname, './src/states'),
        },
    },
});
