import { Category } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { CategoryCard } from '@/components/cards/category-card';

interface AppCategoriesSectionProps {
  categories: Category[];
}

export function AppCategoriesSection({
  categories,
}: AppCategoriesSectionProps) {
  return (
    <section className='section-spacing'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.appCategories.title}
          subtitle={SECTION_HEADERS.appCategories.subtitle}
          viewAllLink={SECTION_HEADERS.appCategories.viewAllLink}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
