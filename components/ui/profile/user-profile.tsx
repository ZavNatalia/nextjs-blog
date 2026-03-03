'use client';
import {
    ExclamationTriangleIcon,
    LockClosedIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { KeyboardEvent, useState } from 'react';

import { AccountSection } from '@/components/ui/profile/account-section';
import { DangerZoneSection } from '@/components/ui/profile/danger-zone-section';
import { SecuritySection } from '@/components/ui/profile/security-section';
import { getDictionary } from '@/get-dictionary';

type SectionLabel = 'yourAccount' | 'security' | 'dangerZone';

const SECTIONS: { key: string; label: SectionLabel; icon: typeof UserIcon }[] =
    [
        { key: 'Account', label: 'yourAccount', icon: UserIcon },
        { key: 'Security', label: 'security', icon: LockClosedIcon },
        {
            key: 'DangerZone',
            label: 'dangerZone',
            icon: ExclamationTriangleIcon,
        },
    ];

export default function UserProfile({
    userEmail,
    userName,
    dictionary,
    lang,
}: {
    userEmail: string;
    userName: string;
    dictionary: Awaited<ReturnType<typeof getDictionary>>['profile-page'];
    lang: string;
}) {
    const [activeSection, setActiveSection] = useState('Account');

    const handleTabKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        const currentIndex = SECTIONS.findIndex((s) => s.key === activeSection);
        let nextIndex = currentIndex;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % SECTIONS.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + SECTIONS.length) % SECTIONS.length;
        } else {
            return;
        }

        setActiveSection(SECTIONS[nextIndex].key);
        const nextTabId = `tab-${SECTIONS[nextIndex].key}`;
        // Focus the activated tab in the same tablist
        const currentTablist = (e.target as HTMLElement).closest(
            '[role="tablist"]',
        );
        const nextTab = currentTablist?.querySelector(
            `#${nextTabId}`,
        ) as HTMLElement | null;
        nextTab?.focus();
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {/* Sidebar for Mobile */}
            <nav
                className="flex min-w-fit justify-around rounded-xl bg-secondary p-2 shadow-md md:hidden"
                role="tablist"
                aria-label={dictionary.profile}
                onKeyDown={handleTabKeyDown}
            >
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        id={`tab-${key}`}
                        role="tab"
                        aria-selected={activeSection === key}
                        aria-controls={`panel-${key}`}
                        tabIndex={activeSection === key ? 0 : -1}
                        className={clsx(
                            'flex flex-col items-center rounded-lg p-2 transition-all duration-300',
                            activeSection === key
                                ? 'bg-primary text-foreground shadow-lg'
                                : 'text-secondary hover:bg-primary hover:text-foreground',
                        )}
                        onClick={() => setActiveSection(key)}
                    >
                        <Icon
                            className={`mb-2 h-6 w-6 transition-all duration-300 ${activeSection === key ? 'text-accent' : 'text-foreground'}`}
                        />
                        <span className="text-sm">{dictionary[label]}</span>
                    </button>
                ))}
            </nav>

            <div className="card flex w-full max-w-4xl flex-col gap-6 md:flex-row">
                {/* Sidebar for Desktop */}
                <aside className="hidden h-fit rounded-xl bg-background-primary p-4 md:block">
                    <nav
                        className="flex flex-col gap-2 lg:gap-3"
                        role="tablist"
                        aria-label={dictionary.profile}
                        onKeyDown={handleTabKeyDown}
                    >
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                id={`tab-${key}`}
                                role="tab"
                                aria-selected={activeSection === key}
                                aria-controls={`panel-${key}`}
                                tabIndex={activeSection === key ? 0 : -1}
                                className={clsx(
                                    'flex w-full items-center gap-3 rounded-xl border-none py-2 pr-6 pl-4 text-start text-base font-medium transition-all duration-200',
                                    activeSection === key
                                        ? 'bg-background-tertiary/70 text-foreground shadow-md'
                                        : 'text-secondary hover:bg-background-tertiary/70 hover:text-foreground',
                                )}
                                onClick={() => setActiveSection(key)}
                            >
                                <Icon
                                    className={`h-6 w-6 ${activeSection === key ? 'text-accent' : 'text-foreground'}`}
                                />
                                {dictionary[label]}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <section
                    className="flex-1"
                    role="tabpanel"
                    id={`panel-${activeSection}`}
                    aria-labelledby={`tab-${activeSection}`}
                >
                    {activeSection === 'Account' && (
                        <AccountSection
                            userEmail={userEmail}
                            userName={userName}
                            dictionary={dictionary.accountSection}
                        />
                    )}
                    {activeSection === 'Security' && (
                        <SecuritySection
                            dictionary={dictionary.securitySection}
                            lang={lang}
                        />
                    )}
                    {activeSection === 'DangerZone' && (
                        <DangerZoneSection
                            userEmail={userEmail}
                            dictionary={dictionary.dangerZoneSection}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}
