'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { Benefits } from '@/components/Benefits';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { CTAPremium } from '@/components/CTAPremium';
import { ConversionBand } from '@/components/ConversionBand';
import { UrlHistoryItem } from '@/types';
import { UrlCard } from '@/components/UrlCard';
import { Stats } from '@/components/Stats';
import { AdRectangle } from '@/components/Adsense';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UseCases } from '@/components/UseCases';

interface UserLinkResponse {
  short_code: string;
  original_url: string;
  created_at: string;
}

export default function Home() {
  const { isPremium, isLoggedIn, userId } = useAuth();
  const [history, setHistory] = useState<UrlHistoryItem[]>([]);
  const [userLinks, setUserLinks] = useState<UrlHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      const stored = localStorage.getItem('urlHistory');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    };

    loadHistory();

    const handleUpdate = () => loadHistory();
    window.addEventListener('urlHistoryUpdated', handleUpdate);
    return () => window.removeEventListener('urlHistoryUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    const fetchUserLinks = async () => {
      if (userId) {
        try {
          const linksRes = await fetch('/api/user/links?limit=100');
          const linksData = await linksRes.json();
          if (linksData.links) {
            setUserLinks(linksData.links.map((link: UserLinkResponse) => ({
              shortCode: link.short_code,
              shortUrl: `urlencurta.com.br/${link.short_code}`,
              originalUrl: link.original_url,
              createdAt: link.created_at,
            })));
          }
        } catch (err) {
          console.error('Error fetching links:', err);
        }
      }
    };
    fetchUserLinks();
  }, [userId]);

  const allLinks = isLoggedIn ? [...userLinks, ...history] : history;
  const displayHistory = isPremium ? allLinks : allLinks.slice(0, 10);
  const hasMoreLinks = !isPremium && allLinks.length > 10;

  return (
    <div>
      <Head>
        <title>Encurtador de URL Grátis | URLEncurta - WhatsApp, Instagram, TikTok</title>
        <meta name="description" content="Encurte links grátis e rápido. Estatísticas, QR Code, personalizados. Sem cadastro obrigatório!" />
        <meta name="keywords" content="encurtador de url, encurtar link, url curta, link instagram, link whatsapp, bitly alternativo" />
        <meta property="og:title" content="Encurtador de URL Grátis | URLEncurta" />
        <meta property="og:description" content="Encurte links grátis e rápido. Sem cadastro obrigatório!" />
        <meta property="og:type" content="website" />
      </Head>
      <Hero />
      <UseCases />
      <ConversionBand />
      <AdRectangle />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      
      {displayHistory.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Suas últimas URLs criadas
              </h2>
              {isPremium && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                  Premium
                </span>
              )}
            </div>
            <div className="space-y-3">
              {displayHistory.map((item) => (
                <UrlCard
                  key={item.shortCode}
                  shortCode={item.shortCode}
                  shortUrl={item.shortUrl}
                  originalUrl={item.originalUrl}
                  createdAt={item.createdAt}
                  isPremium={isPremium}
                />
              ))}
            </div>
            
            {hasMoreLinks && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Você atingiu o limite de 10 URLs no histórico gratuito.
                  </p>
                  <Link
                    href="/premium"
                    className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:scale-105 transition-transform"
                  >
                    Upgrade Premium
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      
      <Stats totalUrls={allLinks.length} totalClicks={0} />
      <CTAPremium />
      <FAQ />
      <footer className="py-8 text-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          Desenvolvido por:{' '}
          <a
            href="https://roldan-eng-software.github.io/roldan-page/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Roldan Eng Software
          </a>
        </p>
      </footer>
    </div>
  );
}
