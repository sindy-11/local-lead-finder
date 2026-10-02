import type { BusinessData, SearchInput } from '@/types';
import type { PlacesProvider } from './types';
const names = ['NORTH STUDIO','LINE & INK','BLACK CANVAS','FORM ATELIER','MONO HOUSE','DISTRICT LAB','SOUTH CLUB','NEON ROOM','URBAN WORKS','STATION 12','POINT STUDIO','CIRCLE SPACE'];
export function demoBusinesses(input: SearchInput): BusinessData[] {
  return names.slice(0,input.limit).map((name,i)=>({source:'demo',sourceId:`demo-${input.city.toLowerCase()}-${input.category}-${i}`,name:`${name} · DEMO`,category:input.category,city:input.city,address:`Вымышленный адрес ${i+1}, ${input.city}`,phone:i%4===0?null:`+7 000 000 ${String(i).padStart(4,'0')}`,website:i%3===1?'https://example.com':null,rating:i===10?null:[4.8,4.6,4.9,4.2,3.9][i%5],reviews:i===10?null:[217,63,112,24,8,91][i%6],mapsUrl:null,latitude:null,longitude:null,businessStatus:i===9?'CLOSED_PERMANENTLY':i===6?'CLOSED_TEMPORARILY':'OPERATIONAL'}));
}
export const demoProvider: PlacesProvider = { async search(input) { return {businesses:demoBusinesses(input),operations:0}; } };
