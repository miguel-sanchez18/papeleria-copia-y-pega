
import { neon } from '@netlify/neon';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

export default async (req: Request, context: any) => {
  // 1. Verify Authentication
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
  }

  // 2. Handle Requests
  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/admin', '');

    if (req.method === 'GET') {
        if (path === '/' || path === '') {
            // Dashboard Stats
            const productsCount = await sql`SELECT COUNT(*) FROM products`;
            const lowStock = await sql`SELECT * FROM products WHERE stock_quantity <= 2`;
            const recentSales = await sql`SELECT * FROM sales ORDER BY created_at DESC LIMIT 5`;
            
            // Sales Today
            const salesToday = await sql`
                SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count 
                FROM sales 
                WHERE created_at >= CURRENT_DATE
            `;

            // Sales Month
            const salesMonth = await sql`
                SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count 
                FROM sales 
                WHERE created_at >= date_trunc('month', CURRENT_DATE)
            `;

            return new Response(JSON.stringify({
                productsCount: productsCount[0].count,
                lowStock,
                recentSales,
                salesToday: salesToday[0],
                salesMonth: salesMonth[0]
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (path === '/products') {
            const products = await sql`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.name ASC
            `;
            return new Response(JSON.stringify(products), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if (path === '/categories') {
            const categories = await sql`SELECT * FROM categories ORDER BY name`;
            return new Response(JSON.stringify(categories), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if (path === '/users') {
             const token = authHeader.split(" ")[1];
             const decoded = jwt.verify(token, JWT_SECRET) as any;
             
             if (decoded.role !== 'master') {
                  return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
             }

             const users = await sql`SELECT id, username, role, full_name, email, is_active, created_at FROM users ORDER BY created_at DESC`;
             return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // GET /sales (History)
        if (path === '/sales') {
            const url = new URL(req.url);
            const startDate = url.searchParams.get('startDate'); // YYYY-MM-DD
            const endDate = url.searchParams.get('endDate');     // YYYY-MM-DD
            
            let query = sql`SELECT s.*, u.username FROM sales s LEFT JOIN users u ON s.user_id = u.id`;
            
            if (startDate && endDate) {
                query = sql`
                    SELECT s.*, u.username 
                    FROM sales s 
                    LEFT JOIN users u ON s.user_id = u.id 
                    WHERE s.created_at BETWEEN ${startDate}::timestamp AND ${endDate}::timestamp + interval '1 day'
                    ORDER BY s.created_at DESC
                `;
            } else {
                query = sql`
                    SELECT s.*, u.username 
                    FROM sales s 
                    LEFT JOIN users u ON s.user_id = u.id 
                    ORDER BY s.created_at DESC
                    LIMIT 100
                `;
            }

            const sales = await query;
            return new Response(JSON.stringify(sales), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // GET /sales/:id (Detail)
        const saleMatch = path.match(/\/sales\/(\d+)/);
        if (saleMatch) {
            const id = saleMatch[1];
            const sale = await sql`SELECT s.*, u.username FROM sales s LEFT JOIN users u ON s.user_id = u.id WHERE s.id = ${id}`;
            const items = await sql`
                SELECT si.*, p.name as product_name 
                FROM sale_items si 
                LEFT JOIN products p ON si.product_id = p.id 
                WHERE si.sale_id = ${id}
            `;
            
            if (sale.length === 0) return new Response(JSON.stringify({ error: "Sale not found" }), { status: 404 });

            return new Response(JSON.stringify({ ...sale[0], items }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
    }

    if (req.method === 'POST') {
        // Create Product
        if (path === '/products') {
            const { name, price, stock_quantity, category_id, image_url, track_stock } = await req.json();
            const trackStockValue = track_stock !== undefined ? track_stock : true;

            await sql`
                INSERT INTO products (name, price, stock_quantity, category_id, image_url, track_stock)
                VALUES (${name}, ${price}, ${stock_quantity}, ${category_id}, ${image_url}, ${trackStockValue})
            `;
            return new Response(JSON.stringify({ message: "Product created" }), { status: 201, headers: { "Content-Type": "application/json" } });
        }

        // Create Category
        if (path === '/categories') {
            const { name, icon, description } = await req.json();
            const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''); // Simple slug generation
            await sql`
                INSERT INTO categories (name, slug, icon, description)
                VALUES (${name}, ${slug}, ${icon}, ${description})
            `;
            return new Response(JSON.stringify({ message: "Category created" }), { status: 201 });
        }

        // Create Sale (POS)
        if (path === '/sales') {
            const { total, payment_method, items } = await req.json(); // items: [{ product_id, quantity, unit_price, subtotal }]
            
            // Get User ID from Token
            const token = authHeader.split(" ")[1];
            let userId = null;
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                userId = decoded.id;
            } catch (e) {
                console.warn("Could not extract user from token for sale record");
            }

            // 1. Create Sale Record
            const sale = await sql`
                INSERT INTO sales (total, payment_method, user_id)
                VALUES (${total}, ${payment_method || 'cash'}, ${userId})
                RETURNING id
            `;
            const saleId = sale[0].id;

            // 2. Add Items and Update Stock (if tracked)
            for (const item of items) {
                // Add to Sale Items
                await sql`
                    INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
                    VALUES (${sale[0].id}, ${item.product_id}, ${item.quantity}, ${item.unit_price}, ${item.subtotal})
                `;

                // Update Stock (Only if track_stock is true)
                await sql`
                    UPDATE products 
                    SET stock_quantity = stock_quantity - ${item.quantity}
                    WHERE id = ${item.product_id} AND track_stock = true
                `;
            }

            return new Response(JSON.stringify({ message: "Sale registered", saleId }), { status: 201 });
        }

        // Create User (Master Only)
        if (path === '/users') {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            
            if (decoded.role !== 'master') {
                 return new Response(JSON.stringify({ error: "Forbidden: Master access required" }), { status: 403 });
            }

            const { username, password, role: newRole, full_name, email } = await req.json();
             // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await sql`
                INSERT INTO users (username, password_hash, role, full_name, email, is_active)
                VALUES (${username}, ${hashedPassword}, ${newRole || 'admin'}, ${full_name}, ${email}, true)
            `;
            return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
        }
    }

    if (req.method === 'DELETE') {
        // Delete Product
        const productMatch = path.match(/\/products\/(\d+)/);
        if (productMatch) {
            const id = productMatch[1];
            await sql`DELETE FROM products WHERE id = ${id}`;
            return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });
        }

        // Delete Category
        const categoryMatch = path.match(/\/categories\/(\d+)/);
        if (categoryMatch) {
            const id = categoryMatch[1];
            await sql`DELETE FROM categories WHERE id = ${id}`;
            return new Response(JSON.stringify({ message: "Category deleted" }), { status: 200 });
        }
    }

    if (req.method === 'PUT') {
        // Update Product
        const productMatch = path.match(/\/products\/(\d+)/);
        if (productMatch) {
            const id = productMatch[1];
            const updates = await req.json();
            
            if (updates.stock_quantity !== undefined) {
                 await sql`UPDATE products SET stock_quantity = ${updates.stock_quantity} WHERE id = ${id}`;
            }
            if (updates.price !== undefined) {
                 await sql`UPDATE products SET price = ${updates.price} WHERE id = ${id}`;
            }
            if (updates.name !== undefined) await sql`UPDATE products SET name = ${updates.name} WHERE id = ${id}`;
            if (updates.description !== undefined) await sql`UPDATE products SET description = ${updates.description} WHERE id = ${id}`;
            if (updates.image_url !== undefined) await sql`UPDATE products SET image_url = ${updates.image_url} WHERE id = ${id}`;
            if (updates.category_id !== undefined) await sql`UPDATE products SET category_id = ${updates.category_id} WHERE id = ${id}`;
            if (updates.track_stock !== undefined) await sql`UPDATE products SET track_stock = ${updates.track_stock} WHERE id = ${id}`;

            return new Response(JSON.stringify({ message: "Product updated" }), { status: 200 });
        }

        // Update Category
        const categoryMatch = path.match(/\/categories\/(\d+)/);
        if (categoryMatch) {
            const id = categoryMatch[1];
            const updates = await req.json();

            if (updates.name !== undefined) {
                const slug = updates.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                await sql`UPDATE categories SET name = ${updates.name}, slug = ${slug} WHERE id = ${id}`;
            }
            if (updates.icon !== undefined) await sql`UPDATE categories SET icon = ${updates.icon} WHERE id = ${id}`;
            if (updates.description !== undefined) await sql`UPDATE categories SET description = ${updates.description} WHERE id = ${id}`;
 
            return new Response(JSON.stringify({ message: "Category updated" }), { status: 200 });
        }

            // Update User (Toggle Active / Update Role / Update Profile)
            const userMatch = path.match(/\/users\/(\d+)/);
            if (userMatch) {
                const id = parseInt(userMatch[1]);
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                
                // Allow if master OR if user is updating their own profile
                if (decoded.role !== 'master' && decoded.id !== id) {
                     return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
                }

                const updates = await req.json();

                // Master-only fields
                if (decoded.role === 'master') {
                    if (updates.is_active !== undefined) await sql`UPDATE users SET is_active = ${updates.is_active} WHERE id = ${id}`;
                    if (updates.role !== undefined) await sql`UPDATE users SET role = ${updates.role} WHERE id = ${id}`;
                }

                // Profile fields (Self or Master)
                if (updates.full_name !== undefined) await sql`UPDATE users SET full_name = ${updates.full_name} WHERE id = ${id}`;
                if (updates.email !== undefined) await sql`UPDATE users SET email = ${updates.email} WHERE id = ${id}`;
                if (updates.profile_image !== undefined) await sql`UPDATE users SET profile_image = ${updates.profile_image} WHERE id = ${id}`;
                
                // Password Change
                if (updates.new_password) {
                    // 1. Verify current password (if not master)
                    if (decoded.role !== 'master' || (decoded.role === 'master' && decoded.id === id)) {
                         if (!updates.current_password) {
                             return new Response(JSON.stringify({ error: "Current password required" }), { status: 400 });
                         }
                         const user = await sql`SELECT password_hash FROM users WHERE id = ${id}`;
                         const valid = await bcrypt.compare(updates.current_password, user[0].password_hash);
                         if (!valid) {
                             return new Response(JSON.stringify({ error: "Incorrect current password" }), { status: 400 });
                         }
                    }

                    // 2. Update to new password
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(updates.new_password, salt);
                    await sql`UPDATE users SET password_hash = ${hashedPassword} WHERE id = ${id}`;
                }

                return new Response(JSON.stringify({ message: "User updated" }), { status: 200 });
            }
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (error) {
    console.error("Admin API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};

export const config = {
  path: "/api/admin/*"
};
