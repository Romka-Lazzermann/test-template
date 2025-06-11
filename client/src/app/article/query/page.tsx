
import { fetchData } from '@/lib/api';
import QueryResultsBlock from '@/components/articles/query'
import { cookies } from 'next/headers';
interface SearchPageProps {
    searchParams?: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const searchP = await searchParams
    const query = searchP?.q || '';
    const search = await fetchData(`${process.env.NEXT_PUBLIC_SITE_DOMAIN}/api/public/search?q=${query}`)
    const cookieStore = await cookies()
    const impressionID = cookieStore.get('impression_id')?.value
   
    const { items } = search;
    return (
        <QueryResultsBlock query={query} impressionID={impressionID} items={items} />
    );
}
