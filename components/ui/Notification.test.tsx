import { render, screen } from '@testing-library/react';

import Notification from './Notification';

beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'notifications');
    document.body.appendChild(portalRoot);
});

afterEach(() => {
    const portalRoot = document.getElementById('notifications');
    if (portalRoot) document.body.removeChild(portalRoot);
});

describe('Notification', () => {
    it('renders title and message', () => {
        render(
            <Notification status="success" title="Done!" message="All good" />,
        );
        expect(screen.getByText('Done!')).toBeInTheDocument();
        expect(screen.getByText('All good')).toBeInTheDocument();
    });

    it('applies success styling', () => {
        render(
            <Notification status="success" title="Done!" message="All good" />,
        );
        const container = screen
            .getByText('Done!')
            .closest('.animate-slide-in');
        expect(container).toHaveClass('bg-success-100');
    });

    it('applies error styling', () => {
        render(
            <Notification
                status="error"
                title="Error!"
                message="Something broke"
            />,
        );
        const container = screen
            .getByText('Error!')
            .closest('.animate-slide-in');
        expect(container).toHaveClass('bg-error-500');
    });

    it('does not render without portal root', () => {
        const portalRoot = document.getElementById('notifications');
        if (portalRoot) document.body.removeChild(portalRoot);
        const { container } = render(
            <Notification status="success" title="Done!" message="All good" />,
        );
        expect(container.innerHTML).toBe('');
    });
});
