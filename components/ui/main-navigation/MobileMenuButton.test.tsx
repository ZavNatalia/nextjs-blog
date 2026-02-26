import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MobileMenuButton } from './MobileMenuButton';

describe('MobileMenuButton', () => {
    it('renders button with aria-label', () => {
        render(
            <MobileMenuButton
                isOpen={false}
                ariaLabel="Open menu"
                toggleMenu={() => {}}
            />,
        );
        expect(
            screen.getByRole('button', { name: 'Open menu' }),
        ).toBeInTheDocument();
    });

    it('calls toggleMenu on click', async () => {
        const toggleMenu = vi.fn();
        render(
            <MobileMenuButton
                isOpen={false}
                ariaLabel="Open menu"
                toggleMenu={toggleMenu}
            />,
        );
        await userEvent.click(screen.getByRole('button'));
        expect(toggleMenu).toHaveBeenCalledOnce();
    });
});
