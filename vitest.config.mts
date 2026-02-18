import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        setupFiles: ['./test/setup.ts'],
        projects: [
            {
                extends: true,
                test: {
                    name: 'node',
                    environment: 'node',
                    include: [
                        'lib/**/*.test.ts',
                        'app/api/**/*.test.ts',
                    ],
                },
            },
            {
                extends: true,
                test: {
                    name: 'jsdom',
                    environment: 'jsdom',
                    include: ['**/*.test.{ts,tsx}'],
                    exclude: [
                        'node_modules',
                        'e2e',
                        'lib/**/*.test.ts',
                        'app/api/**/*.test.ts',
                    ],
                },
            },
        ],
        coverage: {
            provider: 'v8',
            thresholds: {
                lines: 70,
                branches: 70,
                functions: 70,
                statements: 70,
            },
        },
    },
});
