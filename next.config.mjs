import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        console.log('Работаю в режиме разработки!');
        return {
            env: {
                mongodb_username: 'natalia',
                mongodb_password: 'rXDyQwsSMBrgUH9I',
                mongodb_clustername: 'Cluster0',
                mongodb_database: 'blog-dev',
            }
        }
    }

    return {
        env: {
            mongodb_username: 'natalia',
            mongodb_password: 'rXDyQwsSMBrgUH9I',
            mongodb_clustername: 'Cluster0',
            mongodb_database: 'blog',
        },
    };
};

export default nextConfig;
