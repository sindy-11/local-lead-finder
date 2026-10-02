import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { db } from '@/db/client';
import { failure } from '@/lib/http';
import { serialize } from '@/services/leads';
import { csv, spreadsheetSafe } from '@/lib/export';
import { score, websiteStatus } from '@/lib/quality';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{
  const params=new URL(request.url).searchParams;const source=params.get('mode')==='live'?'google':'demo';const ids=params.get('ids')?.split(',').filter(Boolean).slice(0,1000);
  const records=await db.business.findMany({where:{source,...(ids?{id:{in:ids}}:{})},include:{lead:true},orderBy:{createdAt:'desc'}});
  const columns=['Business','Category','Address','Phone','Website','Rating','Reviews','Maps URL','Website Status','Lead Score','Contact Status','Notes','Created At','Source','Place ID','Instagram','WhatsApp','Email','Verification Note'];
  const rows=records.map(b=>{const r=serialize(b);return [r.name,r.category,r.address,r.phone,r.website,r.rating,r.reviews,r.mapsUrl,source==='google'?(r.lead?.websiteStatus??'NEEDS VERIFICATION'):websiteStatus(r),source==='google'?null:score(r),r.lead?.contactStatus??'NEW',r.lead?.notes??'',r.createdAt,source==='demo'?'DEMO DATA':'Google Maps (IDs and manual CRM only)',r.sourceId,r.lead?.instagram,r.lead?.whatsapp,r.lead?.email,r.lead?.verificationNote];});
  if(params.get('format')==='xlsx'){
    const workbook=new ExcelJS.Workbook();const sheet=workbook.addWorksheet(source==='demo'?'DEMO DATA':'Manual CRM');sheet.addRow(columns);for(const row of rows)sheet.addRow(row.map(spreadsheetSafe));sheet.views=[{state:'frozen',ySplit:1}];sheet.autoFilter={from:'A1',to:'S1'};sheet.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};sheet.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF172C39'}};sheet.columns.forEach(c=>{c.width=24;});
    const buffer=await workbook.xlsx.writeBuffer();return new NextResponse(new Uint8Array(buffer),{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':`attachment; filename="leads-${source}.xlsx"`,'Cache-Control':'no-store'}});
  }
  return new NextResponse(csv([columns,...rows]),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="leads-${source}.csv"`,'Cache-Control':'no-store'}});
}catch(e){return failure(e);}}
