import { render, screen } from '@testing-library/react';

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
        <img alt={alt} {...props} />
    ),
}));

import HeroCard from './HeroCard';

const mockDictionary = {
    greetings: 'Welcome to my blog!',
    greetingsDescription: 'A place for web dev articles.',
} as never;

describe('HeroCard', () => {
    it('renders greeting text', () => {
        render(<HeroCard dictionary={mockDictionary} />);
        expect(screen.getByText('Welcome to my blog!')).toBeInTheDocument();
        expect(screen.getByText('A place for web dev articles.')).toBeInTheDocument();
    });

    it('renders hero images', () => {
        render(<HeroCard dictionary={mockDictionary} />);
        const images = screen.getAllByAltText('Hero');
        expect(images).toHaveLength(2);
    });
});
