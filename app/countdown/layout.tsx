import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding Countdown Timer | Day of Us',
  description: 'Create a live countdown to your wedding day and share it with family and friends. Free, no account needed.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
