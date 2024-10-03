import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(30 41 59)', // slate-800
                    light: 'rgb(71 85 105)', // slate-600
                    dark: 'rgb(9, 11, 17)', // slate-900
                },
                accent: {
                    DEFAULT: 'rgb(245 158 11)', // amber-500
                    hover: 'rgb(180 83 9)', // amber-700
                },
            },
            textColor: {
                primary: 'rgb(229 231 235)', // gray-200
                secondary: 'rgb(156 163 175)', // gray-400
                muted: 'rgb(107 114 128)', // gray-500
            },
            typography: ({ theme }) => ({
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
    plugins: [typography],
};

export default config;
