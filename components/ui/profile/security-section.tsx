import Link from 'next/link';

import ChangePasswordForm from '@/components/ui/profile/change-password-form';
import { getDictionary } from '@/get-dictionary';

type SecurityDictionary = Awaited<
    ReturnType<typeof getDictionary>
>['profile-page']['securitySection'];

export function SecuritySection({
    dictionary,
    lang,
}: {
    dictionary: SecurityDictionary;
    lang: string;
}) {
    return (
        <div className="flex flex-col items-center p-4 md:items-start">
            <h3 className="mb-3 text-xl font-semibold text-foreground">
                {dictionary.security}
            </h3>
            <p className="mb-3 text-left md:text-start">
                {dictionary.wantToChangeYourPassword}
            </p>
            <ChangePasswordForm dictionary={dictionary} />
            <div className="mt-3 flex text-secondary">
                <p>
                    {dictionary.reviewPrivacyPolicy}&nbsp;
                    <Link
                        href={`/${lang}/privacy-policy`}
                        className="link text-blue-700 hover:underline dark:text-blue-400"
                    >
                        {dictionary.here}
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
