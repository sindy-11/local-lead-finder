import type { BusinessData } from '@/types';
// Optional future adapter; never sends messages. No API key or AI dependency is needed for MVP.
export interface AiService { analyze(business:BusinessData): Promise<string>; draft(business:BusinessData,demoUrl:string|null): Promise<string> }
