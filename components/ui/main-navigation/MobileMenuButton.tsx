import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function MobileMenuButton({
    isOpen,
    ariaLabel,
    toggleMenu,
}: {
    isOpen: boolean;
    ariaLabel: string;
    toggleMenu: () => void;
}) {
    return (
        <button
            aria-label={ariaLabel}
            onClick={toggleMenu}
            className="block p-2 text-foreground transition md:hidden"
        >
            {isOpen ? (
                <XMarkIcon className="h-7 w-7" />
            ) : (
                <Bars4Icon className="h-7 w-7" />
            )}
        </button>
    );
}
