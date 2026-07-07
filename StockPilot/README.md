# StockPilot – Inventory Management System

A full-stack MERN (MongoDB, Express, React, Node.js) Inventory Management System.

## Project Structure

```
StockPilot/
├── client/   # React (Vite) + Tailwind CSS frontend
└── server/   # Node.js + Express + MongoDB backend
```

## Quick Start

### 1. Backend (Server)
```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 2. Frontend (Client)
```bash
cd client
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Deployment
- **Backend** → Vercel (`server/vercel.json` included)
- **Frontend** → Netlify (`client/netlify.toml` included)

See individual README files in `/client` and `/server` for detailed setup instructions.
