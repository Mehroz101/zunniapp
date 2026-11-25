import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface SearchRedirectPageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function SearchRedirectPage({ searchParams }: SearchRedirectPageProps) {
  const resolved = searchParams ? await searchParams : {};
  const query = resolved?.q?.trim();
  if (query) {
    permanentRedirect(`/tools?q=${encodeURIComponent(query)}`);
  }
  permanentRedirect('/tools');
}
