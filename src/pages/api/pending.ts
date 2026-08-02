import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  // @ts-ignore
  const db = env.DB;
  
  // Fetch ONLY pins waiting for approval
  const { results } = await db.prepare("SELECT * FROM pins WHERE status = 'pending'").all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
};