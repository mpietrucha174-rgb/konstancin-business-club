import { env } from 'cloudflare:workers';
import { roomRequest } from '../../../game/rooms.mjs';
export async function POST(request: Request) {
  try { return Response.json(await roomRequest(env.DB, request)); }
  catch (e: any) { console.error('Room creation failed', e.message); return Response.json({error:e.status?e.message:'Serwer gry jest chwilowo niedostępny. Spróbuj ponownie.'},{status:e.status||503}); }
}
