
import CategoryCard from './category-card';
import { getAllUniqueCategories, getArticlesByCategory } from '@/lib/articles';

interface CategoryInfoForDisplay {
  name: string;
  imageUrl: string;
  imageHint?: string;
  href: string;
  articleCount: number;
}

function formatCategoryName(categorySlug: string): string {
  if (!categorySlug) return '';
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const CategorySection = () => {
  const uniqueCategories = getAllUniqueCategories();
  
  const categoryData: CategoryInfoForDisplay[] = uniqueCategories.map(slug => {
    const articles = getArticlesByCategory(slug);
    // Basic placeholder logic for images and hints, can be expanded
    let image = `https://placehold.co/100x100.png`; // Smaller for icon-like use
    let hint = slug;
    // Customize these per category if specific icons/images are desired
    if (slug === 'health') { image = `https://placehold.co/100x100.png`; hint = 'medical symbol'; }
    if (slug === 'finance') { image = `https://placehold.co/100x100.png`; hint = 'coins chart'; }
    if (slug === 'travel') { image = `https://placehold.co/100x100.png`; hint = 'globe airplane'; }
    if (slug === 'pets') { image = `https://placehold.co/100x100.png`; hint = 'paw print'; }
    if (slug === 'automobile') { image = `https://placehold.co/100x100.png`; hint = 'car silhouette'; }
    if (slug === 'shopping') { image = `https://placehold.co/100x100.png`; hint = 'shopping cart'; }
    if (slug === 'productivity') { image = `https://placehold.co/100x100.png`; hint = 'gears checkmark'; }
    if (slug === 'wellness') { image = `https://placehold.co/100x100.png`; hint = 'lotus flower'; }
    if (slug === 'creativity') { image = `https://placehold.co/100x100.png`; hint = 'idea lightbulb'; }
    if (slug === 'lifestyle') { image = `https://placehold.co/100x100.png`; hint = 'modern living'; }
    if (slug === 'self-improvement') { image = `https://placehold.co/100x100.png`; hint = 'upward arrow'; }

    return {
      name: formatCategoryName(slug),
      imageUrl: image,
      imageHint: hint,
      href: `/category/${slug}`,
      articleCount: articles.length,
    };
  }).slice(0, 6); // Limit to 6 categories

  return (
    <section aria-labelledby="category-section-heading" className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h2 id="category-section-heading" className="text-2xl sm:text-3xl font-semibold mb-6 text-foreground text-left">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categoryData.map((category) => (
            <CategoryCard
              key={category.name}
              categoryName={category.name}
              imageUrl={category.imageUrl}
              imageHint={category.imageHint}
              href={category.href}
              articleCount={category.articleCount}
              className="h-28 sm:h-32" // Set a fixed height for consistency
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
