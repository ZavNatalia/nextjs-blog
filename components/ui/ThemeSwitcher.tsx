import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface ThemeSwitcherProps {
    theme: 'light' | 'dark';
    dictionary: {
        switchToDarkTheme: string;
        switchToLightTheme: string;
    };
    toggleTheme: () => void;
}
export default function ThemeSwitcher({
    theme,
    dictionary,
    toggleTheme,
}: ThemeSwitcherProps) {
    return (
        <button
            className="rounded-xl p-0 md:p-1"
            title={
                theme === 'light'
                    ? dictionary.switchToDarkTheme
                    : dictionary.switchToLightTheme
            }
            onClick={toggleTheme}
        >
            {theme === 'light' ? (
                <MoonIcon className="icon-button h-8 w-8 md:h-5 md:w-5" />
            ) : (
                <SunIcon className="icon-button h-8 w-8 md:h-5 md:w-5" />
            )}
        </button>
    );
}
