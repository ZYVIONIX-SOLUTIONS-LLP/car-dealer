# Velocity Motors

A premium used car marketplace — browse verified pre-owned vehicles across every price range,
from budget hatchbacks to luxury and sports cars, plus a full dealer admin dashboard.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** — custom dark theme
- **Prisma + SQLite** — `prisma/schema.prisma`, local file DB at `prisma/dev.db`
- **Framer Motion**, **lucide-react**
- **Zod** for validation, **jose** + **bcryptjs** for admin session auth
- Local image uploads under `public/uploads/vehicles`

## Getting Started

```bash
npm install
npm run db:seed   # creates the SQLite DB, seeds brands/categories/vehicles/testimonials, and the admin user
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

### Admin dashboard

Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Default credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — change these before
deploying anywhere real, then re-run `npm run db:seed` (it upserts the admin user's password hash).

From the dashboard you can manage vehicles (with multi-image upload), enquiries, testimonials,
brands, and categories.

## Environment variables

See `.env` — `DATABASE_URL`, `SESSION_SECRET` (used to sign the admin session JWT), `ADMIN_EMAIL`,
`ADMIN_PASSWORD`. Not committed to version control.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build/serve
- `npm run db:seed` — (re)seed the database
- `npm run lint` — ESLint

## Notes

- This Next.js version renamed `middleware.ts` to `proxy.ts` (see `proxy.ts` at the project root) — it guards `/admin/*` routes.
- Vehicle photos in the seed data are placeholder stock photography from Unsplash; brand "logos" are typographic wordmarks rather than real trademarked logos, since this is demo content.
