import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('Invalid email or password.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .regex(/[a-z]/, 'Password must contain a lowercase letter.')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
        .regex(/[0-9]/, 'Password must contain a number.'),
});

export const contactSchema = z.object({
    email: z.string().email('Invalid email address.'),
    name: z.string().min(1, 'Name is required.'),
    message: z.string().min(1, 'Message is required.'),
    token: z.string().min(1, 'Captcha token is required.'),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required.'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters.')
        .regex(/[a-z]/, 'Password must contain a lowercase letter.')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
        .regex(/[0-9]/, 'Password must contain a number.'),
});

export const commentSchema = z.object({
    postSlug: z.string().min(1, 'Post slug is required.'),
    content: z
        .string()
        .min(1, 'Comment is required.')
        .max(1000, 'Comment must not exceed 1000 characters.'),
});

export const commentEditSchema = z.object({
    content: z
        .string()
        .min(1, 'Comment is required.')
        .max(1000, 'Comment must not exceed 1000 characters.'),
});

export const commentModerateSchema = z.object({
    status: z.enum(['approved', 'rejected']),
});

export const deleteByEmailSchema = z.object({
    email: z.string().email('Invalid email address.'),
});

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters.')
        .max(50, 'Name must not exceed 50 characters.'),
});
