import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import AuthForm from '@/components/ui/auth/auth-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import GithubSignInButton from '@/components/ui/auth/GithubSignInButton';
import GoogleSignInButton from '@/components/ui/auth/GoogleSignInButton';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['auth-page'];
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
            <div className="bg-secondary w-full max-w-sm rounded-3xl p-6 shadow-md lg:max-w-md">
                <AuthForm dictionary={authDict} />
                <hr className="my-4 border-t border-border-100" />
                <p className="text-center text-sm uppercase text-muted-100">
                    {authDict.or}
                </p>
                <div className="mt-3 flex flex-col items-center gap-3">
                    <GoogleSignInButton dictionary={authDict} />
                    <GithubSignInButton dictionary={authDict} />
                </div>
            </div>
        </main>
    );
}
