import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // @ts-ignore
    const db = env.DB;

    // Check if the database is actually missing
    if (!db) {
        return new Response(JSON.stringify({ error: "DB binding is missing from the live server." }), { status: 500 });
    }

    const existingPin = await db.prepare(`
      SELECT id, tally FROM pins 
      WHERE type = ? AND abs(latitude - ?) < 0.0005 AND abs(longitude - ?) < 0.0005
    `).bind(data.type, data.lat, data.lng).first();

    if (existingPin) {
      await db.prepare("UPDATE pins SET tally = tally + 1 WHERE id = ?").bind(existingPin.id).run();
      return new Response(JSON.stringify({ success: true, message: "Tally updated" }));
    } else {
      await db.prepare(`
        INSERT INTO pins (latitude, longitude, type, notes)
        VALUES (?, ?, ?, ?)
      `).bind(data.lat, data.lng, data.type, data.notes || '').run();
      return new Response(JSON.stringify({ success: true, message: "Pin submitted for approval" }));
    }
  } catch (e: any) {
    // If anything breaks, send the exact error message to the frontend
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};