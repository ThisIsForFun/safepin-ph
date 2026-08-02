import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // @ts-ignore
  const db = locals.runtime.env.DB;

  // Only fetch approved pins for the public map
  const { results } = await db.prepare("SELECT * FROM pins WHERE status = 'approved'").all();

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
};