'use client';
import Link from 'next/link';
import { useDictionary } from '@/hooks/useDictionary';

export default function NotFoundCard() {
    const dictionary = useDictionary()?.['not-found'];

    return (
        <div className="mt-20 w-full max-w-lg rounded-2xl bg-primary-contrast/60 p-8 text-center dark:bg-dark-soft/60">
            <h2 className="mb-4 text-4xl font-bold text-accent">404</h2>
            <p className="mb-4 text-xl text-foreground">
                {dictionary.notFound}
            </p>
            <p className="mb-8 text-muted-dark dark:text-muted-light">
                {dictionary.weCouldNotFindPage}
            </p>
            <Link href="/" className="button-accent">
                {dictionary.returnHome}
            </Link>
        </div>
    );
}
