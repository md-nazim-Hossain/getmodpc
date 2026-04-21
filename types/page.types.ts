// -----------------------------
// Page Type Enum (scalable)
// -----------------------------
export type PageType = 'internal' | 'external' | string;

// -----------------------------
// Main Page Interface
// -----------------------------
export interface Page {
  id: string;

  title: string;
  slug: string;

  meta_title: string;
  meta_description: string | null;

  external_link: string | null;
  page_type: PageType;

  is_open_new_tab: boolean;

  content: string; // HTML content

  is_active: boolean;

  last_edited_at: string | null;

  created_at: string;
  updated_at: string;
}
