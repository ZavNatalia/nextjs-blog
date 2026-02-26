import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('Invalid email or password.'),
    password: z.string().min(7, 'Invalid email or password.'),
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
        .min(7, 'New password must be at least 7 characters.'),
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
