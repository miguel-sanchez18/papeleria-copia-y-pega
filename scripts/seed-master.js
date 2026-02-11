
import { neon } from '@netlify/neon';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Load environment variables manually
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

async function seedMaster() {
  try {
    console.log("Seeding Master User...");
    
    // 1. Ensure Table Exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Create Master User
    const username = 'master';
    const password = 'masterpassword123'; // Change this if needed
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await sql`
      INSERT INTO users (username, password_hash, role)
      VALUES (${username}, ${hash}, 'master')
      ON CONFLICT (username) 
      DO UPDATE SET password_hash = ${hash}, role = 'master'
    `;

    console.log(`Master user '${username}' seeded/updated successfully.`);
    console.log(`Initial Password: ${password}`);

  } catch (e) {
    console.error("Error seeding master:", e);
  }
}

seedMaster();
