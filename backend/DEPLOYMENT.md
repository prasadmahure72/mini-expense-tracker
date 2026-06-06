# Deployment Guide — Render

## Prerequisites
- [Render account](https://render.com)
- GitHub repository with this codebase
- PostgreSQL database (Render free tier)

---

## Step 1 — Create PostgreSQL Database on Render

1. Go to **Render Dashboard → New → PostgreSQL**
2. Configure:
   - **Name:** `expense-tracker-db`
   - **Database:** `expense_tracker`
   - **Region:** Oregon (US West)
   - **Plan:** Free
3. Click **Create Database**
4. Copy the **Internal Database URL** (used for the web service)

---

## Step 2 — Deploy the API

### Option A: Using render.yaml (recommended)

1. Push your code to GitHub including `render.yaml` in the `backend/` root
2. In Render Dashboard → **New → Blueprint**
3. Connect your GitHub repo
4. Render auto-reads `render.yaml` and creates the service + database

### Option B: Manual Setup

1. **New → Web Service**
2. Connect GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run db:generate && npm run db:migrate`
   - **Start Command:** `npm start`
   - **Node Version:** 18 (set in `RENDER_NODE_VERSION` env var if needed)

---

## Step 3 — Environment Variables

In your Render web service, add these environment variables:

| Variable       | Value                                    |
|----------------|------------------------------------------|
| `DATABASE_URL` | Internal connection string from Step 1   |
| `JWT_SECRET`   | Strong random string (use "Generate")    |
| `JWT_EXPIRES_IN` | `7d`                                   |
| `NODE_ENV`     | `production`                             |
| `CORS_ORIGIN`  | Your frontend URL (e.g. `https://your-app.onrender.com`) |

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 4 — Database Migration

The build command runs `prisma migrate deploy` automatically.

To run manually from your local machine:
```bash
# Set DATABASE_URL to your Render PostgreSQL URL
export DATABASE_URL="postgresql://..."

cd backend
npm run db:generate
npm run db:migrate

# Optional: seed demo data
npm run db:seed
```

---

## Step 5 — Verify Deployment

Test the health endpoint:
```bash
curl https://your-api.onrender.com/api/health
# {"success":true,"message":"API is running","timestamp":"..."}
```

---

## Local Development with PostgreSQL

### Option A: Docker
```bash
docker run --name expense-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_tracker \
  -p 5432:5432 -d postgres:16
```

### Option B: Local PostgreSQL
```bash
createdb expense_tracker
```

Then:
```bash
cp .env.example .env
# Edit .env with your local DATABASE_URL

npm install
npm run db:generate
npm run db:migrate:dev --name init
npm run db:seed   # optional demo data
npm run dev
```

---

## Prisma CLI Reference

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a new migration (dev only)
npx prisma migrate dev --name your_migration_name

# Apply pending migrations (production)
npm run db:migrate

# Push schema without migrations (quick prototyping)
npm run db:push

# Open Prisma Studio (GUI)
npm run db:studio

# Seed demo data
npm run db:seed
```

---

## Connecting the Frontend

Update your frontend `.env`:
```
VITE_API_URL=https://your-api.onrender.com/api
VITE_USE_MOCK=false
```

Then redeploy the frontend.
