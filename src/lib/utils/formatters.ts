import dayjs from 'dayjs';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT, CURRENCY_SYMBOLS } from './constants';

/**
 * Format date string to readable format
 */
export const formatDate = (date: string | Date, format: string = DATE_FORMAT): string => {
  return dayjs(date).format(format);
};

/**
 * Format datetime string
 */
export const formatDateTime = (date: string | Date, format: string = DATETIME_FORMAT): string => {
  return dayjs(date).format(format);
};

/**
 * Format time
 */
export const formatTime = (date: string | Date, format: string = TIME_FORMAT): string => {
  return dayjs(date).format(format);
};

/**
 * Format currency
 */
export const formatCurrency = (
  value: number,
  currency: string = 'IDR',
  decimals: number = 0
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return `${symbol} ${formatted}`;
};

/**
 * Format number with thousand separator
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate string
 */
export const truncateString = (str: string, length: number = 50): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Capitalize string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};