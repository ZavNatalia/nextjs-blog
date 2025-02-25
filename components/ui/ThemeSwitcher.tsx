import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function ThemeSwitcher({ theme, dictionary, toggleTheme }) {
    return (
        <button
            className="p-0 lg:p-1 rounded-xl"
            title={theme === 'light' ? dictionary.switchToDarkTheme : dictionary.switchToLightTheme}
            onClick={toggleTheme}
        >
            {theme === 'light' ? <MoonIcon
                    className="icon-button w-7 lg:w-5 h-7 lg:h-5 " /> :
                <SunIcon
                    className="icon-button w-7 lg:w-5 h-7 lg:h-5 " />}
        </button>
    )
}