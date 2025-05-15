import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { getPrivacyPolicyFile } from '@/lib/privacy-policy-utils';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import ReactMarkdown from 'react-markdown';
import BackToTopButton from '@/components/ui/BackToTopButton';

export default async function PrivacyPolicyPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)?.['privacy-policy-page'];
    const privacyPolicy = getPrivacyPolicyFile(lang);

    const breadcrumbs: Breadcrumb[] = [
        { title: dictionary.main, link: '/' },
        { title: dictionary.privacyPolicy, link: '/privacy-policy' },
    ];

    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h2 className="mb-6 text-center text-2xl font-bold lg:text-4xl">
                {dictionary.privacyPolicy}
            </h2>
            <article className="bg-secondary dark:bg-secondary mx-auto w-full rounded-3xl p-3 md:p-4 lg:max-w-5xl lg:p-10">
                <ReactMarkdown className="markdown-content prose-sm dark:prose-invert lg:prose-lg">
                    {privacyPolicy?.content}
                </ReactMarkdown>
            </article>
            <BackToTopButton />
        </main>
    );
}
