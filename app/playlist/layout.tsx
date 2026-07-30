import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding Song Request Tool | Day of Us',
  description: 'Search songs, preview them, and build your wedding playlist for free — guests can request songs with 30-second previews.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
