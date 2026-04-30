const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://urlencurta.com/#organization',
      name: 'URLEncurta',
      url: 'https://urlencurta.com',
      logo: 'https://urlencurta.com/android-chrome-512x512.png',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://urlencurta.com/#website',
      url: 'https://urlencurta.com',
      name: 'URLEncurta',
      inLanguage: 'pt-BR',
      publisher: {
        '@id': 'https://urlencurta.com/#organization',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://urlencurta.com/#app',
      name: 'URLEncurta',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://urlencurta.com',
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
