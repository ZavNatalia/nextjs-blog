import ReactMarkdown from 'react-markdown';

import BackToTopButton from '@/components/ui/BackToTopButton';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { getPrivacyPolicyFile } from '@/lib/privacy-policy';

export default async function PrivacyPolicyPage(props: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await props.params;
    const dictionary = await getDictionary(lang)['privacy-policy-page'];
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
            <article className="mx-auto w-full rounded-3xl bg-secondary p-3 md:p-4 lg:max-w-5xl lg:p-10">
                <div className="markdown-content prose-sm lg:prose-lg dark:prose-invert">
                    <ReactMarkdown>{privacyPolicy?.content}</ReactMarkdown>
                </div>
            </article>
            <BackToTopButton />
        </main>
    );
}
