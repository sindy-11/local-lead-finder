import type { BusinessData, Lead, WebsiteStatus } from '@/types';
export function score(b: BusinessData): number {
  return (!b.website ? 3 : 0) + (b.phone ? 2 : 0) + ((b.reviews ?? 0) >= 50 ? 2 : 0) + ((b.rating ?? 0) >= 4 ? 1 : 0) + (b.businessStatus === 'OPERATIONAL' ? 1 : 0);
}
export function potential(b: BusinessData & {lead?: Lead['lead']}): boolean {
  return !b.website && !b.lead?.manualWebsite && b.lead?.websiteStatus !== 'WEBSITE FOUND' && (Boolean(b.phone) || Boolean(b.name && (b.address || b.mapsUrl))) && b.businessStatus !== 'CLOSED_PERMANENTLY';
}
export function websiteStatus(b: Lead): WebsiteStatus {
  return b.lead?.websiteStatus ?? (b.website ? 'WEBSITE FOUND' : b.source === 'google' && !b.name ? 'NEEDS VERIFICATION' : 'NO WEBSITE LISTED');
}
export function isContacted(status?: string) { return !!status && !['NEW','TO CONTACT'].includes(status); }
export const scoreFormula = '+3 сайт не указан · +2 телефон · +2 отзывы ≥50 · +1 рейтинг ≥4 · +1 Operational. Только сортировка, не вероятность покупки.';
