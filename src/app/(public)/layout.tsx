import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public Pages - EquityLens',
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for public pages (login, register, etc.)
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>;
}
