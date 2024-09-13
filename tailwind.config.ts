import plugin from 'tailwindcss';

const config: {
  plugins: (plugin | ((options?: Partial<{ className: string; target: "modern" | "legacy" }>) => {
    handler: () => void
  }))[];
  theme: {
    extend: {
      typography: (theme) => { DEFAULT: { css: { color: any } } };
      textColor: { secondary: string; muted: string; primary: string };
      colors: (theme) => {
        accent: { hover: string; DEFAULT: string };
        primary: { light: string; dark: string; DEFAULT: string }
      }
    }
  };
  content: string[]
} = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:() => {
        return {
          primary: {
            DEFAULT: 'hsl(237,25%,15%)',
            light: 'hsl(214,14%,30%)',
            dark: 'hsl(224,71%,4%)',
          },
          accent: {
            DEFAULT: 'hsl(38,92%,50%)',
            hover: 'hsl(26,90%,37%)',
          },
        }
      },
      textColor: {
        primary: 'hsl(216,9%,90%)',
        secondary: 'hsl(205,17%,70%)',
        muted: 'hsl(188,6%,49%)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
export default config;
