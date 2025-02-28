import fs from 'fs';
import { Locale } from '@/i18n-config';
import path from 'path';
import matter from 'gray-matter';

export interface IPrivacyPolicy {
    title: string;
    date: string;
    content?: string;
}

const privacyPolicyDirectory = (lang: Locale) => path.join(process.cwd(), `privacy-policy/${lang}`);

export function getPrivacyPolicyFile(lang: Locale): IPrivacyPolicy | null {
    const filePath = path.join(privacyPolicyDirectory(lang), `privacy-policy.md`);

    if (!fs.existsSync(filePath)) {
        console.log(`Privacy policy file not found: ${filePath}`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        return {
            title: data.title || 'Privacy Policy',
            date: data.date || '',
            content,
        } as IPrivacyPolicy;
    } catch (error) {
        console.error(`Error reading privacy policy file ${filePath}:`, error);
        return null;
    }
}