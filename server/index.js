import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const PORT = process.env.PORT || 4000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "verysecretkey";

const app = express();

// ===== HELPER: Normalize nomor HP ke format +62 =====
function normalizePhone(phone) {
  if (!phone) return null;
  // Hapus semua karakter non-digit
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return null;
  // Jika diawali 0, ganti dengan 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  // Jika diawali angka biasa (misal 812345678), tambah 62
  else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return '+' + cleaned;
}

// CORS - Allow frontend from specific origin
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));

// Supabase client with service_role key (bypasses RLS for backend)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureTables() {
  // Test koneksi ke Supabase — tabel sudah dibuat via SQL Editor
  const { error } = await supabase.from("users").select("id").limit(1);
  if (error) {
    console.log("Pastikan tabel sudah dibuat di Supabase SQL Editor (lihat server/db.sql)");
    throw error;
  }
  console.log("Terhubung ke Supabase! Tabel sudah siap.");
}

// ===== ALBUMS =====

app.get("/api/albums", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data album." });
  }
});

app.post("/api/albums", async (req, res) => {
  try {
    const { url, title } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL foto wajib diisi." });
    }
    const { data, error } = await supabase
      .from("albums")
      .insert({ url, title: title || null })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan album." });
  }
});

app.put("/api/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { url, title } = req.body;
    if (!url) {
      return res.status(400).json({ message: "URL foto wajib diisi." });
    }
    const { error } = await supabase
      .from("albums")
      .update({ url, title: title || null })
      .eq("id", id);
    if (error) throw error;

    const { data, error: fetchError } = await supabase
      .from("albums")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!data) {
      return res.status(404).json({ message: "Album tidak ditemukan." });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui album." });
  }
});

app.delete("/api/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("albums").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus album." });
  }
});

// ===== COMMENTS =====

app.get("/api/comments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil komentar." });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const { email, text, sentiment } = req.body;
    if (!email || !text || !sentiment) {
      return res.status(400).json({ message: "Email, komentar, dan kepuasan wajib diisi." });
    }
    const { data, error } = await supabase
      .from("comments")
      .insert({ email, text, sentiment, date: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menyimpan komentar." });
  }
});

app.delete("/api/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    if (!numId) {
      return res.status(400).json({ message: "ID komentar tidak valid." });
    }

    console.log(`Attempting to delete comment with id: ${numId}`);

    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", numId)
      .select();

    if (error) throw error;

    console.log(`Delete result:`, data);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Komentar tidak ditemukan." });
    }

    res.json({ success: true, message: "Komentar berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Gagal menghapus komentar.", error: error.message });
  }
});

// ===== AUTH =====

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Semua field wajib diisi." });

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);
    if (existing && existing.length > 0)
      return res.status(400).json({ message: "Email sudah terdaftar." });

    // Normalisasi nomor HP ke format +62
    const normalizedPhone = normalizePhone(phone);

    // Cek apakah nomor HP sudah terdaftar (jika diisi)
    if (normalizedPhone) {
      const { data: existingPhone } = await supabase
        .from("users")
        .select("id")
        .eq("phone", normalizedPhone)
        .limit(1);
      if (existingPhone && existingPhone.length > 0)
        return res.status(400).json({ message: "Nomor HP sudah terdaftar." });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const insertData = { name, email, password_hash: hash, role: userRole };
    if (normalizedPhone) insertData.phone = normalizedPhone;

    const { data, error } = await supabase
      .from("users")
      .insert(insertData)
      .select("*")
      .single();
    if (error) throw error;

    // Hapus field sensitif sebelum dikirim ke frontend
    const user = data;
    delete user.password_hash;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mendaftar user." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: "Email/nomor HP dan password wajib diisi." });

    // Deteksi apakah identifier adalah email atau nomor HP
    const isEmail = identifier.includes("@");
    
    let query = supabase.from("users").select("*");
    if (isEmail) {
      query = query.eq("email", identifier);
    } else {
      // Normalisasi nomor HP sebelum mencari di database
      const normalizedPhone = normalizePhone(identifier);
      query = query.eq("phone", normalizedPhone);
    }
    
    const { data: users, error } = await query.limit(1);
    if (error) throw error;

    if (!users || users.length === 0)
      return res.status(400).json({ message: "Email/nomor HP atau password salah." });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ message: "Email/nomor HP atau password salah." });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
    };
    res.json({ user: safeUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melakukan login." });
  }
});

// ===== USER MANAGEMENT =====

app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Hapus password_hash dari response
    const safeData = (data || []).map(({ password_hash, ...rest }) => rest);
    res.json(safeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user." });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus user." });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, email, password, phone } = req.body;

    console.log(`[PUT /api/users/${id}] Received:`, { name, email, phone, password: password ? "***" : "not provided", role });

    const updateData = {};

    if (email) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", id)
        .limit(1);
      if (existing && existing.length > 0) {
        console.log(`[PUT /api/users/${id}] Email duplikasi:`, email);
        return res.status(400).json({ message: "Email sudah digunakan oleh user lain." });
      }
      updateData.email = email;
    }

    // Cek duplikasi nomor HP (jika diisi)
    if (phone !== undefined) {
      if (phone) {
        const normalizedPhone = normalizePhone(phone);
        const { data: existingPhone } = await supabase
          .from("users")
          .select("id")
          .eq("phone", normalizedPhone)
          .neq("id", id)
          .limit(1);
        if (existingPhone && existingPhone.length > 0) {
          return res.status(400).json({ message: "Nomor HP sudah digunakan oleh user lain." });
        }
        updateData.phone = normalizedPhone;
      } else {
        // Nomor HP dikosongkan → set ke null
        updateData.phone = null;
      }
    }

    if (name) updateData.name = name;
    if (password) updateData.password_hash = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Tidak ada data untuk diubah." });
    }

    console.log(`[PUT /api/users/${id}] Update data:`, { ...updateData, password_hash: updateData.password_hash ? "***" : undefined });

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select("*");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const { password_hash, ...safeUser } = data[0];
    res.json(safeUser);
  } catch (error) {
    console.error(`[PUT /api/users/${id}] Error:`, error);
    res.status(500).json({ message: "Gagal mengubah user.", error: error.message });
  }
});

// ===== SEED DEFAULT ADMIN =====

async function ensureAdminUser() {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", "gatotkaca@gmail.com")
    .limit(1);

  if (!existing || existing.length === 0) {
    const hash = await bcrypt.hash("adminmin123", 10);
    const { error } = await supabase.from("users").insert({
      name: "admin",
      email: "gatotkaca@gmail.com",
      password_hash: hash,
      role: "admin",
    });
    if (error) {
      console.error("Gagal membuat admin default:", error);
    } else {
      console.log("Admin default dibuat: gatotkaca@gmail.com / adminmin123");
    }
  }
}

// ===== START SERVER =====

async function start() {
  try {
    await ensureTables();
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server API berjalan di http://localhost:${PORT}`);
      console.log(`Mode: Supabase (${SUPABASE_URL})`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error);
    process.exit(1);
  }
}

start();
