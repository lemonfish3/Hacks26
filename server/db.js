/**
 * SQLite DB for StudyMate: users + sessions.
 * DB file: project root / data/studymate.db
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "..", "data");
const dbPath = path.join(dataDir, "studymate.db");

fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT,
    major TEXT,
    age INTEGER,
    gender TEXT,
    avatar_base TEXT DEFAULT 'blob',
    avatar_color TEXT DEFAULT '#B9E5FB',
    avatar_emoji TEXT,
    preference TEXT DEFAULT 'silent',
    buddy_preference TEXT DEFAULT 'any',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`);

export default db;
