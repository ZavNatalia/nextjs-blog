import { ProfileForm } from '@/components/ui/profile/profile-form';

export const UserProfile = () => {
    return (
        <div>
            <h2 className="relative mb-6 text-center text-2xl font-bold lg:text-4xl">
                User Profile
            </h2>
            <ProfileForm />
        </div>
    )
}