import type { Session } from 'next-auth';
import { vi } from 'vitest';

// Route handlers call auth() without arguments to read the current session.
// Narrow the overload before Vitest infers its mock return type.
export function mockSessionAuth(auth: () => Promise<Session | null>) {
    return vi.mocked(auth);
}
