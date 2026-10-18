# Pocket-Trade

Multi-service cryptocurrency & trading platform ecosystem.

## Architecture

- **`pockettrade-be-main`**: Express.js REST API, WebSockets (Socket.IO), Knex.js, Neon PostgreSQL, Upstash Redis (BullMQ queues).
- **`pockettrade-fe-main`**: Next.js client trading portal with live charts, trade execution, and wallet management.
- **`pockettrade-admin-main`**: Next.js administration dashboard for user management, KYC verification, payout approval, and trade monitors.

## Quick Start

### 1. Backend Setup
```bash
cd pockettrade-be-main/pockettrade-be-main
npm install
npm run build
npm run migrate:latest
npm start
```

### 2. Frontend Setup
```bash
cd pockettrade-fe-main/pockettrade-fe-main
npm install
npm run dev
```

### 3. Admin Dashboard Setup
```bash
cd pockettrade-admin-main/pockettrade-admin-main
npm install
npm run dev
```
