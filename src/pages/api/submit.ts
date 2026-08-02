import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const data = await request.json();
  // @ts-ignore
  const db = locals.runtime.env.DB;

  // Simple proximity check for tallying (approx 50 meters)
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
    `).bind(data.lat, data.lng, data.type, data.notes).run();
    return new Response(JSON.stringify({ success: true, message: "Pin submitted for approval" }));
  }
};