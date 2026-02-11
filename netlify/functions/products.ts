import { neon } from '@netlify/neon';

export default async (req: Request, context: any) => {
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
    
    // Si se pasa ?featured=true, filtra solo los destacados
    const url = new URL(req.url);
    const featured = url.searchParams.get('featured') === 'true';

    let rows;
    if (featured) {
      rows = await sql`
        SELECT p.*, c.name as category 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_featured = TRUE
      `;
    } else {
      rows = await sql`
        SELECT p.*, c.name as category 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
      `;
    }

    // Convert numeric strings (like price) to actual numbers
    const formattedRows = rows.map((row: any) => ({
      ...row,
      price: Number(row.price)
    }));    

    return new Response(JSON.stringify(formattedRows), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Allow CORS for dev
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Database Connection Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/products"
};
