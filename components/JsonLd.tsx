const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://urlencurta.com.br';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'URLEncurta',
      url: siteUrl,
      logo: `${siteUrl}/android-chrome-512x512.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'URLEncurta',
      inLanguage: 'pt-BR',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      name: 'URLEncurta',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: siteUrl,
      offers: {
        '@type': 'Offer',
        price: '29.90',
        priceCurrency: 'BRL',
        category: 'subscription',
      },
      featureList: [
        'Encurtador de URLs',
        'Links personalizados',
        'QR Code',
        'Estatísticas de cliques',
        'Dashboard Premium',
      ],
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
