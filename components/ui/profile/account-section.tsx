import Image from 'next/image';

export function AccountSection({userEmail}: {userEmail: string}) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-accent shadow-md">
                <Image src="/images/site/default-avatar.png" alt="User avatar" width={96} height={96}
                       className="rounded-full" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">Your Account</h2>
            <p className="text-md text-secondary">{userEmail}</p>
        </div>
    );
}