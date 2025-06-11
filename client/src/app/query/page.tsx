
import { fetchData } from '@/lib/api';
import LinkSnippetCard from '@/components/link-snippet-card'
interface SearchPageProps {
  searchParams?: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const searchP = await searchParams
  const query =  searchP?.q || '';
  const search = await fetchData(`${process.env.SERVER_URL}/api/public/search?q=${query}`)
  const { items } = search;
  console.log(Object.keys(search))
  return (
    <div className="space-y-8">
      <header className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-foreground">
          {query ? `Search Results for "${query}"` : 'Search Articles'}
        </h1>
      </header>
      {items?.length > 0 ? items?.map((item: any, index: any) => {
        return (
          <div key={`${index}-${item?.title}`}>
            <LinkSnippetCard
              title={item?.title}
              link={item?.link}
              snippet={item?.snippet}
            />
          </div>
        )
      }) : (<></>)}
    </div>
  );
}
