import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  // @ts-ignore
  const db = env.DB;
  
  // Only fetch approved pins for the public map
  const { results } = await db.prepare("SELECT * FROM pins WHERE status = 'approved'").all();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
};