// Media Type (expandable for future formats)
export type AdMediaType = 'image' | 'video' | 'gif' | string;

// Core Ad Interface
export interface Ad {
  id: string;

  media_url: string;
  media_type: AdMediaType;

  cta_url: string;
  cta_label: string;

  title: string;
  description: string;

  is_active: boolean;

  start_at: string; // ISO Date
  end_at: string; // ISO Date

  created_at: string;
  updated_at: string;
}
