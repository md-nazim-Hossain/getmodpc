import { ThemeConfig } from '@/types/global-settings.types';

interface ThemeInjectorProps {
  theme: ThemeConfig | null;
}

export function ThemeInjector({ theme }: ThemeInjectorProps) {
  if (!theme) return null;

  // Override the :root shadcn vars directly with hex values.
  // Tailwind v4 + shadcn accept hex in CSS custom properties —
  // only the @theme{} block needs OKLCH. Runtime :root overrides work with any format.
  const css = `
    :root {
      --background: ${theme.background_color};
      --primary: ${theme.primary_color};
      --secondary: ${theme.secondary_color};
      --accent: ${theme.accent_color};
    }
  `.trim();

  return (
    <style dangerouslySetInnerHTML={{ __html: css }} data-theme='dynamic' />
  );
}
