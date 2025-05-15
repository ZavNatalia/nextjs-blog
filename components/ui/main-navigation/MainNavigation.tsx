'use client';
import React, { useState } from 'react';
import Logo from '@/components/ui/Logo';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/hooks/useDictionary';
import { MobileMenuButton } from '@/components/ui/main-navigation/MobileMenuButton';
import { NavigationList } from '@/components/ui/main-navigation/NavigationList';
import { NavigationControls } from '@/components/ui/main-navigation/NavigationControls';

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dictionary = useDictionary()?.['navigation'];

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const normalizedPathname =
        pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';

    return (
        <header
            className={`z-10 shadow-md md:sticky md:top-0 ${
                isOpen ? 'bg-tertiary' : 'bg-secondary'
            } `}
        >
            <div className="mx-auto flex max-w-[90rem] items-center justify-between p-2 md:p-3">
                <Logo title={dictionary['home']} />

                <MobileMenuButton
                    ariaLabel={
                        isOpen ? dictionary.closeMenu : dictionary.openMenu
                    }
                    isOpen={isOpen}
                    toggleMenu={toggleMenu}
                />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                    <NavigationList
                        normalizedPathname={normalizedPathname}
                        session={session}
                        status={status}
                        dictionary={dictionary}
                    />
                    <NavigationControls />
                </nav>

                {/* Mobile Navigation */}
                {isOpen && (
                    <nav className="bg-tertiary absolute left-0 top-[60px] w-full border-t border-t-border-700 p-6 shadow-lg md:hidden">
                        <ul className="flex flex-col gap-4 text-lg">
                            <NavigationList
                                normalizedPathname={normalizedPathname}
                                session={session}
                                status={status}
                                dictionary={dictionary}
                                onClick={toggleMenu}
                            />
                            <hr className="my-2 border-t border-border-700" />
                            <NavigationControls isMobile={isOpen} />
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
}
