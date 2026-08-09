import { MetadataRoute } from 'next';
import { SITE_CONFIG, getCanonicalUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const routes = [
    {
      path: '',
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      path: '/products/phone-osint',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      path: '/products/vehicle-osint',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      path: '/products/ai-case-solver',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      path: '/products/investigation-reports',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/products/rest-api',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/products/enterprise-infrastructure',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      path: '/pricing',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/use-cases',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/target-users',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      path: '/company/about',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      path: '/help',
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      path: '/terms',
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      path: '/privacy',
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      path: '/refund',
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
  ];

  return routes.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
