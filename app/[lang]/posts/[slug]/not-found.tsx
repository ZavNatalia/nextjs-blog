import { JSX } from 'react';

import NotFoundCard from '@/components/ui/NotFoundCard';

const NotFoundPage: () => JSX.Element = () => {
    return (
        <main className="page">
            <NotFoundCard />
        </main>
    );
};

export default NotFoundPage;
