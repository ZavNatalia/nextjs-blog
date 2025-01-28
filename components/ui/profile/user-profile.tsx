import ChangePasswordForm from '@/components/ui/profile/change-password-form';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const UserProfile = ({ userEmail }: { userEmail: string }) => {
    return (
        <div className="w-full max-w-lg">
            <h2 className="relative mb-6 text-center text-2xl font-bold lg:text-4xl flex items-center justify-center gap-2">
                Your User Profile
                <div className="group relative">
                    <InformationCircleIcon className="w-6 h-6 text-gray-400 cursor-pointer hover:text-accent" />
                    <div className="absolute left-1/2 top-full font-normal mt-2 w-auto max-w-xs -translate-x-1/2 rounded-xl bg-primary-dark p-2 text-sm text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Your email: <span className='font-bold font-mono'>{userEmail}</span>
                    </div>
                </div>
            </h2>
            <ChangePasswordForm />
        </div>
    );
};
