import ContactForm from '@/components/ui/contact/contact-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Contact me",
    description: "Send me your messages!",
};
export default function Contact() {
    return (
        <main className="flex min-h-full flex-col items-center justify-between p-24 w-full">
            <ContactForm/>
        </main>
    )
}