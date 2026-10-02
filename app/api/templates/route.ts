import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { failure, sameOrigin } from '@/lib/http';
import { templateSchema } from '@/lib/validation';
export async function PUT(request:Request){try{sameOrigin(request);const data=templateSchema.parse(await request.json());await db.template.upsert({where:{category:data.category},create:data,update:{url:data.url}});return NextResponse.json({ok:true});}catch(e){return failure(e);}}
