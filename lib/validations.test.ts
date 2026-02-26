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
            password: 'abcdefg',
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const result = signupSchema.safeParse({
            email: 'not-an-email',
            password: 'abcdefg',
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
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const result = contactSchema.safeParse({
            email: 'bad',
            name: 'Jane',
            message: 'Hello!',
            token: 'abc123',
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
        });
        expect(result.success).toBe(false);
    });

    it('rejects empty message', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: '',
            token: 'abc123',
        });
        expect(result.success).toBe(false);
    });

    it('rejects empty token', () => {
        const result = contactSchema.safeParse({
            email: 'a@b.com',
            name: 'Jane',
            message: 'Hello!',
            token: '',
        });
        expect(result.success).toBe(false);
    });
});

describe('changePasswordSchema', () => {
    it('accepts valid input', () => {
        const result = changePasswordSchema.safeParse({
            oldPassword: 'oldpass',
            newPassword: 'newpass7',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty old password', () => {
        const result = changePasswordSchema.safeParse({
            oldPassword: '',
            newPassword: 'newpass7',
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
            expect(result.error.issues[0].message).toMatch(/7 characters/i);
        }
    });
});
