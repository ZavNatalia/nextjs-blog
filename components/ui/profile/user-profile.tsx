'use client';
import { useState } from 'react';
import {
    UserIcon,
    LockClosedIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { AccountSection } from '@/components/ui/profile/account-section';
import { SecuritySection } from '@/components/ui/profile/security-section';
import { DangerZoneSection } from '@/components/ui/profile/danger-zone-section';

const SECTIONS = [
    { key: 'Account', label: 'yourAccount', icon: UserIcon },
    { key: 'Security', label: 'security', icon: LockClosedIcon },
    { key: 'DangerZone', label: 'dangerZone', icon: ExclamationTriangleIcon },
];

export default function UserProfile({
    userEmail,
    dictionary,
}: {
    userEmail: string;
    dictionary: Record<string, any>;
}) {
    const [activeSection, setActiveSection] = useState('Account');

    return (
        <div className="mx-auto flex w-full flex-col gap-5">
            {/* Mobile Navigation */}
            <nav className="flex min-w-fit justify-around rounded-xl bg-primary-contrast px-1 py-2 shadow-md dark:bg-dark-soft/40 md:hidden">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={clsx(
                            'flex flex-col items-center rounded-xl p-2 transition-all duration-300',
                            activeSection === key
                                ? 'bg-primary text-foreground shadow-lg'
                                : 'dark:hover:text-onDark text-foreground-muted hover:bg-primary/10 hover:text-foreground dark:text-foreground-onDarkMuted',
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

            <div className="flex flex-col gap-6 md:flex-row">
                {/* Sidebar for Desktop */}
                <aside className="hidden h-fit w-1/4 min-w-fit rounded-2xl bg-primary-contrast/70 p-3 shadow-lg backdrop-blur-md dark:bg-dark-soft/20 md:block lg:p-5">
                    <nav className="flex flex-col gap-2 lg:gap-3">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                className={clsx(
                                    'text-md flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition-all duration-300',
                                    activeSection === key
                                        ? 'bg-primary/50 text-foreground shadow-lg dark:bg-dark-soft/60'
                                        : 'text-foreground-muted hover:bg-primary/70 hover:text-foreground dark:text-foreground-onDarkMuted dark:hover:bg-dark-soft/40 dark:hover:text-foreground',
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
                <section className="flex-1 rounded-2xl bg-primary-contrast/40 p-6 shadow-lg transition-all duration-300 dark:bg-dark-soft/40">
                    {activeSection === 'Account' && (
                        <AccountSection
                            userEmail={userEmail}
                            dictionary={dictionary.accountSection}
                        />
                    )}
                    {activeSection === 'Security' && (
                        <SecuritySection
                            dictionary={dictionary.securitySection}
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
