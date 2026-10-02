import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { AppError, failure, sameOrigin } from '@/lib/http';
import { leadSchema } from '@/lib/validation';
import { serialize } from '@/services/leads';
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}) {
  try {
    sameOrigin(request);const {id}=await context.params;const data=leadSchema.parse(await request.json());
    const business=await db.business.findUnique({where:{id},include:{lead:true}});if(!business)throw new AppError('Лид не найден.',404);
    const effectiveStatus=data.websiteStatus===undefined?business.lead?.websiteStatus:data.websiteStatus;
    if(effectiveStatus==='VERIFIED NO OFFICIAL WEBSITE' && !(data.verificationNote??business.lead?.verificationNote)?.trim()) throw new AppError('Добавьте основание ручной проверки перед подтверждением отсутствия сайта.');
    const lead=await db.savedLead.upsert({where:{businessId:id},create:{businessId:id,...data},update:data});
    return NextResponse.json({business:serialize({...business,lead})});
  } catch(e){return failure(e);}
}
