/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['urlencurta.com.br'],
  },
  async headers() {
    return [
      {
        source: '/:shortCode*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap' }
    ];
  },
};

export default nextConfig;
