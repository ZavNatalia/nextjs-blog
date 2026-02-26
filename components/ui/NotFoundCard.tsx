'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useDictionary } from '@/hooks/useDictionary';

export default function NotFoundCard() {
    const dictionary = useDictionary()?.['not-found'];
    const { lang } = useParams();
    return (
        <div className="mt-20 w-full max-w-xl rounded-2xl bg-secondary p-8 text-center shadow-md">
            <h2 className="mb-4 font-mono text-5xl font-bold text-accent">
                404
            </h2>
            <p className="mb-4 text-xl text-foreground">
                {dictionary.notFound}
            </p>
            <p className="mb-8 text-secondary">
                {dictionary.weCouldNotFindPage}
            </p>
            <Link
                href={`/${lang}`}
                className="button button-solid button-md"
                aria-label={dictionary.returnHome}
            >
                {dictionary.returnHome}
            </Link>
        </div>
    );
}
