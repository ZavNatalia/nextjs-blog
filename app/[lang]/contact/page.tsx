import ContactForm from '@/components/ui/contact/contact-form';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['contact-page'];
    return {
        title: dictionary.contactMe,
        description: dictionary.pageDescription,
    }
}

export default async function ContactPage(props: {
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
                <p className="text-muted-dark dark:text-muted-light text-justify">
                    {contactDict.bySubmittingMessage}&nbsp;
                    <Link href="/privacy-policy" className="text-blue-700 dark:text-blue-400">
                        {contactDict.privacyPolicy}</Link>
                    &nbsp;{contactDict.consentProcessingPersonalData}
                </p>
            </div>
        </main>
    );
}
