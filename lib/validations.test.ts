import { describe, expect, it } from 'vitest';

import {
    changePasswordSchema,
    contactSchema,
    signupSchema,
} from './validations';

describe('signupSchema', () => {
    it('accepts valid input', () => {
        const result = signupSchema.safeParse({
            email: 'user@example.com',
            password: 'Abcdefg1',
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const result = signupSchema.safeParse({
            email: 'not-an-email',
            password: 'Abcdefg1',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toMatch(/invalid/i);
        }
    });

    it('rejects short password', () => {
        const result = signupSchema.safeParse({
            email: 'a@b.com',
            password: '123',
        });
        expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
        const result = signupSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});

describe('contactSchema', () => {
    it('accepts valid input', () => {
        const result = contactSchema.safeParse({
            email: 'user@example.com',
            name: 'Jane',
            message: 'Hello!',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const result = contactSchema.safeParse({
            email: 'bad',
            name: 'Jane',
            message: 'Hello!',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toMatch(/email/i);
        }
    });

    it('rejects empty name', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: '',
            message: 'Hello!',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
    });

    it('rejects empty message', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: '',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
    });

    it('rejects empty token', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: 'Hello!',
            token: '',
            consent: true,
        });
        expect(result.success).toBe(false);
    });

    it('rejects missing consent', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: 'Hello!',
            token: 'abc123',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toMatch(/consent/i);
        }
    });

    it('rejects consent that is not true', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: 'Hello!',
            token: 'abc123',
            consent: false,
        });
        expect(result.success).toBe(false);
    });

    it('rejects whitespace-only name', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: '   ',
            message: 'Hello!',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
    });

    it('rejects a message that is too long', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: 'a'.repeat(5001),
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toMatch(/exceed/i);
        }
    });

    it('rejects a name that is too long', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'a'.repeat(101),
            message: 'Hello!',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(false);
    });

    it('trims surrounding whitespace from fields', () => {
        const result = contactSchema.safeParse({
            email: '  user@example.com  ',
            name: '  Jane  ',
            message: '  Hello!  ',
            token: 'abc123',
            consent: true,
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.email).toBe('user@example.com');
            expect(result.data.name).toBe('Jane');
            expect(result.data.message).toBe('Hello!');
        }
    });
});

describe('changePasswordSchema', () => {
    it('accepts valid input', () => {
        const result = changePasswordSchema.safeParse({
            oldPassword: 'oldpass',
            newPassword: 'Newpass7x',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty old password', () => {
        const result = changePasswordSchema.safeParse({
            oldPassword: '',
            newPassword: 'Newpass7x',
        });
        expect(result.success).toBe(false);
    });

    it('rejects short new password', () => {
        const result = changePasswordSchema.safeParse({
            oldPassword: 'oldpass',
            newPassword: '123',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toMatch(/8 characters/i);
        }
    });
});
