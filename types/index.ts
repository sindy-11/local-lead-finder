export const categories = ['BARBERSHOP','TATTOO','BEAUTY','DETAILING','CAFE','FITNESS','DENTAL','AUTO SERVICE'] as const;
export const contacts = ['NEW','TO CONTACT','CONTACTED','REPLIED','INTERESTED','NOT INTERESTED','FOLLOW UP','CLIENT'] as const;
export const websiteStatuses = ['NO WEBSITE LISTED','WEBSITE FOUND','NEEDS VERIFICATION','VERIFIED NO OFFICIAL WEBSITE'] as const;
export type Category = typeof categories[number];
export type ContactStatus = typeof contacts[number];
export type WebsiteStatus = typeof websiteStatuses[number];
export type Mode = 'demo' | 'live';
export interface BusinessData {
  source: 'demo' | 'google'; sourceId: string; name: string | null; category: string | null; city: string | null; categoryKey?: Category | null;
  address: string | null; phone: string | null; website: string | null; rating: number | null; reviews: number | null;
  mapsUrl: string | null; latitude: number | null; longitude: number | null; businessStatus: string | null;
  attributions?: { provider: string; uri: string }[];
}
export interface LeadMeta {
  saved: boolean; contactStatus: ContactStatus; websiteStatus: WebsiteStatus | null; verificationNote: string; notes: string;
  instagram: string | null; whatsapp: string | null; email: string | null; manualName: string | null; manualPhone: string | null; manualWebsite: string | null;
}
export interface Lead extends BusinessData {
  id: string; noWebsiteListed: boolean; createdAt: string; updatedAt: string; lead: LeadMeta | null;
}
export interface SearchInput { city: string; category: Category; limit: number; mode: Mode }
export interface SearchResult { businesses: BusinessData[]; operations: number }
