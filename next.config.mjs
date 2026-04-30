/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'urlencurta.com.br',
      },
    ],
  },
};

export default nextConfig;
