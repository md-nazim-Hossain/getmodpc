import { App } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AppCard } from '@/components/cards/app-card';

interface LatestUpdateAppsSectionProps {
  apps: App[];
}

export function LatestUpdateAppsSection({
  apps,
}: LatestUpdateAppsSectionProps) {
  return (
    <section className='section-spacing'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.latestApps.title}
          subtitle={SECTION_HEADERS.latestApps.subtitle}
          viewAllLink={SECTION_HEADERS.latestApps.viewAllLink}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {apps.map((app) => (
            <AppCard key={app.id} app={app} showVersion />
          ))}
        </div>
      </Container>
    </section>
  );
}
