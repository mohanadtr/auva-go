# Auva Go

Privacy-first URL shortener for the Auva ecosystem.

## Overview

Auva Go lets users create short links, manage them from a dashboard, and view click analytics without invasive tracking.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- MongoDB + Mongoose
- Tailwind CSS
- Shared auth via auva-auth JWT access tokens

## Core Features

- Public short-link creation
- Custom slug support and slug availability check
- Optional expiration dates for links
- Dashboard for authenticated users
- Click analytics (aggregated)
- QR code generation
- Soft delete / disable links
- Middleware-protected dashboard routes

## Authentication Model

- Source of truth: `auva-auth`
- Access token payload expected:
  - `userId`
  - `username`
  - `email`
  - `name`
- Unauthenticated dashboard access redirects to:
  - `https://account.auva.dev/login`

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

Required:

- `MONGODB_URI`
- `NEXT_PUBLIC_AUTH_API_URL`
- `JWT_ACCESS_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

Optional:

- `RATE_LIMIT_MAX`
- `RATE_LIMIT_WINDOW_MS`

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000` by default.

## Production Build

```bash
npm run build
npm start
```

## API Routes

- `POST /api/links` create link
- `GET /api/links` list authenticated user links
- `GET /api/links/[id]` get link details
- `PATCH /api/links/[id]` update link
- `DELETE /api/links/[id]` disable link
- `GET /api/links/check` slug availability
- `GET /api/qr` generate QR
- `GET /api/account` current user from JWT
- `GET /api/storage` usage summary
- `GET /api/health` health check

## Public Repo Readiness Checklist

- `.env` is ignored by git
- `.env.example` contains placeholders only
- No secrets committed in code or docs
- Build passes before push
- License and contribution docs are present

## License

MIT
