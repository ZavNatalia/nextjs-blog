'use client';
import Link from 'next/link';
import { useDictionary } from '@/hooks/useDictionary';
import { useParams } from 'next/navigation';

export default function NotFoundCard() {
    const dictionary = useDictionary()?.['not-found'];
    const { lang } = useParams();
    return (
        <div className="mt-20 w-full max-w-lg rounded-2xl bg-primary-contrast/60 p-8 text-center dark:bg-dark-soft/60">
            <h2 className="mb-4 text-4xl font-bold text-accent dark:text-accent-dark">
                404
            </h2>
            <p className="mb-4 text-xl text-foreground">
                {dictionary.notFound}
            </p>
            <p className="mb-8 text-muted-dark dark:text-muted-light">
                {dictionary.weCouldNotFindPage}
            </p>
            <Link
                href={`/${lang}`}
                className="button-accent"
                aria-label={dictionary.returnHome}
            >
                {dictionary.returnHome}
            </Link>
        </div>
    );
}
