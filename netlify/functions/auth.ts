
import { neon } from '@netlify/neon';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

export default async (req: Request, context: any) => {
  if (req.method !== 'POST') {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const users = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!user.is_active) {
        return new Response(JSON.stringify({ error: "Account disabled. Contact Master Admin." }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return new Response(JSON.stringify({ 
        token, 
        user: { 
            id: user.id, 
            username: user.username, 
            role: user.role,
            full_name: user.full_name,
            email: user.email,
            profile_image: user.profile_image 
        } 
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/auth/login"
};
