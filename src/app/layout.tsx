import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tiffin Manager - Kitchen Order List Generator',
  description: 'Simple and efficient kitchen order list generator for tiffin services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
