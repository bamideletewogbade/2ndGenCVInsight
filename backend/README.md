# CV Insight AI — Backend

FastAPI backend for resume analysis powered by NVIDIA NIM.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or use the convenience script:

```bash
bash run.sh
```

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/analyze` | Upload a PDF/DOCX resume (multipart form: `file` + optional `job_description`) and receive a full AI analysis |
| `GET` | `/api/history` | List the 50 most recent analyses (summary) |
| `GET` | `/api/analysis/{analysis_id}` | Retrieve a full analysis and its metrics by ID |
| `DELETE` | `/api/analysis/{analysis_id}` | Delete an analysis and its metrics |
| `GET` | `/api/health` | Health check — returns status and configured model labels |

## Configuration

All config is loaded from the `.env` file:

| Variable | Description |
|----------|-------------|
| `NVIDIA_API_KEY` | NVIDIA NIM API key |
| `DATABASE_URL` | Async PostgreSQL connection string (asyncpg) |

## Architecture

- **3-model fallback chain**: GLM 5.2 → MiniMax M3 → Nemotron 3 Ultra 550B
- **JSON extraction**: direct parse → markdown fence extraction → brace matching
- **Async throughout**: httpx for HTTP, SQLAlchemy async for DB
- **CORS**: pre-configured for Vite dev server on `localhost:5173`