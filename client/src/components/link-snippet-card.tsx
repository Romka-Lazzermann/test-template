import type { FC } from 'react';
import Link from 'next/link';

interface LinkSnippetCardProps {
  title: string;
  snippet: string;
  link: string;
  className?: string;
  redirect?: boolean
}

const LinkSnippetCard: FC<LinkSnippetCardProps> = ({ title, snippet, link, className = '', redirect }: any) => {
  const props = redirect ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Link
      href={link}
      className={`block p-3 sm:p-4 rounded-lg hover:bg-muted/30 transition-colors group ${className}`}
      {...props}
    >
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary underline decoration-transparent group-hover:decoration-primary/70 underline-offset-2 transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
        {snippet}
      </p>
    </Link>
  );
};

export default LinkSnippetCard;
