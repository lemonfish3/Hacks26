/**
 * StudyMate verification API: send and verify 6-digit codes via Resend.
 * Run: npm run server (or node server/index.js)
 * Requires: RESEND_API_KEY in .env (and optional FROM_EMAIL)
 */

import "dotenv/config";
import express from "express";
import { Resend } from "resend";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "StudyMate <onboarding@resend.dev>";

// In-memory store: email -> { code, expiresAt }. Use Redis/DB in production.
const codes = new Map();
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isValidSchoolEmail(email) {
  if (!email || typeof email !== "string") return false;
  const e = email.trim().toLowerCase();
  if (!e.includes("@")) return false;
  return e.endsWith(".edu") || e.endsWith(".ac.uk") || e.endsWith(".edu.au");
}

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/api/send-code", async (req, res) => {
  const email = req.body?.email?.trim?.();
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!isValidSchoolEmail(email)) {
    return res.status(400).json({
      error: "Please use your college or university email (e.g. name@school.edu).",
    });
  }

  const code = generateCode();
  codes.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
  });

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Your StudyMate verification code",
    html: `
      <p>Your verification code is:</p>
      <p style="font-size:24px; font-weight:bold; letter-spacing:4px;">${code}</p>
      <p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      <p>— StudyMate</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      error: "Failed to send the code. Please try again.",
    });
  }

  res.json({ ok: true });
});

app.post("/api/verify-code", (req, res) => {
  const email = req.body?.email?.trim?.();
  const code = req.body?.code?.trim?.().replace(/\D/g, "").slice(0, 6);

  if (!email || !code || code.length !== 6) {
    return res.status(400).json({ error: "Email and 6-digit code are required." });
  }

  const stored = codes.get(email.toLowerCase());
  if (!stored) {
    return res.status(400).json({ error: "Invalid or expired code. Request a new one." });
  }
  if (Date.now() > stored.expiresAt) {
    codes.delete(email.toLowerCase());
    return res.status(400).json({ error: "Code expired. Request a new one." });
  }
  if (stored.code !== code) {
    return res.status(400).json({ error: "Invalid code." });
  }

  codes.delete(email.toLowerCase());
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`StudyMate API running at http://localhost:${PORT}`);
  if (!process.env.RESEND_API_KEY) {
    console.warn("Warning: RESEND_API_KEY not set. Set it in .env to send real emails.");
  }
});
