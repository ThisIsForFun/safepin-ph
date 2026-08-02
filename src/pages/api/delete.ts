import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    // @ts-ignore
    const db = env.DB;
    
    await db.prepare("DELETE FROM pins WHERE id = ?").bind(data.id).run();
    
    return new Response(JSON.stringify({ success: true }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};