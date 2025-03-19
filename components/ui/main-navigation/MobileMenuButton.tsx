import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function MobileMenuButton({
    isOpen,
    toggleMenu,
}: {
    isOpen: boolean;
    toggleMenu: () => void;
}) {
    return (
        <button
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
