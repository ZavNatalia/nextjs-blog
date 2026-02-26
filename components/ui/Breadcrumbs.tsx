'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';

export interface Breadcrumb {
    link: string;
    title: string;
}

const BreadcrumbItem: ({
    breadcrumb,
    isActive,
    isLast,
}: {
    breadcrumb: Breadcrumb;
    isActive: boolean;
    isLast: boolean;
}) => JSX.Element = ({ breadcrumb, isActive, isLast }) => (
    <span>
        <Link
            href={breadcrumb.link}
            className={`link cursor-pointer px-1 py-1 text-base transition-all duration-200 hover:text-accent md:text-lg ${isActive ? 'font-medium text-accent' : 'text-foreground'} `}
        >
            {breadcrumb.title.toLowerCase()}
        </Link>
        {!isLast && <span className="ml-1 text-foreground">/</span>}
    </span>
);

export default function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: Breadcrumb[];
}) {
    const pathname = usePathname();
    const normalizedPathname =
        pathname.replace(/^\/(en|ru)/, '').split('?')[0] || '/';

    return (
        <nav className="flex flex-row flex-wrap gap-2 self-baseline text-lg md:text-base">
            {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                    key={index}
                    breadcrumb={breadcrumb}
                    isActive={normalizedPathname === breadcrumb.link}
                    isLast={index === breadcrumbs.length - 1}
                />
            ))}
        </nav>
    );
}
