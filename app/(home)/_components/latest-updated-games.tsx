import { App } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AppCard } from '@/components/cards/app-card';

interface LatestUpdateGamesSectionProps {
  games: App[];
}

export function LatestUpdateGamesSection({
  games,
}: LatestUpdateGamesSectionProps) {
  return (
    <section className='section-spacing'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.latestGames.title}
          subtitle={SECTION_HEADERS.latestGames.subtitle}
          viewAllLink={SECTION_HEADERS.latestGames.viewAllLink}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {games.map((game) => (
            <AppCard key={game.id} app={game} showVersion />
          ))}
        </div>
      </Container>
    </section>
  );
}
