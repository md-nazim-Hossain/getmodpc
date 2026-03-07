import { App } from '@/lib/types';
import { SECTION_HEADERS } from '@/lib/constants';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AppCard } from '@/components/cards/app-card';

interface NewReleaseAppsSectionProps {
  apps: App[];
}

export function NewReleaseAppsSection({ apps }: NewReleaseAppsSectionProps) {
  return (
    <section className='section-spacing bg-linear-to-b from-transparent via-primary/5 to-transparent'>
      <Container>
        <SectionHeader
          title={SECTION_HEADERS.newApps.title}
          subtitle={SECTION_HEADERS.newApps.subtitle}
          viewAllLink={SECTION_HEADERS.newApps.viewAllLink}
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
