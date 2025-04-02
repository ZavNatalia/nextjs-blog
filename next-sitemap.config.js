/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://zav.me',
    generateRobotsTxt: true,
    changefreq: 'weekly',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/privacy-policy'],
    alternateRefs: [
        {
            href: 'https://zav.me/ru',
            hreflang: 'ru',
        },
        {
            href: 'https://zav.me/en',
            hreflang: 'en',
        },
    ],
    transform: async (config, path) => {
        if (
            path.startsWith('/ru/posts/') ||
            path.startsWith('/en/posts/') ||
            path.startsWith('/ru/news/') ||
            path.startsWith('/en/news/') ||
            path === '/' ||
            path === '/ru' ||
            path === '/en'
        ) {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.7,
                lastmod: new Date().toISOString(),
                alternateRefs: config.alternateRefs,
            };
        }
        return null;
    },
};
