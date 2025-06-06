
import { searchArticles } from '@/lib/articles';
import ArticleCard from '@/components/article-card';
import SearchBar from '@/components/search-bar'; 

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q || '';
  const articles = searchArticles(query);

  return (
    <div className="space-y-8">
      <header className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-foreground">
          {query ? `Search Results for "${query}"` : 'Search Articles'}
        </h1>
        <div className="max-w-xl mx-auto">
         <SearchBar />
        </div>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {articles.map((article) => (
            // Using default variant for search results to match homepage grid
            <ArticleCard key={article.slug} article={article} variant="default" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow-sm">
          <p className="text-lg sm:text-xl text-muted-foreground">
            {query ? 'No articles found matching your search.' : 'Enter a search term to find articles.'}
          </p>
        </div>
      )}
    </div>
  );
}
