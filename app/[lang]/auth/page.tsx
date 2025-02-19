import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import AuthForm from '@/components/ui/auth/auth-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

export const metadata: Metadata = {
    title: 'Contact me',
    description: 'Send me your messages!',
};
export default async function AuthPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const session = await getServerSession();

    if (session) {
        redirect('/');
    }

    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const authDict = dictionary['auth-page'] ?? {};

    const breadcrumbs: Breadcrumb[] = [
        { title: authDict.main, link: '/' },
        { title: authDict.auth, link: '/auth' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <AuthForm dictionary={authDict} />
        </main>
    );
}
