# Rang Travels CRM - Deployment Blueprint

Configuration guidelines for production readiness.

## Frontend (Vercel)
The React + Vite frontend deploys directly to Vercel.
1. Connect github repository.
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment variables:
   - `VITE_API_URL`: Path to active FastAPI app (e.g. `https://api.rangtravels.com/api/v1`)

## Backend (Render or Railway)
FastAPI Python web services.
1. Deploy as a Web Service.
2. Build commands:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
3. Environment Variables:
   - `DATABASE_URL`: Connection string to Neon Database.
   - `SECRET_KEY`: High-entropy hash key.
   - `BACKEND_CORS_ORIGINS`: `["https://rangtravels.vercel.app"]`

## Database (Neon PostgreSQL)
1. Provision Serverless Postgres Instance.
2. Retrieve connections string for Async SQLAlchemy:
   - Replace standard driver prefix `postgresql://` with `postgresql+asyncpg://`.
