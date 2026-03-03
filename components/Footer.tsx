import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border transition-all duration-300">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text">
          <p>&copy; {new Date().getFullYear()} URLEncurta. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="text-text hover:text-primary transition-colors duration-300">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-text hover:text-primary transition-colors duration-300">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
