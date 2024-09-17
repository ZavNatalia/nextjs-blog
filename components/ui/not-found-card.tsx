import Link from 'next/link';

export default function NotFoundCard() {
    return (
        <div className="max-w-md w-full bg-primary-dark rounded-2xl p-8 mt-20 text-center">
            <h1 className="text-4xl font-bold text-accent mb-4">404</h1>
            <p className="text-xl text-primary mb-4">Oops! Page Not Found.</p>
            <p className="text-muted mb-8">
                Sorry, we couldn&apos;t find the page or post you were looking for.
            </p>
            <Link
                href="/"
                className="button"
            >
                Return to Home
            </Link>
        </div>
    )
}