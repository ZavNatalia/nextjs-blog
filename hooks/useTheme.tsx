import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(
        () => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'dark'
    );

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.add(localStorage.getItem('theme') || 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
