import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/utils/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-02-11'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
