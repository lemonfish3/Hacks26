/**
 * StudyMate API client. Uses token from localStorage for authenticated requests.
 */

const STORAGE_KEY = "studymate_token";

function getBaseUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/$/, "");
  }
  return "http://localhost:3001";
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export interface ApiUser {
  id: number;
  email: string;
  nickname: string;
  major: string;
  age: number;
  gender: string;
  avatar: { base: string; color: string; emoji?: string; head?: string; clothes?: string };
  preference: string;
  buddyPreference: string;
  createdAt?: string;
  updatedAt?: string;
}

async function request<T>(
  path: string,
  options: RequestInit & { body?: object } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const url = `${getBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((rest.headers as Record<string, string>) || {}),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : rest.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || res.statusText || "Request failed");
  }
  return data as T;
}

export async function sendCode(email: string): Promise<void> {
  await request("/api/send-code", { method: "POST", body: { email } });
}

export interface VerifyResponse {
  token: string;
  user: ApiUser;
}

export async function verifyCode(email: string, code: string): Promise<VerifyResponse> {
  return request("/api/verify-code", { method: "POST", body: { email, code } });
}

export async function getMe(): Promise<{ user: ApiUser }> {
  return request("/api/me");
}

export async function updateMe(profile: Partial<ApiUser>): Promise<{ user: ApiUser }> {
  return request("/api/me", { method: "PUT", body: profile });
}

export async function logout(): Promise<void> {
  try {
    await request("/api/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

export interface MatchResponse {
  users: ApiUser[];
}

export async function getMatch(params?: {
  preference?: string;
  buddyPreference?: string;
}): Promise<MatchResponse> {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return request(`/api/match${q ? `?${q}` : ""}`);
}

// --- Rooms (join by code, create room) ---
export interface ApiRoomMember {
  nickname: string;
  avatar: { base: string; color: string; head?: string; clothes?: string };
}

export interface ApiRoom {
  id: string;
  inviteCode: string;
  name: string;
  hostNickname: string;
  members: ApiRoomMember[];
  duration: number;
  maxMembers: number;
  timeLeft?: number;
}

export async function createRoom(params: {
  name: string;
  hostNickname: string;
  duration: number;
}): Promise<{ room: ApiRoom }> {
  return request("/api/rooms", { method: "POST", body: params });
}

export async function getRoomByCode(code: string): Promise<{ room: ApiRoom }> {
  const trimmed = code.trim().toUpperCase().replace(/\s/g, "");
  return request(`/api/rooms/by-code/${encodeURIComponent(trimmed)}`);
}

export async function joinRoom(
  roomId: string,
  member: { nickname: string; avatar: ApiRoomMember["avatar"] }
): Promise<{ room: ApiRoom; member: ApiRoomMember }> {
  return request(`/api/rooms/${encodeURIComponent(roomId)}/join`, {
    method: "POST",
    body: member,
  });
}

/** WebSocket URL for room channel (timer, voice signaling). Use same host as API. */
export function getWsUrl(): string {
  const base = getBaseUrl().replace(/^http/, "ws");
  return base;
}
