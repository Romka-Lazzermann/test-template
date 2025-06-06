
import { getFeaturedArticle, getRecentArticles } from '@/lib/articles';
import ArticleCard from '@/components/article-card';
import CategorySection from '@/components/category-section';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredArticle = getFeaturedArticle(); 
  const latestArticles = getRecentArticles(8, featuredArticle?.slug).slice(0,8); 

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* New Featured Article Section */}
      {featuredArticle && (
        <section aria-labelledby="featured-article-title" className="relative w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden shadow-xl group">
          <Image
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            layout="fill"
            objectFit="cover"
            priority
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={featuredArticle.imageHint || featuredArticle.category.toLowerCase()}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 md:p-16">
            <div className="max-w-xl">
              <h1 id="featured-article-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {featuredArticle.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-200 mb-6 line-clamp-3 sm:line-clamp-4">
                {featuredArticle.excerpt}
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-base font-semibold transition-transform group-hover:scale-105">
                <Link href={`/articles/${featuredArticle.slug}`}>
                  Read more
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Latest Articles Section - Grid */}
      {latestArticles.length > 0 && (
        <section aria-labelledby="latest-articles-heading" className="mt-12 sm:mt-16">
          <h2 id="latest-articles-heading" className="text-2xl sm:text-3xl font-semibold mb-6 text-foreground text-left">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="default" />
            ))}
          </div>
        </section>
      )}
      
      {/* Category Section */}
      <CategorySection />

    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour if using ISR
