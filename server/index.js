/**
 * StudyMate API: email verification (Gmail SMTP or Resend), SQLite DB, sessions, matching.
 * Run: npm run server (or node server/index.js)
 * For sending to any .edu: set GMAIL_USER and GMAIL_APP_PASSWORD in .env (no domain required).
 */

import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import cors from "cors";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

const GMAIL_USER = process.env.GMAIL_USER?.trim();
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.trim();
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const FROM_EMAIL_RESEND = process.env.FROM_EMAIL?.trim() || "StudyMate <onboarding@resend.dev>";

const useGmail = !!(GMAIL_USER && GMAIL_APP_PASSWORD);
const useResend = !!RESEND_API_KEY && !useGmail;

let gmailTransporter = null;
if (useGmail) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}
const resend = useResend ? new Resend(RESEND_API_KEY) : null;

const SESSION_DAYS = 30;
const codes = new Map();
const CODE_TTL_MS = 10 * 60 * 1000;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function isValidSchoolEmail(email) {
  if (!email || typeof email !== "string") return false;
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  return e.endsWith(".edu") || e.endsWith(".ac.uk") || e.endsWith(".edu.au");
}

/** Send verification email. Uses Gmail if configured (sends to any .edu); otherwise Resend. Returns null on success, error string on failure. */
async function sendVerificationEmail(to, code) {
  const subject = "Your StudyMate verification code";
  const html = `
    <p>Your verification code is:</p>
    <p style="font-size:24px; font-weight:bold; letter-spacing:4px;">${code}</p>
    <p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    <p>— StudyMate</p>
  `;
  if (useGmail && gmailTransporter) {
    try {
      await gmailTransporter.sendMail({
        from: `StudyMate <${GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      return null;
    } catch (err) {
      return err?.message || String(err) || "Failed to send email.";
    }
  }
  if (useResend && resend) {
    const from = FROM_EMAIL_RESEND.toLowerCase().includes("example.com") ? "StudyMate <onboarding@resend.dev>" : FROM_EMAIL_RESEND;
    const { error } = await resend.emails.send({ from, to: [to], subject, html });
    if (error) {
      const raw = error?.message || (typeof error === "string" ? error : "");
      if (/only send testing emails to your own email|verify a domain at resend\.com\/domains/i.test(raw)) {
        return "Resend's free tier only allows sending to the account owner. To send to any .edu, set GMAIL_USER and GMAIL_APP_PASSWORD in .env (see README).";
      }
      return raw || "Failed to send the code.";
    }
    return null;
  }
  return "Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env to send verification codes to any .edu (no domain required). See README.";
}

/** Convert DB user row to API shape (camelCase + nested avatar). Use uid when present (session join) so id is the user id, not session id. */
function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.uid ?? row.id,
    email: row.email,
    nickname: row.nickname || "",
    major: row.major || "",
    age: row.age ?? 20,
    gender: row.gender || "prefer_not_to_say",
    avatar: {
      base: row.avatar_base || "blob",
      color: row.avatar_color || "#B9E5FB",
      emoji: row.avatar_emoji || undefined,
      head: row.avatar_head || "head1",
      clothes: row.avatar_clothes || "clothes1",
    },
    preference: row.preference || "silent",
    buddyPreference: row.buddy_preference || "any",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Auth middleware: set req.user from Bearer token or 401 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  const session = db.prepare(
    "SELECT s.id, s.user_id, u.id as uid, u.email, u.nickname, u.major, u.age, u.gender, u.avatar_base, u.avatar_color, u.avatar_emoji, u.avatar_head, u.avatar_clothes, u.preference, u.buddy_preference, u.created_at, u.updated_at FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')"
  ).get(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid." });
  }
  req.user = rowToUser(session);
  next();
}

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "StudyMate API. Sign up / log in via email code; use GET /api/me with Bearer token when logged in.",
    endpoints: [
      "POST /api/send-code",
      "POST /api/verify-code",
      "GET /api/me",
      "PUT /api/me",
      "POST /api/logout",
      "GET /api/match",
    ],
  });
});

app.post("/api/send-code", async (req, res) => {
  const email = req.body?.email?.trim?.();
  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!isValidSchoolEmail(email)) {
    return res.status(400).json({
      error: "Please use your college or university email (e.g. name@school.edu).",
    });
  }

  const code = generateCode();
  codes.set(email.toLowerCase(), { code, expiresAt: Date.now() + CODE_TTL_MS });

  const sendError = await sendVerificationEmail(email, code);
  if (sendError) return res.status(500).json({ error: sendError });
  res.json({ ok: true });
});

app.post("/api/verify-code", (req, res) => {
  const email = (req.body?.email?.trim?.() || "").toLowerCase();
  const code = req.body?.code?.trim?.().replace(/\D/g, "").slice(0, 6);

  if (!email || !code || code.length !== 6) {
    return res.status(400).json({ error: "Email and 6-digit code are required." });
  }

  const stored = codes.get(email);
  if (!stored) return res.status(400).json({ error: "Invalid or expired code. Request a new one." });
  if (Date.now() > stored.expiresAt) {
    codes.delete(email);
    return res.status(400).json({ error: "Code expired. Request a new one." });
  }
  if (stored.code !== code) return res.status(400).json({ error: "Invalid code." });
  codes.delete(email);

  let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    db.prepare(
      "INSERT INTO users (email, nickname, major, age, gender, preference, buddy_preference) VALUES (?, '', '', 20, 'prefer_not_to_say', 'silent', 'any')"
    ).run(email);
    user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  db.prepare(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)"
  ).run(user.id, token, expiresAt.toISOString());

  res.json({ token, user: rowToUser(user) });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.put("/api/me", requireAuth, (req, res) => {
  const u = req.user;
  const body = req.body || {};
  const nickname = (body.nickname ?? u.nickname ?? "").toString().trim();
  const major = (body.major ?? u.major ?? "").toString().trim();
  const age = parseInt(body.age, 10);
  const gender = (body.gender ?? u.gender ?? "prefer_not_to_say").toString();
  const avatar = body.avatar || u.avatar || {};
  const preference = (body.preference ?? u.preference ?? "silent").toString();
  const buddyPreference = (body.buddyPreference ?? u.buddyPreference ?? "any").toString();
  const avatarHead = (avatar.head ?? u.avatar?.head ?? "head1").toString();
  const avatarClothes = (avatar.clothes ?? u.avatar?.clothes ?? "clothes1").toString();

  db.prepare(
    `UPDATE users SET nickname = ?, major = ?, age = ?, gender = ?, avatar_base = ?, avatar_color = ?, avatar_emoji = ?, avatar_head = ?, avatar_clothes = ?, preference = ?, buddy_preference = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(
    nickname,
    major,
    Number.isNaN(age) ? 20 : age,
    gender,
    avatar.base || "blob",
    avatar.color || "#B9E5FB",
    avatar.emoji || null,
    avatarHead,
    avatarClothes,
    preference,
    buddyPreference,
    u.id
  );
  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(u.id);
  if (!updated) {
    return res.status(500).json({ error: "Failed to load updated profile." });
  }
  res.json({ user: rowToUser(updated) });
});

app.post("/api/logout", requireAuth, (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  res.json({ ok: true });
});

/** Match users by preference and buddy preference (excludes self). */
app.get("/api/match", requireAuth, (req, res) => {
  const me = req.user;
  const preference = (req.query.preference ?? me.preference ?? "silent").toString();
  const buddyPreference = (req.query.buddyPreference ?? me.buddyPreference ?? "any").toString();

  let sql = `
    SELECT id, email, nickname, major, age, gender, avatar_base, avatar_color, avatar_emoji, avatar_head, avatar_clothes, preference, buddy_preference, created_at, updated_at
    FROM users WHERE id != ? AND nickname IS NOT NULL AND nickname != ''
  `;
  const params = [me.id];

  if (buddyPreference !== "any") {
    sql += " AND (buddy_preference = ? OR buddy_preference = 'any')";
    params.push(buddyPreference);
  }
  sql += " ORDER BY updated_at DESC LIMIT 50";

  const rows = db.prepare(sql).all(...params);
  const users = rows.map((row) => rowToUser(row));
  res.json({ users });
});

// --- Rooms (in-memory) for join-by-code and real-time sync ---
const rooms = new Map(); // id -> { id, inviteCode, name, hostNickname, members: [{ nickname, avatar }], duration, maxMembers }
const roomByCode = new Map(); // inviteCode -> room

function generateInviteCode() {
  return "CLD-" + String(Math.floor(1000 + Math.random() * 9000));
}

app.post("/api/rooms", (req, res) => {
  const body = req.body || {};
  const name = (body.name || "Study Room").toString().trim();
  const hostNickname = (body.hostNickname || "Host").toString().trim();
  const duration = Math.min(60, Math.max(5, parseInt(body.duration, 10) || 25));
  const id = crypto.randomBytes(8).toString("hex");
  let inviteCode = (body.inviteCode || generateInviteCode()).toString().toUpperCase();
  while (roomByCode.has(inviteCode)) inviteCode = generateInviteCode();
  const room = {
    id,
    inviteCode,
    name,
    hostNickname,
    members: [],
    duration,
    maxMembers: 5,
  };
  rooms.set(id, room);
  roomByCode.set(inviteCode, room);
  res.status(201).json({ room: { ...room, timeLeft: duration, hostNickname: room.hostNickname } });
});

app.get("/api/rooms/by-code/:code", (req, res) => {
  const code = (req.params.code || "").toString().toUpperCase().replace(/\s/g, "");
  const room = roomByCode.get(code);
  if (!room) return res.status(404).json({ error: "Room not found. Check the code and try again." });
  res.json({ room: { ...room, timeLeft: room.duration, hostNickname: room.hostNickname } });
});

app.post("/api/rooms/:id/join", (req, res) => {
  const id = req.params.id;
  const room = rooms.get(id);
  if (!room) return res.status(404).json({ error: "Room not found." });
  const body = req.body || {};
  const nickname = (body.nickname || "Anonymous").toString().trim();
  const avatar = body.avatar || { base: "animal", color: "#B9E5FB", head: "head1", clothes: "clothes1" };
  if (room.members.length >= room.maxMembers) return res.status(400).json({ error: "Room is full." });
  const member = { nickname, avatar };
  room.members.push(member);
  res.json({ room: { ...room, timeLeft: room.duration, hostNickname: room.hostNickname }, member });
});

// --- WebSocket: room channels for Pomodoro timer + WebRTC signaling ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const wsRoomClients = new Map(); // roomId -> Set of { ws, nickname }

wss.on("connection", (ws, req) => {
  let roomId = null;
  let nickname = "?";
  const url = req.url || "";
  const params = new URLSearchParams(url.startsWith("/") ? url.slice(1) : url.split("?")[1] || "");
  roomId = params.get("roomId");
  nickname = params.get("nickname") || "Anonymous";

  if (!roomId) {
    ws.close(1008, "roomId required");
    return;
  }
  if (!wsRoomClients.has(roomId)) wsRoomClients.set(roomId, new Set());
  const clients = wsRoomClients.get(roomId);
  const ref = { ws, nickname };
  clients.add(ref);
  // Tell new joiner who else is in the room (for WebRTC)
  const others = [...clients].filter((c) => c.ws !== ws).map((c) => c.nickname);
  ws.send(JSON.stringify({ type: "members", members: others }));
  // Tell others that this user joined
  clients.forEach((c) => {
    if (c.ws !== ws && c.ws.readyState === 1) {
      c.ws.send(JSON.stringify({ type: "member_joined", nickname }));
    }
  });
  ws.on("close", () => {
    clients.delete(ref);
    if (clients.size === 0) wsRoomClients.delete(roomId);
  });
  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      msg.from = nickname;
      clients.forEach((c) => {
        if (c.ws !== ws && c.ws.readyState === 1) c.ws.send(JSON.stringify(msg));
      });
    } catch (_) {}
  });
});

server.listen(PORT, () => {
  console.log(`StudyMate API running at http://localhost:${PORT}`);
  console.log("WebSocket: connect with ?roomId=...&nickname=...");
  if (useGmail) console.log("Email: Gmail SMTP (sends to any .edu).");
  else if (useResend) console.warn("Email: Resend (free tier may only send to account owner). For any .edu, set GMAIL_USER and GMAIL_APP_PASSWORD in .env.");
  else console.warn("Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env to send to any .edu (no domain required).");
});
