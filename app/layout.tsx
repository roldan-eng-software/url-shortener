import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'URLEncurta - Encurtador de URLs Grátis | Links Curtos e Seguros',
  description: 'Encurte suas URLs gratuitamente com URLEncurta. Links curtos, seguros e com estatísticas detalhadas. Comece agora mesmo - rápido, simples e gratuito.',
  keywords: ['encurtar url', 'url shortener', 'link curto', 'encurtador de links', 'bitly gratis', 'encurtador de url brasileiro', 'urls curtas'],
  authors: [{ name: 'URLEncurta' }],
  openGraph: {
    title: 'URLEncurta - Encurte suas URLs em segundos',
    description: 'Transforme URLs longas em links curtos e fáceis de compartilhar. 100% grátis e seguro.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'URLEncurta',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://urlencurta.com',
  },
  other: {
    'geo.region': 'BR',
    'geo.placename': 'Brasil',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6076119895678197"
          crossOrigin="anonymous"
        />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-6xl flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
