"use client";
import { useState } from "react";
import { UserIcon, LockClosedIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AccountSection } from '@/components/ui/profile/account-section';
import { SecuritySection } from '@/components/ui/profile/security-section';
import { DangerZoneSection } from '@/components/ui/profile/danger-zone-section';

const SECTIONS = [
    { key: "Account", label: "yourAccount", icon: UserIcon },
    { key: "Security", label: "security", icon: LockClosedIcon },
    { key: "DangerZone", label: "dangerZone", icon: ExclamationTriangleIcon },
];

export default function UserProfile({ userEmail, dictionary }: { userEmail: string, dictionary: Record<string, any>  }) {
    const [activeSection, setActiveSection] = useState("Account");

    return (
        <div className="mx-auto w-full flex flex-col gap-5">

            {/* Mobile Navigation */}
            <nav className="min-w-fit flex md:hidden justify-around py-2 px-1 shadow-md rounded-xl
            bg-primary-contrast dark:bg-dark-soft/40 ">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={clsx(
                            "flex flex-col items-center p-2 rounded-xl transition-all duration-300",
                            activeSection === key
                                ? "bg-primary text-foreground shadow-lg"
                                : "text-secondary hover:text-foreground hover:bg-primary/10"
                        )}
                        onClick={() => setActiveSection(key)}
                    >
                        <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${activeSection === key ? 'text-accent' : 'text-foreground'}`} />
                        <span className="text-sm">{dictionary[label]}</span>
                    </button>
                ))}
            </nav>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:block w-1/4 min-w-fit bg-primary-contrast/70 dark:bg-dark-soft/20 h-fit p-3 lg:p-5 rounded-2xl shadow-lg backdrop-blur-md">
                    <nav className="flex flex-col gap-2 lg:gap-3">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                className={clsx(
                                    "flex items-center text-start gap-3 px-3 py-2 rounded-xl text-md transition-all duration-300 w-full",
                                    activeSection === key
                                        ? "bg-primary/50 dark:bg-dark-soft/60 text-foreground shadow-lg"
                                        : "text-foreground-muted dark:text-foreground-onDarkMuted hover:text-foreground dark:hover:text-foreground hover:bg-primary/70 dark:hover:bg-dark-soft/40"
                                )}
                                onClick={() => setActiveSection(key)}
                            >
                                <Icon className={`w-6 h-6 ${activeSection === key ? 'text-accent' : 'text-foreground'}`} />
                                {dictionary[label]}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <section className="flex-1 p-6 bg-primary-contrast/40 dark:bg-dark-soft/40 rounded-2xl shadow-lg transition-all duration-300">
                    {activeSection === "Account" && <AccountSection userEmail={userEmail} dictionary={dictionary.accountSection} />}
                    {activeSection === "Security" && <SecuritySection dictionary={dictionary.securitySection} />}
                    {activeSection === "DangerZone" && <DangerZoneSection userEmail={userEmail} dictionary={dictionary.dangerZoneSection} />}
                </section>
            </div>
        </div>
    );
}
