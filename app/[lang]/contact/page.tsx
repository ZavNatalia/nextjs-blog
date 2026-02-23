import Link from 'next/link';
import { getServerSession } from 'next-auth';

import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import ContactForm from '@/components/ui/contact/contact-form';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['contact-page'];
    return {
        title: dictionary.contactMe,
        description: dictionary.pageDescription,
    };
}

export default async function ContactPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['contact-page'];
    const session = await getServerSession();
    const userEmail = session?.user?.email ?? '';

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.contact, link: '/contact' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <ContactForm userEmail={userEmail} dictionary={dictionary} />
            <div className="mt-2 flex max-w-xl">
                <p className="text-secondary text-justify">
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
