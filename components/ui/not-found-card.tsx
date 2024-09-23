import Link from 'next/link';

export default function NotFoundCard() {
    return (
        <div className="mt-20 w-full max-w-md rounded-2xl bg-primary-dark p-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-accent">404</h1>
            <p className="mb-4 text-xl text-primary">Oops! Page Not Found.</p>
            <p className="mb-8 text-muted">
                Sorry, we couldn&apos;t find the page or post you were looking
                for.
            </p>
            <Link href="/" className="button">
                Return to Home
            </Link>
        </div>
    );
}
