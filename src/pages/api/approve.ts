import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    // @ts-ignore
    const db = env.DB;
    
    // Change the status from pending to approved
    await db.prepare("UPDATE pins SET status = 'approved' WHERE id = ?").bind(data.id).run();
    
    return new Response(JSON.stringify({ success: true }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};