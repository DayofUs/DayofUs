import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding Planning Checklist | Day of Us',
  description: 'A complete month-by-month wedding checklist from 12 months out to your wedding day. Free to use, no sign-up required.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
