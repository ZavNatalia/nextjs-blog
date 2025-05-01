'use client';
import Link from 'next/link';
import { useDictionary } from '@/hooks/useDictionary';
import { useParams } from 'next/navigation';

export default function NotFoundCard() {
    const dictionary = useDictionary()?.['not-found'];
    const { lang } = useParams();
    return (
        <div className="dark:bg-secondary bg-tertiary mt-20 w-full max-w-lg rounded-2xl p-8 text-center">
            <h2 className="mb-4 text-4xl font-bold text-accent-500 dark:text-accent-700">
                404
            </h2>
            <p className="mb-4 text-xl text-foreground">
                {dictionary.notFound}
            </p>
            <p className="mb-8 text-muted-700 dark:text-muted-100">
                {dictionary.weCouldNotFindPage}
            </p>
            <Link
                href={`/${lang}`}
                className="button button-accent button-md"
                aria-label={dictionary.returnHome}
            >
                {dictionary.returnHome}
            </Link>
        </div>
    );
}
