import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding Budget Calculator | Day of Us',
  description: 'Plan your wedding budget for free with a full category breakdown, currency support, and AI-powered advice. No sign-up required.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
