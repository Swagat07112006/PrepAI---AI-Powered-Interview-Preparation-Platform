import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value || 0);
}

export function getStatusTone(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('solved') || normalized.includes('completed')) return 'success';
  if (normalized.includes('progress')) return 'warning';
  if (normalized.includes('revision')) return 'accent';
  if (normalized.includes('hard') || normalized.includes('missed')) return 'danger';
  return 'neutral';
}