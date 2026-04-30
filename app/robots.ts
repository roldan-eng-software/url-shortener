import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://urlencurta.com.br';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
