'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import Logo from '@/components/ui/Logo';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/hooks/useDictionary';
import { MobileMenuButton } from '@/components/ui/main-navigation/MobileMenuButton';
import { NavigationList } from '@/components/ui/main-navigation/NavigationList';
import { NavigationControls } from '@/components/ui/main-navigation/NavigationControls';

export default function MainNavigation() {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    const dict = useDictionary()?.navigation;
    const pathname = usePathname();
    const normalized = pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';

    const close = () => {
        setOpen(false);
    };
    const toggle = () => setOpen((v) => !v);

    const listProps = {
        normalizedPathname: normalized,
        session,
        status,
        dictionary: dict,
    };

    return (
        <header
            className={clsx(
                'relative z-10 shadow-md md:sticky md:top-0',
                open ? 'bg-tertiary' : 'bg-secondary',
            )}
        >
            <div className="mx-auto grid max-w-[90rem] grid-cols-[1fr_auto] items-center px-4 py-2 md:grid-cols-[200_1fr_200] md:py-4">
                <Logo title={dict.home} />

                <nav className="hidden justify-self-center md:block">
                    <NavigationList {...listProps} direction="row" />
                </nav>

                <div className="flex items-center gap-2 justify-self-end">
                    <div className="hidden md:block">
                        <NavigationControls />
                    </div>

                    <MobileMenuButton
                        ariaLabel={open ? dict.closeMenu : dict.openMenu}
                        isOpen={open}
                        toggleMenu={toggle}
                    />
                </div>
            </div>

            {/* Mobile menu drawer */}
            {open && (
                <nav className="bg-tertiary absolute inset-x-0 top-full z-20 border-t border-border-700 shadow-lg md:hidden">
                    <NavigationList {...listProps} onClick={close} />
                    <div className="flex justify-center border-t border-border-700 p-4">
                        <NavigationControls isMobile />
                    </div>
                </nav>
            )}
        </header>
    );
}
