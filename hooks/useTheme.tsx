import { useLayoutEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useLayoutEffect(() => {
        const storedTheme = localStorage.getItem('theme') as
            | 'light'
            | 'dark'
            | null;
        if (storedTheme) {
            setTheme(storedTheme); // eslint-disable-line react-hooks/set-state-in-effect -- syncing from localStorage
            document.documentElement.classList.toggle(
                'dark',
                storedTheme === 'dark',
            );
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            document.documentElement.classList.toggle(
                'dark',
                newTheme === 'dark',
            );
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return { theme, toggleTheme };
}
