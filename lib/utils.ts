import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(str: string | undefined | null, length: number): string {
  if (!str || str.length <= length) return str || '';
  return str.slice(0, length) + '...';
}
