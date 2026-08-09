import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG, constructMetadata, getWebsiteSchema, getOrganizationSchema } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  ...constructMetadata({
    title: 'Huntme | AI-Powered OSINT & Intelligence Platform',
    description:
      'Search publicly available phone telemetry, vehicle registration records, and AI-powered investigation timelines with enterprise-grade Open Source Intelligence (OSINT).',
    path: '/',
  }),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = getWebsiteSchema();
  const organizationSchema = getOrganizationSchema();

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

