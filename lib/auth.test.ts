import { hashPassword, verifyPassword } from './auth';

describe('hashPassword', () => {
    it('returns a bcrypt hash string', async () => {
        const hash = await hashPassword('testpassword');
        expect(hash).toMatch(/^\$2[aby]?\$/);
        expect(hash).not.toBe('testpassword');
    });
});

describe('verifyPassword', () => {
    it('returns true for matching password', async () => {
        const hash = await hashPassword('secret123');
        const result = await verifyPassword('secret123', hash);
        expect(result).toBe(true);
    });

    it('returns false for wrong password', async () => {
        const hash = await hashPassword('secret123');
        const result = await verifyPassword('wrongpassword', hash);
        expect(result).toBe(false);
    });
});
