# Bình Minh Storefront

Next.js App Router, Tailwind CSS, Payload CMS, PostgreSQL, and Docker Compose.

## Structure

- `src/app/(frontend)` contains public routes.
- `src/app/(payload)` contains Payload-managed admin and API routes.
- `src/collections` and `src/globals` define the CMS schema.
- `media` stores local Payload uploads and is mounted as a Docker volume.

## Commands

- `corepack pnpm dev` starts the development server.
- `corepack pnpm build` creates the production build.
- `corepack pnpm generate:types` regenerates Payload types after schema changes.
- `corepack pnpm generate:importmap` regenerates the Payload admin import map.
- `docker compose up --build` starts the full stack.

Keep Payload package versions aligned. Do not edit generated `src/payload-types.ts` or `src/app/(payload)/admin/importMap.js` manually.
