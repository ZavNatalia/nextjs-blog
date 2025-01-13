import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';
import AuthForm from '@/components/ui/auth/auth-form';

export const metadata: Metadata = {
    title: 'Contact me',
    description: 'Send me your messages!',
};
export default function AuthPage() {
    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'auth', link: '/auth' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <AuthForm />
        </main>
    );
}
