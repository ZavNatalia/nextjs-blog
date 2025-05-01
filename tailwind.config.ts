import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
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
                    100: 'rgb(var(--color-muted-100) / <alpha-value>)',
                    500: 'rgb(var(--color-muted-500) / <alpha-value>)',
                    700: 'rgb(var(--color-muted-700) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['OpenSans', 'sans-serif'],
            },
            typography: (theme) => ({
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
    plugins: [
        typography(),
        plugin(({ addBase }) => {
            addBase({
                ':root': {
                    '--color-bg-primary': '255, 255, 255',
                    '--color-bg-secondary': '235, 235, 235',
                    '--color-bg-tertiary': '221, 225, 230',

                    '--color-fg-base': '17, 24, 39',
                    '--color-fg-accent': '77, 7, 163',
                    '--color-fg-muted': '100, 116, 139',
                    '--color-fg-contrast': '255, 255, 255',

                    '--color-border-100': '229, 231, 235',
                    '--color-border-500': '203, 213, 225',
                    '--color-border-700': '148, 163, 184',

                    '--color-accent-100': '145, 96, 205',
                    '--color-accent-500': '139, 92, 246',
                    '--color-accent-700': '109, 40, 217',

                    '--color-success-100': '220, 252, 231',
                    '--color-success-500': '34, 197, 94',
                    '--color-success-700': '21, 128, 61',

                    '--color-error-100': '254, 226, 226',
                    '--color-error-500': '239, 68, 68',
                    '--color-error-700': '153, 27, 27',

                    '--color-warning-100': '254, 243, 199',
                    '--color-warning-500': '245, 158, 11',
                    '--color-warning-700': '146, 64, 14',

                    '--color-info-100': '219, 234, 254',
                    '--color-info-500': '59, 130, 246',
                    '--color-info-700': '30, 64, 175',

                    '--color-muted-100': '243, 244, 246',
                    '--color-muted-500': '107, 114, 128',
                    '--color-muted-700': '55, 65, 81',
                },
                '.dark': {
                    '--color-bg-primary': '19, 23, 34',
                    '--color-bg-secondary': '33, 35, 52',
                    '--color-bg-tertiary': '47, 55, 71',

                    '--color-fg-base': '243, 244, 246',
                    '--color-fg-accent': '255, 118, 30',
                    '--color-fg-muted': '148, 163, 184',
                    '--color-fg-contrast': '15, 23, 42',

                    '--color-border-100': '55, 65, 81',
                    '--color-border-500': '31, 41, 55',
                    '--color-border-700': '17, 24, 39',

                    '--color-accent-100': '255, 237, 213',
                    '--color-accent-500': '251, 146, 60',
                    '--color-accent-700': '194, 65, 12',

                    '--color-success-100': '220, 252, 231',
                    '--color-success-500': '34, 197, 94',
                    '--color-success-700': '21, 128, 61',

                    '--color-error-100': '254, 202, 202',
                    '--color-error-500': '220, 38, 38',
                    '--color-error-700': '153, 27, 27',

                    '--color-warning-100': '254, 243, 199',
                    '--color-warning-500': '245, 158, 11',
                    '--color-warning-700': '146, 64, 14',

                    '--color-info-100': '219, 234, 254',
                    '--color-info-500': '59, 130, 246',
                    '--color-info-700': '30, 64, 175',

                    '--color-muted-100': '30, 41, 59',
                    '--color-muted-500': '107, 114, 128',
                    '--color-muted-700': '71, 85, 105',
                },
            });
        }),
    ],
};

export default config;
