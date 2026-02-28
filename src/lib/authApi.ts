/**
 * Auth API: send and verify email codes.
 * In dev, Vite proxies /api to the backend (see vite.config.ts).
 */

const API_BASE = "";

export async function sendVerificationCode(email: string): Promise<{ ok: true } | { error: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: (data as { error?: string }).error || "Failed to send code." };
    }
    return data as { ok: true };
  } catch (e) {
    console.error("sendVerificationCode", e);
    return { error: "Network error. Is the server running? Run: npm run server" };
  }
}

export async function verifyCode(
  email: string,
  code: string
): Promise<{ ok: true } | { error: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        code: code.replace(/\D/g, "").slice(0, 6),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: (data as { error?: string }).error || "Invalid or expired code." };
    }
    return data as { ok: true };
  } catch (e) {
    console.error("verifyCode", e);
    return { error: "Network error. Is the server running? Run: npm run server" };
  }
}
