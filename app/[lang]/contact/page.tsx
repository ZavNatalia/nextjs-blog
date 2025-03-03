import ContactForm from '@/components/ui/contact/contact-form';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

export async function generateMetadata(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)?.['contact-page'];
    return {
        title: dictionary.contactMe,
        description: dictionary.pageDescription,
    };
}

export default async function ContactPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = getDictionary(lang)?.['contact-page'];

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.contact, link: '/contact' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h2 className="mb-6 text-center text-2xl font-bold lg:text-4xl">
                {dictionary.howCanIHelp}
            </h2>
            <ContactForm dictionary={dictionary} />
            <div className="mt-6 flex max-w-xl text-sm">
                <p className="text-justify text-muted-dark dark:text-muted-light">
                    {dictionary.bySubmittingMessage}&nbsp;
                    <Link
                        href="/privacy-policy"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                    >
                        {dictionary.privacyPolicy}
                    </Link>
                    &nbsp;{dictionary.consentProcessingPersonalData}
                </p>
            </div>
        </main>
    );
}
