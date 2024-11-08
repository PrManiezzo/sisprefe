import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'database.sqlite');

let db;

async function initializeDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT,
      images TEXT,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Create test users if they don't exist
  const testUsers = [
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Employee User',
      email: 'employee@test.com',
      password: 'employee123',
      role: 'employee'
    },
    {
      name: 'Regular User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user'
    }
  ];

  for (const user of testUsers) {
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [user.email]);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.run(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [crypto.randomUUID(), user.name, user.email, hashedPassword, user.role]
      );
    }
  }

  return db;
}

export { initializeDatabase, db };