import Link from 'next/link';

import { auth } from '@/auth';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import ContactForm from '@/components/ui/contact/contact-form';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { connectToDatabase } from '@/lib/db';
import { IUser } from '@/lib/types/mongodb';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)['contact-page'];
    return {
        title: dictionary.contactMe,
        description: dictionary.pageDescription,
    };
}

export default async function ContactPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)['contact-page'];
    const session = await auth();

    let userEmail = '';
    let userName = '';

    if (session?.user?.email) {
        userEmail = session.user.email;
        userName = session.user.name ?? '';
        try {
            const db = await connectToDatabase();
            const dbUser = await db
                .collection<IUser>('users')
                .findOne({ email: userEmail });
            if (dbUser?.name) {
                userName = dbUser.name;
            }
        } catch {
            // fallback to session name
        }
    }

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.contact, link: '/contact' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <ContactForm
                    key={`${userEmail}-${userName}`}
                    userEmail={userEmail}
                    userName={userName}
                    dictionary={dictionary}
                />
            <div className="mt-2 flex max-w-xl">
                <p className="text-justify text-secondary">
                    {dictionary.bySubmittingMessage}&nbsp;
                    <Link
                        title={dictionary.openPrivacyPolicyPage}
                        aria-label={dictionary.openPrivacyPolicyPage}
                        href="/privacy-policy"
                        className="link text-blue-700 hover:underline dark:text-blue-400"
                    >
                        {dictionary.privacyPolicy}
                    </Link>
                    &nbsp;{dictionary.consentProcessingPersonalData}
                </p>
            </div>
        </main>
    );
}
