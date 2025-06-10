
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  categoryName: string;
  title: string;
  name: string;
  id: string;
  imageUrl: string;
  // imageHint?: string;
  href: string;
  // articleCount?: number;
  className?: string;
}

const CategoryCard = ({ categoryName, name, title,  className = '', href, imageUrl }: CategoryCardProps) => {
  console.log('imageUrl', imageUrl)
  return (
    <Card className={cn(
      "overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out group bg-card border-border rounded-lg",
      className
    )}>
      <Link href={href} className="flex items-center h-full">
        <div className="relative w-24 h-full sm:w-28 shrink-0 bg-primary/10 group-hover:bg-primary/20 transition-colors">
          {/* The image is now a background for this colored div if an actual image isn't fitting well */}
          {/* For a true image on the left, similar to reference, we'd need careful styling */}
          <Image
            src={imageUrl} // This would be the actual category icon/image
            alt={name}
            layout="fill"
            objectFit="contain" // Or "cover", depending on image aspect ratio
            className="p-4 group-hover:scale-105 transition-transform duration-300 opacity-70 group-hover:opacity-100"
            // data-ai-hint={imageHint || categoryName.toLowerCase()}
          />
        </div>
        <div className="p-3 sm:p-4 flex-grow">
          <CardTitle className="text-md sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </CardTitle>
          <div className="mt-1.5 sm:mt-2 text-xs text-primary group-hover:underline flex items-center">
            Show more
            <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default CategoryCard;
