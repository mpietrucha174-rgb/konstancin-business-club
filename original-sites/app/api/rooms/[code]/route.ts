import { env } from 'cloudflare:workers';
import { roomRequest } from '../../../../game/rooms.mjs';
async function handle(request: Request, context: {params:Promise<{code:string}>}) {
  try { const {code}=await context.params; return Response.json(await roomRequest(env.DB,request,code),{headers:{'Cache-Control':'no-store'}}); }
  catch(e:any) { if(!e.status)console.error('Room operation failed',e.message); return Response.json({error:e.status?e.message:'Serwer gry jest chwilowo niedostępny. Spróbuj ponownie.'},{status:e.status||503}); }
}
export const GET=handle;
export const POST=handle;
