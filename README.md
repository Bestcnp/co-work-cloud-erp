# Co-Work Cloud ERP

**Unified Enterprise Platform: Cloudfull.com (CDF) & Co-Work.cloud (CW.C)**

Multi-tenant Cloud ERP with Hermes AI — built with TypeScript, React, Express, Firebase, and Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind CSS 4 |
| **Backend** | Express.js + TypeScript (ESM) |
| **Database** | Firebase Firestore (emulated in dev) |
| **Auth** | Firebase Authentication (emulated in dev) |
| **AI** | Ollama + Hermes 3 (8B) |
| **Container** | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Node.js 22+
- Docker Desktop
- Ollama with `hermes3:8b` model

### 1. Clone & Setup

```bash
git clone https://github.com/Bestcnp/co-work-cloud-erp.git
cd co-work-cloud-erp
cp .env.example .env
```

### 2. Start with Docker Compose

```bash
docker compose up -d
```

This starts:
- **Backend API** → http://localhost:5001
- **Frontend** → http://localhost:3000
- **Firebase Emulator UI** → http://localhost:4000

### 3. Start Ollama (host machine)

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

### 4. Verify

```bash
# Health check
curl http://localhost:5001/health

# Hermes AI check
curl http://localhost:5001/health/hermes
```

## Project Structure

```
co-work-cloud-erp/
├── backend/           # Express API (TypeScript ESM)
│   ├── src/
│   │   ├── config/    # Firebase, database router
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/    # Single source of truth
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/          # React + Vite (TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── firebase.json
├── firestore.rules
└── .env.example
```

## License

Private — CNP Group © 2026
