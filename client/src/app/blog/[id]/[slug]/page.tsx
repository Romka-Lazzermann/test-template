
import type { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, Tag } from 'lucide-react';
import { fetchData } from '@/lib/api'
import LinkSnippetCard from '@/components/link-snippet-card';

interface ArticlePageProps {
  params: { id: string, slug: string };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id, slug } = await params;
  const blog: Article = await fetchData(`${process.env.SERVER_URL}/api/public/blogs/${id}`)
  const recent: Article[] = await fetchData(`${process.env.SERVER_URL}/api/public/blogs/${id}/recent`)

  // const article = getArticleBySlug(params.slug);

  if (!blog) {
    notFound();
  }
  console.log("keys", Object.keys(blog), typeof blog.keywords);
  // const recentArticles = getRecentArticles(4, article.slug);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <article className="lg:col-span-8 space-y-6 bg-card p-4 sm:p-6 md:p-8 rounded-lg shadow-md border border-border">
        <header className="space-y-3 sm:space-y-4">
          <Badge variant="default" className="bg-primary/10 text-primary border-primary/30 text-sm hover:bg-primary/20">
            {blog.category}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(blog.data_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {blog?.keywords?.length && blog.keywords?.map((keyword: any, index) => (
        <LinkSnippetCard
          link={`/query?q=${keyword}`}
          snippet=''
          title={keyword}
          key={`${keyword}-${index}`}
          redirect={false}
        />
      ))}

        <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden shadow-sm my-4 sm:my-6">
          <Image
            src={blog.img}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint={blog.category.toLowerCase()}
          />
        </div>
        
        <div
          className="prose prose-lg max-w-none text-foreground/90 
                     prose-headings:text-primary prose-headings:font-semibold
                     prose-a:text-accent hover:prose-a:underline
                     prose-strong:text-foreground 
                     prose-blockquote:border-accent prose-blockquote:text-muted-foreground
                     prose-img:rounded-md prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: blog.sub_description }}
        />
        {blog.keywords && blog.keywords.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.keywords.map(keyword => (
                <Badge key={keyword} variant="outline" className="text-sm border-primary/50 text-primary hover:bg-primary/10 rounded-full px-3 py-1">
                  <Tag className="h-3 w-3 mr-1.5" /> {keyword}
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
              {recent.map((recent : Article, index) => (
                <li key={`${index}-${recent.name}`} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
                  <Link href={`${recent.link}`} className="group block">
                    <h4 className="font-medium text-sm sm:text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                      {recent.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(recent.data_created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
