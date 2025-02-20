import ContactForm from '@/components/ui/contact/contact-form';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

export const metadata: Metadata = {
    title: 'Contact me',
    description: 'Send me your messages!',
};
export default async function Contact(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang);
    const contactDict = dictionary['contact-page'] ?? {};

    const breadcrumbs: Breadcrumb[] = [
        { title: contactDict.main, link: '/' },
        { title: contactDict.contact, link: '/contact' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <ContactForm dictionary={contactDict} />
            <div className="flex text-sm max-w-xl mt-6">
                <p className="text-muted-dark dark:text-muted-light">
                    {contactDict.bySubmittingMessage}&nbsp;
                    <Link href="/privacy-policy" className="text-blue-700 dark:text-blue-400">
                        {contactDict.privacyPolicy}</Link>
                    &nbsp;{contactDict.consentProcessingPersonalData}
                </p>
            </div>
        </main>
    );
}
