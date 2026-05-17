# Smart Leads Dashboard

A production-grade full-stack Lead Management Dashboard built with the MERN stack and TypeScript throughout.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## Overview

Smart Leads Dashboard helps sales teams manage leads with authentication, role-based access control, advanced filtering, CSV export, and a responsive TailwindCSS UI.

## Features

- JWT authentication (register, login, protected routes)
- Full CRUD for leads
- Advanced filtering, search, sorting, and pagination
- Debounced search (400ms)
- Role-Based Access Control (Admin / Sales User)
- CSV export (server-side with current filters)
- Docker Compose setup
- TypeScript on frontend and backend
- Zustand state management with persistence
- React Hot Toast notifications

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Zustand, Axios |
| Backend  | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB                             |
| Auth     | JWT, bcryptjs                       |
| DevOps   | Docker, Docker Compose, Nginx       |

## Prerequisites

- Node.js 20+
- npm
- MongoDB (local or Docker)
- Docker & Docker Compose (optional)

## Local Setup

### 1. Clone and configure environment

```bash
cd smart-leads-dashboard
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your MongoDB URI and JWT secret.

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name smart-leads-mongo mongo:7
```

### 4. Run development servers

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Docker Setup

```bash
cp .env.example .env
# Set JWT_SECRET in .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:5000/api
- MongoDB: localhost:27017

## API Documentation

| Method | Endpoint | Auth | Role | Description |
| ------ | -------- | ---- | ---- | ----------- |
| POST | `/api/auth/register` | No | — | Register user |
| POST | `/api/auth/login` | No | — | Login user |
| GET | `/api/leads` | Yes | Any | List leads (paginated, filtered) |
| GET | `/api/leads/export` | Yes | Any | Export leads as CSV |
| GET | `/api/leads/:id` | Yes | Any | Get lead by ID |
| POST | `/api/leads` | Yes | Any | Create lead |
| PUT | `/api/leads/:id` | Yes | Owner/Admin | Update lead |
| DELETE | `/api/leads/:id` | Yes | Admin | Delete lead |

### Query Parameters (GET `/api/leads`, `/api/leads/export`)

| Param | Type | Description |
| ----- | ---- | ----------- |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `status` | string | Filter: New, Contacted, Qualified, Lost |
| `source` | string | Filter: Website, Instagram, Referral |
| `search` | string | Search name or email |
| `sort` | string | `latest` or `oldest` |

### Register Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "sales"
}
```

### Create Lead Body

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "status": "New",
  "source": "Website",
  "notes": "Interested in enterprise plan"
}
```

### Response Format

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Folder Structure

```
smart-leads-dashboard/
├── client/          # React + TypeScript frontend
├── server/          # Express + TypeScript API
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:5000/api` |

## RBAC Rules

| Action | Admin | Sales |
| ------ | ----- | ----- |
| View all leads | Yes | Yes |
| Create lead | Yes | Yes |
| Edit any lead | Yes | No |
| Edit own leads | Yes | Yes |
| Delete lead | Yes | No |

## Screenshots

<!-- Add screenshots of Dashboard, Leads page, and Lead Detail here -->

## License

MIT
