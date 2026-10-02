import 'server-only';
import type { BusinessData, SearchInput } from '@/types';
import type { PlacesProvider } from './types';
import { AppError } from '@/lib/http';
interface Place {
  id: string; displayName?: {text:string}; primaryTypeDisplayName?: {text:string}; formattedAddress?: string;
  internationalPhoneNumber?: string; websiteUri?: string; rating?: number; userRatingCount?: number;
  googleMapsUri?: string; location?: {latitude:number;longitude:number}; businessStatus?: string;
  addressComponents?: {longText:string;types:string[]}[]; attributions?: {provider:string;providerUri:string}[];
}
const queries: Record<string,string> = {BARBERSHOP:'барбершопы',TATTOO:'тату салоны',BEAUTY:'салоны красоты',DETAILING:'детейлинг',CAFE:'кафе',FITNESS:'фитнес клубы',DENTAL:'стоматологии','AUTO SERVICE':'автосервисы'};
export async function googleRequest(path: string, fields: string, body?: object) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new AppError('Google Places API не настроен. Откройте Settings / README для подключения.',503);
  let response: Response;
  try { response = await fetch(`https://places.googleapis.com/v1/${path}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fields},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000),cache:'no-store'}); }
  catch { throw new AppError('Не удалось связаться с Google Places. Проверьте сеть и повторите поиск.',502); }
  if(!response.ok) {
    if(response.status===429) throw new AppError('Лимит Google Places исчерпан. Проверьте квоты и billing.',429);
    if([400,401,403].includes(response.status)) throw new AppError('Google отклонил запрос. Проверьте API key, ограничения, включение Places API (New) и billing.',400);
    throw new AppError('Google Places временно недоступен.',502);
  }
  return response.json();
}
const fields = 'id,displayName,primaryTypeDisplayName,formattedAddress,internationalPhoneNumber,websiteUri,rating,userRatingCount,googleMapsUri,location,businessStatus,addressComponents,attributions';
export function normalize(p:Place): BusinessData {
  return {source:'google',sourceId:p.id,name:p.displayName?.text??null,category:p.primaryTypeDisplayName?.text??null,city:p.addressComponents?.find(a=>a.types.includes('locality'))?.longText??null,address:p.formattedAddress??null,phone:p.internationalPhoneNumber??null,website:p.websiteUri??null,rating:p.rating??null,reviews:p.userRatingCount??null,mapsUrl:p.googleMapsUri??null,latitude:p.location?.latitude??null,longitude:p.location?.longitude??null,businessStatus:p.businessStatus??null,attributions:p.attributions?.map(a=>({provider:a.provider,uri:a.providerUri}))};
}
export const googleProvider: PlacesProvider = { async search(input: SearchInput) {
  const businesses = new Map<string,BusinessData>(); let token: string | undefined; let operations=0;
  do {
    const result: {places?:Place[];nextPageToken?:string} = await googleRequest('places:searchText',fields.split(',').map(f=>`places.${f}`).join(',')+',nextPageToken',{textQuery:`${queries[input.category]} ${input.city}`,pageSize:Math.min(20,input.limit-businesses.size),languageCode:'ru',...(token?{pageToken:token}:{})});
    operations++; for(const place of result.places??[]) businesses.set(place.id,normalize(place)); token=result.nextPageToken;
  } while(token && businesses.size<input.limit && operations<5);
  return {businesses:[...businesses.values()].slice(0,input.limit),operations};
} };
