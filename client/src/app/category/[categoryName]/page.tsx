
import { getArticlesByCategory, getAllUniqueCategories } from '@/lib/articles';
import ArticleCard from '@/components/article-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: { categoryName: string };
}

export async function generateStaticParams() {
  const categories = getAllUniqueCategories();
  return categories.map((category) => ({
    categoryName: category, // category slugs are already lowercase
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.categoryName;
  const displayCategoryName = formatCategoryName(categoryName);
  return {
    title: `Articles in ${displayCategoryName} | MuseBlog`,
    description: `Browse all articles in the ${displayCategoryName} category on MuseBlog.`,
  };
}

// Helper function to format category name for display
function formatCategoryName(categorySlug: string): string {
  if (!categorySlug) return '';
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const articles = getArticlesByCategory(params.categoryName);
  const displayCategoryName = formatCategoryName(params.categoryName);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" asChild className="hover:bg-primary/10 hover:text-primary border-border hover:border-primary/70 text-foreground">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <header className="bg-card p-4 sm:p-6 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Category: <span className="text-primary">{displayCategoryName}</span>
        </h1>
      </header>

      {articles.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="default" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow-sm">
          <p className="text-lg sm:text-xl text-muted-foreground">
            No articles found in the "{displayCategoryName}" category yet.
          </p>
        </div>
      )}
    </div>
  );
}

export const revalidate = 3600; // Revalidate category pages every hour
