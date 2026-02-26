import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/link', () => ({
    default: ({
        children,
        href,
        ...props
    }: {
        children: React.ReactNode;
        href: string;
        [key: string]: unknown;
    }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('next-auth/react', () => ({
    useSession: () => ({
        data: { user: { email: 'test@example.com' } },
        status: 'authenticated',
    }),
}));

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        'privacy-policy-page': {
            weUseCookies: 'We use cookies.',
            ourPrivacyPolicy: 'Privacy Policy',
            ok: 'Accept',
        },
    }),
}));

import CookieConsent from './CookieConsent';

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe('CookieConsent', () => {
    it('shows banner when no consent in localStorage', async () => {
        await act(async () => {
            render(<CookieConsent />);
        });
        expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('hides banner when consent already given', async () => {
        localStorage.setItem('cookieConsent-test@example.com', 'accepted');
        await act(async () => {
            render(<CookieConsent />);
        });
        expect(screen.queryByText('We use cookies.')).not.toBeInTheDocument();
    });

    it('saves consent and hides banner on accept', async () => {
        await act(async () => {
            render(<CookieConsent />);
        });
        await userEvent.click(screen.getByText('Accept'));
        expect(localStorage.getItem('cookieConsent-test@example.com')).toBe(
            'accepted',
        );
        expect(screen.queryByText('We use cookies.')).not.toBeInTheDocument();
    });

    it('renders link to privacy policy', async () => {
        await act(async () => {
            render(<CookieConsent />);
        });
        const link = screen.getByRole('link', { name: 'Privacy Policy' });
        expect(link).toHaveAttribute('href', '/privacy-policy');
    });
});
