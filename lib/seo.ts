import type { Metadata } from 'next';

export const SITE_CONFIG = {
  name: 'Huntme',
  fullName: 'Huntme | AI-Powered OSINT Intelligence Platform',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://huntme.in',
  description:
    'Search publicly available phone telemetry, vehicle registration records, and AI-powered investigation timelines with enterprise-grade Open Source Intelligence (OSINT).',
  tagline: 'Intelligence Made Simple - Enterprise-Grade AI OSINT Platform',
  twitterHandle: '@huntme_osint',
  supportEmail: 'your.weanonymous@gmail.com',
  location: {
    address: 'DLF Cyber City, Phase 2',
    city: 'Gurugram',
    region: 'Haryana',
    postalCode: '122002',
    country: 'India',
  },
};

export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${cleanPath === '/' ? '' : cleanPath}`;
}

export function constructMetadata({
  title,
  description,
  path = '',
  image = '/DashBoard-huntme.png',
  noIndex = false,
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = image.startsWith('http') ? image : `${SITE_CONFIG.domain}${image.startsWith('/') ? image : `/${image}`}`;

  const defaultKeywords = [
    'OSINT',
    'Open Source Intelligence',
    'AI OSINT Platform',
    'Phone OSINT',
    'Vehicle OSINT',
    'Reverse Phone Lookup',
    'License Plate Search',
    'Cyber Investigation',
    'Threat Intelligence',
    'Entity Resolution',
    'Investigation Reports',
    'Cybersecurity Tools',
    'RTO Vehicle Records',
    'Due Diligence Software',
  ];

  const mergedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    authors: [{ name: 'Huntme Intelligence Team', url: SITE_CONFIG.domain }],
    creator: 'Huntme',
    publisher: 'Huntme',
    metadataBase: new URL(SITE_CONFIG.domain),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Huntme OSINT`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/* -------------------------------------------------------------------------- */
/*                        Schema.org JSON-LD Generators                       */
/* -------------------------------------------------------------------------- */

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    alternateName: ['Huntme OSINT', 'Huntme Intelligence', 'Huntme AI'],
    url: SITE_CONFIG.domain,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.domain}/products/phone-osint?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/icon.png`,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.supportEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.location.address,
      addressLocality: SITE_CONFIG.location.city,
      addressRegion: SITE_CONFIG.location.region,
      postalCode: SITE_CONFIG.location.postalCode,
      addressCountry: SITE_CONFIG.location.country,
    },
    sameAs: ['https://twitter.com/huntme_osint'],
  };
}

export function getSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_CONFIG.name,
    operatingSystem: 'All (Web Browser, Cloud REST API)',
    applicationCategory: 'SecurityApplication',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '79',
      highPrice: '499',
      offerCount: '2',
      offers: [
        {
          '@type': 'Offer',
          name: 'Pro Plan',
          price: '79',
          priceCurrency: 'INR',
          description: '100 OSINT Credits for phone, vehicle, and AI investigation lookups.',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Premium Plan',
          price: '499',
          priceCurrency: 'INR',
          description: '1,000 OSINT Credits with priority data sources and faster processing.',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    description: SITE_CONFIG.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function getFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}
