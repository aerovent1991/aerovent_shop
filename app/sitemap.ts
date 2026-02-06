import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.siteUrl.replace(/\/+$/, '');

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/uav`, lastModified: new Date() },
    { url: `${base}/electronic_warfare_systems`, lastModified: new Date() },
    { url: `${base}/drone_detectors`, lastModified: new Date() },
    { url: `${base}/batteries`, lastModified: new Date() },
    { url: `${base}/nrk`, lastModified: new Date() },
    { url: `${base}/technologies`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
  ];
}
