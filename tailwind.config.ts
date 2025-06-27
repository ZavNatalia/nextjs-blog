import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{ts,tsx,js,jsx,mdx}',
        './components/**/*.{ts,tsx,js,jsx,mdx}',
        './pages/**/*.{ts,tsx,js,jsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    primary: 'rgba(var(--color-bg-primary), <alpha-value>)',
                    secondary: 'rgba(var(--color-bg-secondary), <alpha-value>)',
                    tertiary: 'rgba(var(--color-bg-tertiary), <alpha-value>)',
                },
                foreground: {
                    DEFAULT: 'rgba(var(--color-fg-base), <alpha-value>)',
                    accent: 'rgba(var(--color-fg-accent), <alpha-value>)',
                    muted: 'rgba(var(--color-fg-muted), <alpha-value>)',
                    contrast: 'rgba(var(--color-fg-contrast), <alpha-value>)',
                },
                border: {
                    100: 'rgba(var(--color-border-100), <alpha-value>)',
                    500: 'rgba(var(--color-border-500), <alpha-value>)',
                    700: 'rgba(var(--color-border-700), <alpha-value>)',
                },
                accent: {
                    100: 'rgba(var(--color-accent-100), <alpha-value>)',
                    500: 'rgba(var(--color-accent-500), <alpha-value>)',
                    700: 'rgba(var(--color-accent-700), <alpha-value>)',
                },
                success: {
                    100: 'rgba(var(--color-success-100), <alpha-value>)',
                    500: 'rgba(var(--color-success-500), <alpha-value>)',
                    700: 'rgba(var(--color-success-700), <alpha-value>)',
                },
                error: {
                    100: 'rgba(var(--color-error-100), <alpha-value>)',
                    500: 'rgba(var(--color-error-500), <alpha-value>)',
                    700: 'rgba(var(--color-error-700), <alpha-value>)',
                },
                warning: {
                    100: 'rgba(var(--color-warning-100), <alpha-value>)',
                    500: 'rgba(var(--color-warning-500), <alpha-value>)',
                    700: 'rgba(var(--color-warning-700), <alpha-value>)',
                },
                info: {
                    100: 'rgba(var(--color-info-100), <alpha-value>)',
                    500: 'rgba(var(--color-info-500), <alpha-value>)',
                    700: 'rgba(var(--color-info-700), <alpha-value>)',
                },
                muted: {
                    100: 'rgba(var(--color-muted-100) / <alpha-value>)',
                    500: 'rgba(var(--color-muted-500) / <alpha-value>)',
                    700: 'rgba(var(--color-muted-700) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['OpenSans', 'sans-serif'],
            },
            typography: (theme: (path: string) => string) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.foreground.DEFAULT'),
                        a: {
                            color: theme('colors.accent.500'),
                            '&:hover': {
                                color: theme('colors.accent.700'),
                            },
                        },
                        h2: {
                            color: theme('colors.accent.500'),
                        },
                        strong: {
                            color: theme('colors.foreground.DEFAULT'),
                        },
                    },
                },
            }),
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-out': {
                    '0%': { width: '100%' },
                    '100%': { width: '0%' },
                },
            },
            animation: {
                'slide-in': 'slide-in 0.2s ease-out',
                'slide-out': 'slide-out 2s linear forwards',
            },
        },
    },
    plugins: [typography()],
};

export default config;
