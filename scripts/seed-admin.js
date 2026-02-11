
import { neon } from '@netlify/neon';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const sql = neon(process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL);

async function seedAdmin() {
  try {
    console.log("Seeding Admin User...");
    const username = 'jmiguel.sanchez.1190@gmail.com';
    const password = '$anchez18M';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    await sql`
      INSERT INTO users (username, password_hash, role)
      VALUES (${username}, ${hashedPassword}, 'admin')
      ON CONFLICT (username) DO UPDATE 
      SET password_hash = ${hashedPassword};
    `;

    console.log(`Admin user '${username}' seeded successfully.`);
  } catch (e) {
    console.error("Error seeding admin:", e);
  }
}

seedAdmin();
