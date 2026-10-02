import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
export class AppError extends Error { constructor(message:string, public status=400) { super(message); } }
export function failure(error:unknown) {
  if(error instanceof AppError) return NextResponse.json({error:error.message},{status:error.status});
  if(error instanceof ZodError) return NextResponse.json({error:error.issues[0]?.message??'Проверьте заполненные поля.'},{status:400});
  return NextResponse.json({error:'Не удалось выполнить операцию. Проверьте подключение и SQLite database; подробности в README.'},{status:500});
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  // Next may normalize request.url to localhost even when the browser uses 127.0.0.1.
  if(!origin || !host || new URL(origin).host !== host || new URL(origin).protocol !== new URL(request.url).protocol) throw new AppError('Запрос с другого сайта запрещён.',403);
}
const guards = globalThis as unknown as { leadGuard?: {busy:boolean;requests:number[];operations:number;day:string} };
const guard = guards.leadGuard ??= {busy:false,requests:[],operations:0,day:new Date().toISOString().slice(0,10)};
export async function withLiveGuard<T>(estimated:number, work:()=>Promise<T>) {
  const now=Date.now(); const day=new Date().toISOString().slice(0,10);
  if(guard.day!==day){guard.day=day;guard.operations=0;}
  guard.requests=guard.requests.filter(t=>t>now-60000);
  if(guard.busy) throw new AppError('Другой LIVE-запрос ещё выполняется. Подождите.',429);
  if(guard.requests.length>=5 || guard.operations+estimated>100) throw new AppError('Защитный лимит: 5 поисков/минуту и 100 API-операций/день на процесс. Проверьте квоты Google.',429);
  guard.busy=true;guard.requests.push(now);guard.operations+=estimated;
  try {return await work();} finally {guard.busy=false;}
}
