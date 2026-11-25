import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getToolBySlug } from '@/lib/tools/registry';
import { getCanonicalSiteUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getCanonicalSiteUrl();
  const reg = getToolBySlug(slug);
  let dbTool: { name?: string; tagline?: string; description?: string; status?: string } | null = null;

  if (!reg) {
    try {
      dbTool = await prisma.tool.findUnique({
        where: { slug },
        select: { name: true, tagline: true, description: true, status: true },
      });
    } catch {
      // Ignore DB fallback errors
    }
  }

  const name = reg?.name || (dbTool?.status === 'PUBLISHED' ? dbTool.name : undefined);
  const description =
    reg?.tagline ||
    reg?.description ||
    dbTool?.tagline ||
    dbTool?.description ||
    'Run this free online browser tool on TOOLty.';

  if (!name) {
    return {
      title: 'Tool Not Found | TOOLty',
      description: 'The requested utility could not be located.',
    };
  }

  const canonicalUrl = `${siteUrl}/tools/${slug}`;
  return {
    title: `${name} — Free Online Tool`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function LegacyCategoryToolRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const reg = getToolBySlug(slug);

  if (reg) {
    permanentRedirect(`/tools/${reg.slug}`);
  }

  try {
    const dbTool = await prisma.tool.findUnique({
      where: { slug },
      select: { slug: true, status: true },
    });
    if (dbTool && dbTool.status === 'PUBLISHED') {
      permanentRedirect(`/tools/${dbTool.slug}`);
    }
  } catch {
    // DB offline fallback
  }

  notFound();
}
