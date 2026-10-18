'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AdminUser {
  id: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check-premium');
        const data = await response.json();

        if (!data.authenticated) {
          router.push('/login?redirect=/admin');
          return;
        }

        if (!data.isAdmin) {
          router.push('/dashboard');
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login?redirect=/admin');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {user.email}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
