// lib/utils/date.ts

export function formatDate(
  dateString: string,
  options?: {
    locale?: string;
    format?: Intl.DateTimeFormatOptions;
  }
) {
  const locale = options?.locale || "en-GB";

  const format: Intl.DateTimeFormatOptions =
    options?.format || {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

  return new Date(dateString).toLocaleDateString(locale, {
    ...format,
    timeZone: "UTC", // penting untuk konsistensi
  });
}