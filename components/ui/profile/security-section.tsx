import ChangePasswordForm from '@/components/ui/profile/change-password-form';
import Link from 'next/link';

export function SecuritySection({
    dictionary,
}: {
    dictionary: Record<string, any>;
}) {
    return (
        <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-xl font-semibold text-foreground">
                {dictionary.security}
            </h3>
            <p className="mb-3 text-center md:text-start">
                {dictionary.wantToChangeYourPassword}
            </p>
            <ChangePasswordForm dictionary={dictionary} />
            <div className="mt-3 flex text-sm text-foreground-muted dark:text-foreground-onDarkMuted">
                <p>
                    {dictionary.reviewPrivacyPolicy}&nbsp;
                    <Link
                        href="/privacy-policy"
                        className="text-blue-700 dark:text-blue-400 hover:underline"
                    >
                        {dictionary.here}
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
