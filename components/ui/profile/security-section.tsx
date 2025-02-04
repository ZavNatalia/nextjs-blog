import ChangePasswordForm from '@/components/ui/profile/change-password-form';

export function SecuritySection() {
    return (
        <div className='text-start'>
            <h3 className="mb-3 text-xl font-semibold text-foreground">Security</h3>
            <p className='text-foreground-muted dark:text-foreground-onDarkMuted mb-3'>Want to change your password? Enter your new one below.</p>
            <ChangePasswordForm />
        </div>
    );
}