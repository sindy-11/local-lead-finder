import { NextResponse } from 'next/server';
import { failure, sameOrigin } from '@/lib/http';
import { searchSchema } from '@/lib/validation';
import { search } from '@/services/leads';
export const runtime='nodejs';
export async function POST(request:Request) { try {sameOrigin(request);return NextResponse.json(await search(searchSchema.parse(await request.json())));} catch(e){return failure(e);} }
