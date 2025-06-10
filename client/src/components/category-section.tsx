
import CategoryCard from './category-card';
import { getAllUniqueCategories, getArticlesByCategory } from '@/lib/articles';
import {fetchData} from '@/lib/api'
interface CategoryInfoForDisplay {
  id: string;
  name: string;
  title: string;
  // imageUrl: string;
  // imageHint?: string;
  // href: string;
  // articleCount: number;
}

export default async function CategorySection() {
  const categories = await fetchData(`${process.env.SERVER_URL}/api/public/categories/`)

  console.log("categories", categories);
  return (
    <section aria-labelledby="category-section-heading" className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h2 id="category-section-heading" className="text-2xl sm:text-3xl font-semibold mb-6 text-foreground text-left">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category: CategoryInfoForDisplay, index : number) => (
            <CategoryCard
              key={`${index}-${category.id}`}
              id={category.id}
              categoryName={category.name}
              title={category.title}
              name={category.name}
              href={`/category/${category.name}`}
              imageUrl={`/images/category-${category.id}.webp`}
              // imageUrl={category.imageUrl}
              // imageHint={category.imageHint}
              // href={category.href}
              // articleCount={category.articleCount}
              className="h-28 sm:h-32" // Set a fixed height for consistency
            />
          ))}
        </div>
      </div>
    </section>
  );
};
