import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ffffff',
                    light: '#eeeeee',
                    contrast: '#dde1e6',
                },
                dark: {
                    DEFAULT: '#212334',
                    soft: '#394454',
                    strong: '#131722',
                },
                foreground: {
                    DEFAULT: '#1d1d1d',
                    muted: '#4b5563',
                    contrast: '#ffffff',
                    subtle: '#6b7280',
                    onDark: '#e2e8f0',
                    onDarkMuted: '#9aa8bd',
                },
                accent: {
                    DEFAULT: 'rgb(238,126,50)',
                    light: 'rgb(252,158,95)',
                    dark: '#bf590b',
                    darker: '#9e4610',
                },
                muted: {
                    DEFAULT: '#6b7280',
                    light: '#9ca3af',
                    dark: '#4b5563',
                    darker: '#374151',
                },
                error: {
                    light: '#f86363',
                    DEFAULT: '#dc2626',
                    dark: '#a01d1d',
                },
                border: {
                    DEFAULT: '#d1d5db',
                    dark: '#374151',
                    light: '#e5e7eb',
                    error: '#dc2626',
                },
            },
            typography: (theme: (path: string) => string) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.300'),
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
    corePlugins: {
        hyphens: true,
    },
};

export default config;
