export interface Article {
  link: string;
  name: string;
  title: string;
  datePublished: string;
  category: string;
  category_name: string;
  img: string;
  imageHint?: string;
  description: string; // Full HTML content for the article page
  sub_description: string;
  data_created: string;
  // excerpt: string; // Short summary, possibly AI-generated
  // isFeatured?: boolean;
  keywords?: string[];
}
