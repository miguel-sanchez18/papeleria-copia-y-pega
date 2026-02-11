
import { neon } from '@netlify/neon';

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

export default async (req: Request) => {
  try {
    // Attempt to select the new column
    const result = await sql`SELECT track_stock FROM products LIMIT 1`;
    return new Response(JSON.stringify({ status: "ok", data: result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", message: error.message }), { status: 500 });
  }
};

export const config = {
  path: "/api/check-schema"
};
