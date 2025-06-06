export interface Article {
  slug: string;
  title: string;
  datePublished: string;
  author: string;
  category: string;
  imageUrl: string;
  imageHint?: string;
  content: string; // Full HTML content for the article page
  excerpt: string; // Short summary, possibly AI-generated
  isFeatured?: boolean;
  tags?: string[];
}
