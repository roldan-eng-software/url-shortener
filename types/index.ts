export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date | null;
}

export interface CreateUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

export interface UrlStats {
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

export interface UrlHistoryItem {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}

export interface AppStats {
  totalUrls: number;
  totalClicks: number;
}
