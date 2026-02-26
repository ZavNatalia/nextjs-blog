import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            // Unused imports
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            // Import sorting
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            // Stricter accessibility rules (beyond Next.js recommended)
            'jsx-a11y/anchor-is-valid': 'warn',
            'jsx-a11y/no-redundant-roles': 'warn',
            'jsx-a11y/label-has-associated-control': 'warn',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'docs/**',
        'next-env.d.ts',
    ]),
]);

export default eslintConfig;
