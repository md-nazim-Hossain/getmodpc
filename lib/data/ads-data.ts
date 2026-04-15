// data/ads.ts
import { Ad } from '@/types';

export const ADS_SAMPLE_DATA: Ad[] = [
  {
    id: '1',
    banner_image: '/images/ads/link-in-bio-banner.png',
    banner_bg_color: '#5B4EE8',
    title: 'Link in Bio',
    description:
      'Boost your online presence – sell, share, and grow with one powerful link, free for the whole year. Upgrade to full website anytime.',
    cta_label: 'Claim free site',
    cta_link: 'https://example.com/link-in-bio',
  },
  {
    id: '2',
    banner_image: '/images/ads/online-store-banner.png',
    banner_bg_color: '#0EA5E9',
    title: 'Online Store',
    description:
      'Launch your store in minutes. Accept payments, manage orders, and grow your business — all in one place.',
    cta_label: 'Start selling',
    cta_link: 'https://example.com/online-store',
  },
  {
    id: '3',
    banner_image: '/images/ads/appointments-banner.png',
    banner_bg_color: '#10B981',
    title: 'Book Appointments',
    description:
      'Let clients schedule time with you 24/7. Sync with your calendar and send automatic reminders.',
    cta_label: 'Try for free',
    cta_link: 'https://example.com/appointments',
  },
  {
    id: '4',
    banner_image: '/images/ads/email-banner.png',
    banner_bg_color: '#F59E0B',
    title: 'Email Marketing',
    description:
      'Reach your audience with beautiful emails. Design, send, and track campaigns that convert.',
    cta_label: 'Get started',
    cta_link: 'https://example.com/email',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Example page usage
// ──────────────────────────────────────────────────────────────────────────────
//
// import AdsSection from "@/components/AdsSection";
// import { ADS_SAMPLE_DATA } from "@/data/ads";
//
// export default function HomePage() {
//   return (
//     <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
//
//       {/* Basic usage */}
//       <AdsSection ads={ADS_SAMPLE_DATA} />
//
//       {/* With optional heading */}
//       <AdsSection
//         heading="Sponsored"
//         ads={ADS_SAMPLE_DATA}
//       />
//
//       {/* With autoplay */}
//       <AdsSection
//         heading="Explore features"
//         ads={ADS_SAMPLE_DATA}
//         autoplay
//         autoplayDelay={5000}
//       />
//
//     </main>
//   );
// }
