import { Testimonial } from '@/types';

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    author_name: 'Drew Smith',
    author_image: '/images/testimonials/drew-smith.jpg',
    designation: 'CEO',
    workplace_name: 'Makt-Trans',
    workplace_logo: '/images/logos/makt-trans.svg',
    message:
      'We serve both large shippers and smaller customers with unique requirements; the right solutions let us sustain those relationships at scale. Vooma helps us move faster and deliver exceptional customer experience.',
  },
  {
    id: '2',
    author_name: 'John Sutton',
    author_image: '/images/testimonials/john-sutton.jpg',
    designation: 'Director of Corporate Strategy',
    workplace_name: 'Sunset Transportation',
    workplace_logo: '/images/logos/sunset.svg',
    message:
      "Vooma's suite of AI solutions makes workflows more efficient, empowering teams to become data-rich in ways that were previously impossible.",
  },
  {
    id: '3',
    author_name: 'Charles Miller',
    author_image: '/images/testimonials/charles-miller.jpg',
    designation: 'Chief Commercial Officer',
    workplace_name: 'Evans Transportation Services',
    workplace_logo: '/images/logos/evans.svg',
    message:
      'The analytics behind Vooma helped our team move from reactive to proactive. What used to take hours of manual work, we can now track and act on in real time.',
  },
  {
    id: '4',
    author_name: 'Sarah Chen',
    author_image: '/images/testimonials/sarah-chen.jpg',
    designation: 'VP of Operations',
    workplace_name: 'Freight Forward Inc.',
    message:
      'Implementing Vooma transformed how we handle customer relationships. The AI-driven insights give us a competitive edge we never thought possible in this industry.',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Example page usage: app/page.tsx (or pages/index.tsx)
// ──────────────────────────────────────────────────────────────────────────────
//
// import TestimonialsSection from "@/components/TestimonialsSection";
// import { TESTIMONIALS_DATA } from "@/data/testimonials";
//
// export default function HomePage() {
//   return (
//     <main>
//       {/* ... other sections ... */}
//
//       <TestimonialsSection
//         subtitle="TESTIMONIALS"
//         title="What our customers say"
//         testimonials={TESTIMONIALS_DATA}
//         autoplay={false}
//         autoplayDelay={6000}
//       />
//
//       {/* ... other sections ... */}
//     </main>
//   );
// }
