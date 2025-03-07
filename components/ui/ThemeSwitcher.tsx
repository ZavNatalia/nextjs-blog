'use client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useDictionary } from '@/hooks/useDictionary';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const dictionary = useDictionary()?.['navigation'];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            className="icon-button rounded-xl p-0 md:p-1"
            title={
                theme === 'light'
                    ? dictionary.switchToDarkTheme
                    : dictionary.switchToLightTheme
            }
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            {theme === 'light' ? (
                <MoonIcon className="h-8 w-8 md:h-5 md:w-5" />
            ) : (
                <SunIcon className="h-8 w-8 md:h-5 md:w-5" />
            )}
        </button>
    );
}
