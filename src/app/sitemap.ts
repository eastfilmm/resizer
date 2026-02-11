import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://resizer-nine.vercel.app';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date('2025-02-11'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
