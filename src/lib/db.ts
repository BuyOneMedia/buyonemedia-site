import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Observe Server Constitution: Exact Database Quarantine Rule for Hetzner
const isLinux = process.platform === 'linux';
const isProd = process.env.NODE_ENV === 'production';

// If deployed on Hetzner Linux Server, strictly enforce the quarantine directory.
// Fallback to local ./data folder exclusively during Windows/Mac development testing.
const dbDir = (isLinux && isProd)
    ? '/var/www/buyonemedia/data'
    : path.join(process.cwd(), 'data');

const dbPath = path.join(dbDir, 'leads.db');

// Ensure directory exists without crashing
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize Database connection
const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // Enhance write-ahead logging for web concurrency

// Scaffold the leads table
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    scope TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
