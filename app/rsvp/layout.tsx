import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Wedding RSVP Form | Day of Us',
  description: 'See how our guest RSVP form works, or create your own free wedding page to start collecting real responses from your guests.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
