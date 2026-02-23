import { render } from '@testing-library/react';

import { Loader } from './Loader';

describe('Loader', () => {
    it('renders with default size', () => {
        const { container } = render(<Loader />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('renders with custom size', () => {
        const { container } = render(<Loader size={60} />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('applies custom padding class', () => {
        const { container } = render(<Loader paddings="p-4" />);
        expect(container.firstChild).toHaveClass('p-4');
    });
});
