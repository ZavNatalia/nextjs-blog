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
import { getDictionary } from '@/get-dictionary';

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
    dictionary: Awaited<ReturnType<typeof getDictionary>>['profile-page'];
}) {
    const [activeSection, setActiveSection] = useState('Account');

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {/* Sidebar for Mobile */}
            <nav className="bg-secondary flex min-w-fit justify-around rounded-xl p-2 shadow-md md:hidden">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={clsx(
                            'flex flex-col items-center rounded-lg p-2 transition-all duration-300',
                            activeSection === key
                                ? 'bg-primary text-foreground shadow-lg'
                                : 'hover:bg-primary text-foreground-muted hover:text-foreground',
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
                    <nav className="flex flex-col gap-2 lg:gap-3">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                className={clsx(
                                    'flex w-full items-center gap-3 rounded-xl border-none py-2 pl-4 pr-6 text-start text-base font-medium transition-all duration-200',
                                    activeSection === key
                                        ? 'bg-background-tertiary/70 text-foreground shadow-md'
                                        : 'text-foreground-muted hover:bg-background-tertiary/70 hover:text-foreground',
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
                <section className="flex-1">
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
