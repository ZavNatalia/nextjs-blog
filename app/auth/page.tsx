import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import AuthForm from '@/components/ui/auth/auth-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Contact me',
    description: 'Send me your messages!',
};
export default async function AuthPage() {
    const session = await getServerSession();

    if (session) {
        redirect('/');
    }

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
