import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import AuthForm from '@/components/ui/auth/auth-form';
import GoogleSignInButton from '@/components/ui/auth/GoogleSignInButton';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)['auth-page'];
    return {
        title: dictionary.signIn,
        description: dictionary.pageDescription,
    };
}

export default async function AuthPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const session = await getServerSession();

    if (session) {
        revalidatePath('/');
        redirect('/');
    }

    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const authDict = dictionary['auth-page'];

    const breadcrumbs: Breadcrumb[] = [
        { title: authDict.main, link: '/' },
        { title: authDict.auth, link: '/auth' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className="card">
                <AuthForm dictionary={authDict} />
                <hr className="my-4 border-t border-border-100" />
                <p className="text-center text-secondary uppercase">
                    {authDict.or}
                </p>
                <div className="mt-3 flex flex-col items-center gap-3">
                    <GoogleSignInButton dictionary={authDict} />
                </div>
            </div>
        </main>
    );
}
