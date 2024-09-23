import ContactForm from '@/components/ui/contact/contact-form';
import type { Metadata } from 'next';
import Breadcrumbs, { Breadcrumb } from '@/components/ui/breadcrumbs';

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
        </main>
    );
}
