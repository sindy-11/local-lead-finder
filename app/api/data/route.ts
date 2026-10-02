import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { failure } from '@/lib/http';
import { serialize } from '@/services/leads';
export const dynamic='force-dynamic';
export async function GET(request:Request) {
  try {
    const source=new URL(request.url).searchParams.get('mode')==='live'?'google':'demo';
    const [businesses,searches,templates]=await Promise.all([db.business.findMany({where:{source},include:{lead:true},orderBy:{updatedAt:'desc'}}),db.search.findMany({where:{mode:source==='google'?'live':'demo'},orderBy:{createdAt:'desc'},take:20}),db.template.findMany()]);
    const stats={found:businesses.length,noWebsiteListed:source==='google'?null:businesses.filter(b=>b.noWebsiteListed).length,saved:businesses.filter(b=>b.lead?.saved).length,contacted:businesses.filter(b=>b.lead&&!['NEW','TO CONTACT'].includes(b.lead.contactStatus)).length,replied:businesses.filter(b=>b.lead?.contactStatus==='REPLIED').length,interested:businesses.filter(b=>b.lead?.contactStatus==='INTERESTED').length,clients:businesses.filter(b=>b.lead?.contactStatus==='CLIENT').length};
    return NextResponse.json({leads:businesses.map(b=>serialize(b)),stats,searches,templates,configured:Boolean(process.env.GOOGLE_PLACES_API_KEY),storagePolicy:'Place IDs + manual CRM only for Google'});
  } catch(e){return failure(e);}
}
