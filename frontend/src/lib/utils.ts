import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = '₦'): string {
  return `${currency}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getDiscountPercentage(price: number, comparePrice?: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

export function getPrimaryImage(images: { url: string; isPrimary: boolean }[]): string {
  if (!images?.length) return '/images/placeholder-jersey.jpg';
  const primary = images.find((img) => img.isPrimary);
  return primary?.url || images[0]?.url || '/images/placeholder-jersey.jpg';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    CONFIRMED: 'text-blue-600 bg-blue-50 border-blue-200',
    PROCESSING: 'text-purple-600 bg-purple-50 border-purple-200',
    SHIPPED: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    DELIVERED: 'text-green-600 bg-green-50 border-green-200',
    CANCELLED: 'text-red-600 bg-red-50 border-red-200',
    REFUNDED: 'text-gray-600 bg-gray-50 border-gray-200',
  };
  return map[status] || 'text-gray-600 bg-gray-50 border-gray-200';
}

export function getPaymentStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    PAID: 'text-green-600 bg-green-50',
    FAILED: 'text-red-600 bg-red-50',
    REFUNDED: 'text-gray-600 bg-gray-50',
  };
  return map[status] || 'text-gray-600 bg-gray-50';
}

export function generateStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}
