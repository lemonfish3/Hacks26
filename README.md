# Cloudy
![Cloudy‘s Logo](src/data/logo.PNG)
Your Virtual-Study Sanctuary

## Inspiration

College students often struggle to find focused and supportive study environments. Studying alone can feel isolating, while coordinating physical group study sessions is difficult. Initially, we explored a one-to-one random matching study space inspired by platforms like ZEP and Omegle. However, after several brainstorming and discussion sessions, we shifted our focus toward subject-based study groups to better address real student needs.

## What it does

Cloudy is a web platform designed to help college students find flexible, low-pressure study spaces. Instead of forcing random matching, Cloudy allows users to join or create themed virtual study rooms based on shared subjects and learning goals. This helps students stay focused while also maintaining a sense of accountability and community.

## How we built it

We built Cloudy as a full-stack web prototype using React for the frontend and Node.js with Socket.IO for real-time communication. The user interface focuses on a calm, cloud-themed aesthetic, incorporating soft gradients and hand-drawn animal-style avatars to create a friendly and low-pressure study atmosphere.

Key features include:
- Customizable avatar creation
- Preference-based user profile setup
- Study lobby for browsing and hosting rooms
- Pomodoro-style focus timer
- Group text chat
- Productivity tracking through study history and session statistics

## Environment variables

**Put all environment variables in a `.env` file** in the project root (copy from [.env.example](.env.example) and fill in real values). Do not commit `.env`; it is gitignored.

- **GEMINI_API_KEY** — Required for Gemini AI in the app. Get it: [Google AI Studio](https://aistudio.google.com/apikey) → “Get API key” / “Create API key”, then paste the key into `.env`.
- **APP_URL** — The URL where your app is served. Local dev: `http://localhost:3000`. When deployed (e.g. Cloud Run), use the URL your host gives you (e.g. `https://your-app-xxx.run.app`).
- **GMAIL_USER** and **GMAIL_APP_PASSWORD** — For email verification that works for **any .edu address** (no domain or Resend needed). Use a Gmail account and create an [App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification).
- **RESEND_API_KEY** / **FROM_EMAIL** — Optional. Used only if Gmail is not set; Resend’s free tier may only allow sending to the account owner’s email.
- **VITE_API_URL** — Optional. API base URL for the frontend; defaults to `http://localhost:3001` when unset.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set at least `GEMINI_API_KEY` (and `APP_URL` if needed).
3. Run the app: `npm run dev`

## Email verification — works for any .edu (no domain)

Use **Gmail** so verification codes can be sent to **any** college/university email (e.g. any `@uci.edu`). No domain purchase or Resend required.

1. Use a Gmail account. In [Google Account → Security](https://myaccount.google.com/security), turn on **2-Step Verification**.
2. Go to [App passwords](https://myaccount.google.com/apppasswords), create a new app password for “Mail”, and copy the 16-character password.
3. In `.env`, set:
   - `GMAIL_USER=your@gmail.com`
   - `GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx` (the app password)
4. In a second terminal, run `npm run server` (port 3001). With `npm run dev` and `npm run server` both running, **Sign up** works for any `.edu` (and `.ac.uk`, `.edu.au`) address.

If you prefer Resend and have a verified domain, you can set `RESEND_API_KEY` and `FROM_EMAIL` instead; the server uses Gmail when both Gmail and Resend are set.

See [docs/EMAIL_AND_SSO_SETUP.md](docs/EMAIL_AND_SSO_SETUP.md) for **UCI SSO (Shibboleth + Duo)** integration.

## Database and auth

With `npm run server` running, the app uses:

- **SQLite** (file: `data/studymate.db`) for users and sessions. The `data/` folder is gitignored.
- **Email verification** via Gmail SMTP (or Resend if no Gmail). After verifying a code, the server creates or finds the user, creates a session, and returns a token. The frontend stores the token and sends it as `Authorization: Bearer <token>` on every request.
- **Session restore**: On load, the app calls `GET /api/me`. If the token is valid, you go to the profile screen; otherwise the intro screen.
- **Matching**: `GET /api/match` returns other users (by preference and buddy preference) for finding study partners. Use it from the Matching page or Lobby when you add “find a partner” flows.

API endpoints: `POST /api/send-code`, `POST /api/verify-code`, `GET /api/me`, `PUT /api/me`, `POST /api/logout`, `GET /api/match`.

## Tech stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
