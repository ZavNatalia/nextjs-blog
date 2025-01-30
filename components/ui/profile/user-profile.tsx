"use client";
import { useState } from "react";
import { UserIcon, LockClosedIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AccountSection } from '@/components/ui/profile/account-section';
import { SecuritySection } from '@/components/ui/profile/security-section';
import { DangerZoneSection } from '@/components/ui/profile/danger-zone-section';

const SECTIONS = [
    { key: "Account", label: "Your Account", icon: UserIcon },
    { key: "Security", label: "Security", icon: LockClosedIcon },
    { key: "DangerZone", label: "Danger Zone", icon: ExclamationTriangleIcon },
];

export default function UserProfile({ userEmail }: { userEmail: string }) {
    const [activeSection, setActiveSection] = useState("Account");

    return (
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-5">

            {/* Mobile Navigation */}
            <nav className="flex md:hidden justify-around bg-primary-light/40 mx-[-25px] p-2 shadow-md">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={clsx(
                            "flex flex-col items-center p-2 rounded-xl transition-all duration-300",
                            activeSection === key
                                ? "bg-primary-light text-primary shadow-lg"
                                : "text-secondary hover:text-primary hover:bg-primary-light/50"
                        )}
                        onClick={() => setActiveSection(key)}
                    >
                        <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${activeSection === key ? 'text-accent' : 'text-primary'}`} />
                        <span className="text-md">{label}</span>
                    </button>
                ))}
            </nav>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar for Desktop */}
                <aside className="hidden md:block w-1/4 bg-primary-light/50 h-fit p-3 lg:p-5 rounded-2xl shadow-lg backdrop-blur-md">
                    <nav className="flex flex-col gap-3">
                        {SECTIONS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                className={clsx(
                                    "flex items-center text-start gap-3 px-2 lg:px-3 py-2 rounded-xl text-md transition-all duration-300 w-full",
                                    activeSection === key
                                        ? "bg-primary-light text-primary shadow-lg"
                                        : "text-secondary hover:text-primary hover:bg-primary-light/50"
                                )}
                                onClick={() => setActiveSection(key)}
                            >
                                <Icon className={`w-6 h-6 ${activeSection === key ? 'text-accent' : 'text-primary'}`} />
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <section className="flex-1 p-6 bg-primary-light/20 rounded-2xl shadow-lg transition-all duration-300">
                    {activeSection === "Account" && <AccountSection userEmail={userEmail} />}
                    {activeSection === "Security" && <SecuritySection />}
                    {activeSection === "DangerZone" && <DangerZoneSection userEmail={userEmail} />}
                </section>
            </div>
        </div>
    );
}
