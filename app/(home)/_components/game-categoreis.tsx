import { Category } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { CategoryCard } from '@/components/cards/category-card';

interface GameCategoriesSectionProps {
  categories: Category[];
}

export function GameCategoriesSection({
  categories,
}: GameCategoriesSectionProps) {
  return (
    <section className='section-spacing bg-linear-to-b from-transparent via-primary/5 to-transparent'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.gameCategories.title}
          subtitle={SECTION_HEADERS.gameCategories.subtitle}
          viewAllLink={SECTION_HEADERS.gameCategories.viewAllLink}
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
