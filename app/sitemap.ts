import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://urlencurta.com.br';

const editorialPages = [
  {
    path: '/como-funciona',
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    path: '/seguranca-em-links-curtos',
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    path: '/qr-code-para-links',
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  },
  {
    path: '/links-para-whatsapp',
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  },
  {
    path: '/boas-praticas-url-curta',
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...editorialPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    {
      url: `${baseUrl}/privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
