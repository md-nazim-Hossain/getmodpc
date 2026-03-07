import { App } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AppCard } from '@/components/cards/app-card';

interface PopularGamesSectionProps {
  games: App[];
}

export function PopularGamesSection({ games }: PopularGamesSectionProps) {
  return (
    <section className='section-spacing bg-linear-to-b from-transparent via-primary/5 to-transparent'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.popularGames.title}
          subtitle={SECTION_HEADERS.popularGames.subtitle}
          viewAllLink={SECTION_HEADERS.popularGames.viewAllLink}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {games.map((game) => (
            <AppCard key={game.id} app={game} />
          ))}
        </div>
      </Container>
    </section>
  );
}
