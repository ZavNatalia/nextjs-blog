import ChangePasswordForm from '@/components/ui/profile/change-password-form';
import Link from 'next/link';

export function SecuritySection() {
    return (
        <div className='flex flex-col items-center md:items-start'>
            <h3 className="mb-3 text-xl font-semibold text-foreground">Security</h3>
            <p className='mb-3 text-center md:text-start'>Want to change your password? <br/> Enter your new one below.</p>
            <ChangePasswordForm />
            <div className='flex mt-3 text-sm text-foreground-muted dark:text-foreground-onDarkMuted '>
                <p>You can review the Privacy Policy&nbsp;</p>
                <Link href='/privacy-policy' className='text-blue-700 dark:text-blue-400'>here</Link>.
            </div>
        </div>
    );
}