import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wedding Venue Cost Calculator | Day of Us',
  description: 'Compare wedding venues side by side and see the true total cost per head, including catering, drinks and extras.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
