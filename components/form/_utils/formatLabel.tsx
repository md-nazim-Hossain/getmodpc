export function formatLabel(label: string): string {
  if (!label || label.length === 0) return '';
  return label
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
