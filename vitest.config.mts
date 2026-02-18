import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        environmentMatchGlobs: [
            ['lib/**', 'node'],
            ['app/api/**', 'node'],
        ],
        exclude: ['node_modules', 'e2e'],
        setupFiles: ['./test/setup.ts'],
    },
});
