import { neon } from '@netlify/neon';

export default async (req: Request, context: any) => {
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    const rows = await sql`SELECT * FROM categories`;

    return new Response(JSON.stringify(rows), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/categories"
};
