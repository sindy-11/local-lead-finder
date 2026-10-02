import 'server-only';
import type { Business, SavedLead } from '@prisma/client';
import { db } from '@/db/client';
import type { BusinessData, Category, Lead, LeadMeta, SearchInput } from '@/types';
import { demoProvider } from '@/providers/demo';
import { googleProvider } from '@/providers/googlePlaces';
import { withLiveGuard } from '@/lib/http';
export function serialize(b:Business & {lead:SavedLead|null}, current?:BusinessData): Lead {
  const data:BusinessData = current ?? (b.data?JSON.parse(b.data):{source:b.source,sourceId:b.sourceId,name:b.lead?.manualName??null,category:null,city:null,address:null,phone:b.lead?.manualPhone??null,website:b.lead?.manualWebsite??null,rating:null,reviews:null,mapsUrl:`https://www.google.com/maps/search/?api=1&query=Business&query_place_id=${encodeURIComponent(b.sourceId)}`,latitude:null,longitude:null,businessStatus:null});
  return {...data,categoryKey:b.searchCategory as Category|null,id:b.id,noWebsiteListed:b.noWebsiteListed,createdAt:b.createdAt.toISOString(),updatedAt:b.updatedAt.toISOString(),lead:b.lead as LeadMeta|null};
}
export async function search(input:SearchInput) {
  const provider=input.mode==='demo'?demoProvider:googleProvider;
  const result= input.mode==='live'?await withLiveGuard(Math.ceil(input.limit/20),()=>provider.search(input)):await provider.search(input);
  const rows = await db.$transaction(async tx=>{
    const records=[];
    const history=await tx.search.create({data:{city:input.city,category:input.category,mode:input.mode,requested:input.limit,found:result.businesses.length,operations:result.operations}});
    for(const data of result.businesses) {
      const b=await tx.business.upsert({where:{source_sourceId:{source:data.source,sourceId:data.sourceId}},create:{source:data.source,sourceId:data.sourceId,searchCategory:input.category,data:data.source==='demo'?JSON.stringify(data):null,noWebsiteListed:data.source==='demo'&&!data.website},update:{searchCategory:input.category,data:data.source==='demo'?JSON.stringify(data):null,noWebsiteListed:data.source==='demo'&&!data.website},include:{lead:true}});
      await tx.searchBusiness.create({data:{searchId:history.id,businessId:b.id}});
      records.push(serialize(b,data));
    }
    return records;
  });
  return {leads:rows,operations:result.operations};
}
