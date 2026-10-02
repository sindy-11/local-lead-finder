import type { SearchInput, SearchResult } from '@/types';
export interface PlacesProvider { search(input: SearchInput): Promise<SearchResult> }
export interface EnrichmentProvider { enrich(sourceId: string): Promise<{instagram: string | null; email: string | null}> }
