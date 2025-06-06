
import { getArticleBySlug, getRecentArticles, getAllArticles } from '@/lib/articles';
import type { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, Tag } from 'lucide-react';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: `${article.title} | MuseBlog`,
    description: article.excerpt,
    keywords: article.tags?.join(', ') || article.category,
    openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [
            {
                url: article.imageUrl,
                width: 1200,
                height: 600,
                alt: article.title,
            }
        ],
        type: 'article',
        publishedTime: article.datePublished,
        authors: [article.author],
        tags: article.tags,
    }
  };
}


export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const recentArticles = getRecentArticles(4, article.slug);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <article className="lg:col-span-8 space-y-6 bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-border">
        <header className="space-y-3 sm:space-y-4">
          <Badge variant="default" className="bg-primary/10 text-primary border-primary/30 text-sm hover:bg-primary/20">
            {article.category}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(article.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden shadow-sm my-4 sm:my-6">
          <Image
            src={article.imageUrl}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint={article.imageHint || article.category.toLowerCase()}
          />
        </div>

        <div
          className="prose prose-lg max-w-none text-foreground/90 
                     prose-headings:text-primary prose-headings:font-semibold
                     prose-a:text-accent hover:prose-a:underline
                     prose-strong:text-foreground 
                     prose-blockquote:border-accent prose-blockquote:text-muted-foreground
                     prose-img:rounded-md prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm border-primary/50 text-primary hover:bg-primary/10 rounded-full px-3 py-1">
                  <Tag className="h-3 w-3 mr-1.5" /> {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
        <Card className="shadow-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold text-primary">Recent Articles</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-3 sm:space-y-4">
              {recentArticles.map((recent) => (
                <li key={recent.slug} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                  <Link href={`/articles/${recent.slug}`} className="group block">
                    <h4 className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                      {recent.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(recent.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export const revalidate = 3600;
