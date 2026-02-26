export async function createUser(email: string, password: string) {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong!');
    }
    return data;
}
