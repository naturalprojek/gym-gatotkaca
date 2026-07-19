-- ============================================
-- SQL untuk Supabase SQL Editor
-- Jalankan script ini di Supabase Dashboard > SQL Editor
-- ============================================

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) DEFAULT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Albums table (for photo gallery)
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comments table (for visitor feedback)
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('puas', 'kurang puas', 'tidak puas')),
  date TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===== INSERT DEFAULT ADMIN USER =====
-- Email: gatotkaca@gmail.com
-- Password: adminmin123
-- Gunakan pgcrypto untuk generate bcrypt hash (sudah aktif di Supabase)
INSERT INTO users (name, email, password_hash, role)
SELECT 'admin', 'gatotkaca@gmail.com', crypt('adminmin123', gen_salt('bf')), 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'gatotkaca@gmail.com');
