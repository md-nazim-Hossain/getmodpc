'use client';

import { createContext, useContext } from 'react';

import { findSetting, GlobalSetting } from '@/types/global-settings.types';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppSettingsContextValue {
  settings: GlobalSetting[];
  findSetting: typeof findSetting;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AppSettingsProviderProps {
  settings: GlobalSetting[];
  children: React.ReactNode;
}

export function AppSettingsProvider({
  settings,
  children,
}: AppSettingsProviderProps) {
  return (
    <AppSettingsContext.Provider value={{ settings, findSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx)
    throw new Error('useAppSettings must be used inside <AppSettingsProvider>');
  return ctx;
}

// ─── Scoped hooks (convenience) ───────────────────────────────────────────────

export function useSystemSettings() {
  const { settings } = useAppSettings();
  return findSetting(settings, 'system_settings')?.value ?? null;
}

export function useSocialLinks() {
  const { settings } = useAppSettings();
  return findSetting(settings, 'social_links')?.value.social_links ?? [];
}

export function useFooterSettings() {
  const { settings } = useAppSettings();
  return findSetting(settings, 'footer')?.value ?? null;
}

export function useSeoSettings() {
  const { settings } = useAppSettings();
  return findSetting(settings, 'seo')?.value ?? null;
}
