import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const RESERVED_WORDS = new Set([
  'api', 'admin', 'login', 'logout', 'signup', 'signin', 'register', 'dashboard',
  'settings', 'profile', 'account', 'user', 'users', 'auth', 'password', 'reset',
  'verify', 'email', 'mail', 'confirm', 'token', 'session', 'cookie', 'privacy',
  'terms', 'termos', 'about', 'help', 'support', 'contact', 'faq', 'blog',
  'news', 'status', 'health', 'monitor', 'metrics', 'stats', 'analytics',
  'cdn', 'static', 'assets', 'images', 'img', 'css', 'js', 'fonts', 'media',
  'upload', 'download', 'file', 'files', 'storage', 'cloud', 'app', 'www',
  'home', 'index', 'main', 'root', 'default', 'error', '404', '500', '403',
  'sitemap', 'robots', 'feed', 'rss', 'atom', 'json', 'xml', 'html', 'wp',
  'wordpress', 'joomla', 'drupal', 'magento', 'shop', 'store', 'cart', 'checkout',
  'pay', 'payment', 'pagamento', 'checkout', 'order', 'assinatura', 'premium',
  'preco', 'preço', 'plano', 'plan', 'upgrade', 'downgrade', 'cancel', 'trial',
  'demo', 'test', 'teste', 'sandbox', 'dev', 'development', 'prod', 'production',
  'staging', 'stage', 'backup', 'restore', 'db', 'database', 'sql', 'mysql',
  'postgres', 'mongo', 'redis', 'cache', 'log', 'logs', 'debug', 'trace',
  'config', 'configuration', 'env', 'environment', 'variable', 'secret', 'key',
  'public', 'private', 'secure', 'security', 'ssl', 'tls', 'https', 'http',
  'redirect', 'forward', 'proxy', 'gateway', 'vpn', 'firewall', 'waf',
  'webhook', 'hook', 'callback', 'integration', 'integracao', 'native', 'mobile',
  'ios', 'android', 'app', 'desktop', 'client', 'server', 'host', 'domain',
  'subdomain', 'dns', 'cname', 'a-record', 'mx', 'txt', 'spf', 'dkim', 'dmarc',
  'seo', 'search', 'google', 'bing', 'yahoo', 'facebook', 'twitter', 'instagram',
  'linkedin', 'youtube', 'tiktok', 'whatsapp', 'telegram', 'discord', 'slack',
]);

export function generateShortCode(): string {
  return nanoid();
}

export function isValidShortCode(code: string): { valid: boolean; error?: string } {
  if (!code || code.length === 0) {
    return { valid: true };
  }

  if (code.length > 10) {
    return { valid: false, error: 'Código deve ter no máximo 10 caracteres' };
  }

  if (!/^[a-zA-Z0-9-]+$/.test(code)) {
    return { valid: false, error: 'Código deve conter apenas letras, números e hifens' };
  }

  if (/^-|-$/.test(code)) {
    return { valid: false, error: 'Código não pode começar ou terminar com hífen' };
  }

  if (/--/.test(code)) {
    return { valid: false, error: 'Código não pode ter hifens consecutivos' };
  }

  if (/^[0-9]/.test(code)) {
    return { valid: false, error: 'Código deve começar com uma letra' };
  }

  if (RESERVED_WORDS.has(code.toLowerCase())) {
    return { valid: false, error: 'Este código está reservado. Escolha outro.' };
  }

  return { valid: true };
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return false;
    }

    const privateIpPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^169\.254\./,
      /^0\./,
      /^localhost$/,
    ];

    if (privateIpPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function getBaseUrlFromRequest(request: Request): string {
  // Prioridade 1: Variável de ambiente configurada
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Prioridade 2: Detectar a partir dos headers da requisição
  const url = new URL(request.url);
  const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.host;

  return `${protocol}://${host}`;
}

export function buildShortUrl(shortCode: string): string {
  return `${getBaseUrl()}/${shortCode}`;
}
