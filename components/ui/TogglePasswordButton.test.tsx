import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useDictionary', () => ({
    useDictionary: () => ({
        common: {
            showPassword: 'Show password',
            hidePassword: 'Hide password',
        },
    }),
}));

import TogglePasswordButton from './TogglePasswordButton';

describe('TogglePasswordButton', () => {
    it('renders show password button when password is hidden', () => {
        render(
            <TogglePasswordButton onToggle={() => {}} isPasswordVisible={false} />,
        );
        expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('renders hide password button when password is visible', () => {
        render(
            <TogglePasswordButton onToggle={() => {}} isPasswordVisible={true} />,
        );
        expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });

    it('calls onToggle on click', async () => {
        const onToggle = vi.fn();
        render(
            <TogglePasswordButton onToggle={onToggle} isPasswordVisible={false} />,
        );
        await userEvent.click(screen.getByRole('button'));
        expect(onToggle).toHaveBeenCalledOnce();
    });

    it('renders nothing when visible is false', () => {
        const { container } = render(
            <TogglePasswordButton visible={false} onToggle={() => {}} isPasswordVisible={false} />,
        );
        expect(container.innerHTML).toBe('');
    });
});
