"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

export interface Breadcrumb {
    link: string;
    title: string;
}

interface BreadcrumbItemProps {
    breadcrumb: Breadcrumb;
    isActive: boolean;
    isLast: boolean;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ breadcrumb, isActive, isLast }) => (
    <span>
        <Link
            href={breadcrumb.link}
            className={`
                cursor-pointer 
                hover:text-amber-500 
                px-3 
                py-1 
                transition-all 
                duration-300
                ${isActive ? 'font-bold text-amber-500' : 'font-normal'}
            `}
        >
            {breadcrumb.title}
        </Link>
        {!isLast && <span className="text-gray-300 ml-1">/</span>}
    </span>
);

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
    const pathname = usePathname();

    return (
        <nav className='flex gap-1 p-2 self-baseline text-lg'>
            {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem
                    key={breadcrumb.title}
                    breadcrumb={breadcrumb}
                    isActive={pathname === breadcrumb.link}
                    isLast={index === breadcrumbs.length - 1}
                />
            ))}
        </nav>
    )
}