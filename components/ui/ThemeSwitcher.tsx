'use client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useDictionary } from '@/hooks/useDictionary';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const dictionary = useDictionary()?.['navigation'];

    useEffect(() => {
        setMounted(true);
        setIsLoading(false);
    }, [mounted, isLoading]);

    if (isLoading) {
        return (
            <div className="m-1 h-5 w-5 animate-pulse rounded-full bg-primary-contrast dark:bg-dark-strong" />
        );
    }

    if (!mounted) {
        return null;
    }

    return (
        <button
            className="icon-button rounded-xl p-0 duration-0 md:p-1"
            aria-label={
                theme === 'light'
                    ? dictionary.switchToDarkTheme
                    : dictionary.switchToLightTheme
            }
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
