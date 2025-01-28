import ChangePasswordForm from '@/components/ui/profile/change-password-form';

export const UserProfile = () => {
    return (
        <div className='w-full'>
            <h2 className="relative mb-6 text-center text-2xl font-bold lg:text-4xl">
                Your User Profile
            </h2>
            <ChangePasswordForm />
        </div>
    )
}