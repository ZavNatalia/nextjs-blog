'use client';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useDictionary } from '@/hooks/useDictionary';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/Loader';

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
            <div className="p-0 md:p-1">
                <Loader
                    size={20}
                    primaryColor="#4b5463"
                    secondaryColor="#9aa8bd"
                />
            </div>
        );
    }

    if (mounted) {
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
    return null;
}
