-- Cloudflare D1 Database Schema for NOVA_AI
-- Run with: npx wrangler d1 execute novaai-db --file=./src/worker/schema.sql

CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  team_size TEXT NOT NULL,
  project_scope TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS demo_logs (
  id TEXT PRIMARY KEY,
  pipeline TEXT NOT NULL,
  prompt TEXT NOT NULL,
  output TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
