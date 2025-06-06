
import type { Article } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'default' | 'compact' | 'search-result';
  className?: string;
}

const ArticleCard = ({ article, variant = 'default', className = '' }: ArticleCardProps) => {
  const { slug, title, imageUrl, imageHint, excerpt, datePublished, category, author } = article;

  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <Card className={cn(
      "overflow-hidden group bg-card border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out",
      isFeatured ? "col-span-1 md:col-span-2 lg:col-span-4 flex flex-col md:flex-row" : "", // Specific for featured, spanning more columns
      className
    )}>
      <Link href={`/articles/${slug}`} className={cn("block", isFeatured ? "md:flex md:w-full" : "")}>
        <div className={cn(
            "relative w-full overflow-hidden",
            isFeatured ? "md:w-1/2 aspect-[16/9] md:aspect-auto" : "aspect-[16/9]" // Featured image takes half width on md+
        )}>
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
            data-ai-hint={imageHint || category.toLowerCase()}
            priority={isFeatured}
          />
          <Badge variant="default" className={cn(
            "absolute top-2 left-2 text-xs px-2 py-1 rounded-full",
            "bg-primary/80 text-primary-foreground border-none", // Using primary for badge as per new theme
          )}>
            {category}
          </Badge>
        </div>
        <CardContent className={cn(
            "p-3 sm:p-4", 
            isFeatured ? "md:w-1/2 md:p-6 flex flex-col justify-center" : "" // Featured content takes other half
        )}>
          <CardTitle className={cn(
            "font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight",
            isFeatured ? "text-xl sm:text-2xl md:text-3xl mb-2 md:mb-3" : "text-base sm:text-lg"
          )}>
            {title}
          </CardTitle>
          {((!isCompact && excerpt) || isFeatured) && ( // Show excerpt for featured too
             <p className={cn(
                "text-muted-foreground line-clamp-2 mt-1 sm:mt-1.5",
                isFeatured ? "text-sm sm:text-base md:line-clamp-3" : "text-xs sm:text-sm"
             )}>
               {excerpt}
             </p>
          )}
          <div className={cn(
            "flex items-center text-xs text-muted-foreground mt-2 sm:mt-2.5 space-x-2 sm:space-x-3",
            isFeatured ? "md:mt-4" : ""
          )}>
            <div className="flex items-center">
              <UserCircle className="h-3.5 w-3.5 mr-1" />
              <span className="truncate max-w-[100px] sm:max-w-[120px]">{author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleCard;
