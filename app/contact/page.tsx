import ContactForm from '@/components/ui/contact/contact-form';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact me',
    description: 'Send me your messages!',
};
export default function Contact() {
    const breadcrumbs: Breadcrumb[] = [
        { title: 'main', link: '/' },
        { title: 'contact', link: '/contact' },
    ];
    return (
        <main className="page">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <ContactForm />
            <div className="flex fixed bottom-5 text-sm max-w-xl p-2">
                <p className="text-muted-dark dark:text-muted-light">
                    By submitting a message through the contact form, you confirm that you have read our&nbsp;
                    <Link href="/privacy-policy" className="text-blue-700 dark:text-blue-400">
                    Privacy Policy</Link>
                    &nbsp;and consent to the processing of your personal data in accordance with the stated terms.
                </p>
            </div>
        </main>
    );
}
