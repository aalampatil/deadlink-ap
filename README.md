# DeadLink

A deadline submission management service. Users get a placeholder link they can share immediately — before their actual submission is ready. When the submission is ready, they map it to the placeholder and anyone with the link gets the real content.

---

## How It Works

```
1. User creates a placeholder link  →  deadlink.app/s/abc123
2. User shares that link publicly (in emails, docs, portfolios etc.)
3. User finishes their submission
4. User maps the real submission URL to their placeholder
5. Anyone visiting deadlink.app/s/abc123 now gets redirected to the real content
```

No broken links. No "coming soon" pages. The placeholder link always works.

---

## Tech Stack

### Server

| Package              | Purpose                              |
| -------------------- | ------------------------------------ |
| `express`            | HTTP server                          |
| `drizzle-orm` + `pg` | Primary database ORM + PostgreSQL    |
| `mongoose`           | MongoDB (submission content storage) |
| `@clerk/express`     | Authentication                       |
| `nanoid`             | Short unique link ID generation      |
| `zod`                | Request validation                   |
| `express-rate-limit` | Rate limiting                        |
| `typescript`         | Type safety                          |

### Client

|            |                |
| ---------- | -------------- |
| TypeScript | Frontend logic |
| CSS        | Styling        |

---

## Project Structure

```
deadlink-ap/
├── client/          # Frontend
└── server/          # Backend API
    ├── src/
    │   └── index.ts # Entry point
    ├── drizzle/     # DB migrations
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- MongoDB database
- A [Clerk](https://clerk.com) account for auth

### Installation

```bash
git clone https://github.com/aalampatil/deadlink-ap.git
cd deadlink-ap/server
npm install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=3000

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/deadlink

# MongoDB
MONGODB_URI=mongodb://localhost:27017/deadlink

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

For production, create `.env.production` with the same keys pointing to your production databases.

### Run Databases with Docker

```bash
# PostgreSQL
docker run -d \
  --name deadlink-pg \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=deadlink \
  -p 5432:5432 \
  postgres:16-alpine

# MongoDB
docker run -d \
  --name deadlink-mongo \
  -p 27017:27017 \
  mongo:7
```

Or with Docker Compose:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: deadlink
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  pg_data:
  mongo_data:
```

```bash
docker compose up -d
```

### Database Migrations

```bash
# Generate migrations from schema
npm run db:generate

# Run migrations (dev)
npm run db:migrate

# Run migrations (production)
npm run db:migrate:prod
```

### Run Dev Server

```bash
npm run dev
```

Server starts with hot reload via `tsc-watch` — any TypeScript change recompiles and restarts automatically.

### Build for Production

```bash
npm run build
npm run start
```

---

## Scripts

| Script                    | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start dev server with hot reload     |
| `npm run build`           | Compile TypeScript to `dist/`        |
| `npm run start`           | Run compiled production server       |
| `npm run db:generate`     | Generate SQL migrations from schema  |
| `npm run db:migrate`      | Run migrations (dev)                 |
| `npm run db:migrate:prod` | Run migrations against production DB |
| `npm run db:studio`       | Open Drizzle Studio to inspect DB    |

---

## Authentication

Auth is handled by [Clerk](https://clerk.com). Users sign in via Clerk and all protected routes require a valid Clerk session token — no password management needed.

---

## Why Two Databases?

PostgreSQL (via Drizzle) stores structured relational data — users, placeholder links, mappings, and metadata.

MongoDB (via Mongoose) stores actual submission content, which can be flexible and unstructured depending on the type of submission being tracked.
