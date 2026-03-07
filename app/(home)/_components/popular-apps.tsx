import { App } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AppCard } from '@/components/cards/app-card';

interface PopularAppsSectionProps {
  apps: App[];
}

export function PopularAppsSection({ apps }: PopularAppsSectionProps) {
  return (
    <section className='section-spacing'>
      <Container className=''>
        <SectionHeader
          title={SECTION_HEADERS.popularApps.title}
          subtitle={SECTION_HEADERS.popularApps.subtitle}
          viewAllLink={SECTION_HEADERS.popularApps.viewAllLink}
        />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </Container>
    </section>
  );
}
