# Cloud Task Manager 🚀

A modern, full-stack **MERN** (MongoDB, Express.js, React, Node.js) cloud task management dashboard designed for high productivity, real-time status monitoring, and seamless workflow organization.

Repository: [https://github.com/muthukumar9360/Demo_ZOHO.git](https://github.com/muthukumar9360/Demo_ZOHO.git)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Folder Structure](#project-folder-structure)
- [Prerequisites](#prerequisites)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [REST API Documentation](#rest-api-documentation)
- [Testing & Quality Verification](#testing--quality-verification)
- [Future Deployment (Zoho Catalyst)](#future-deployment-zoho-catalyst)

---

## 🌟 Overview

Cloud Task Manager is a full-featured SaaS-style productivity application built with clean MERN architecture. It features a responsive dashboard with real-time KPI counters, flexible card and tabular views, search and multi-criteria filters, and full CRUD operations connected to MongoDB Atlas.

---

## ✨ Key Features

1. **Dashboard Analytics & KPIs**:
   - Total Tasks counter
   - Completed Tasks counter & overall sprint progress bar
   - In-Progress and Pending Tasks monitors
   - High Priority task alert indicators
2. **Comprehensive Task Operations (CRUD)**:
   - **Create**: Add new tasks with title, description, category, priority, status, and due date.
   - **Read**: Fetch tasks, search by keywords, filter by status, priority, or category, and sort dynamically.
   - **Inspect**: Modal view displaying complete metadata, created/updated timestamps, and MongoDB IDs.
   - **Update**: Edit task details or quickly cycle status directly from task cards or tables.
   - **Delete**: Safe removal with a delete confirmation dialog.
3. **Advanced UX/UI**:
   - Dual viewing modes: **Interactive Grid Cards** and **Structured Data Table**.
   - Real-time search with clear button.
   - Live database connection status indicator.
   - Floating toast notification system for instant feedback.
   - Accessible empty states and loading skeleton animations.
   - Fully responsive layout for desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Functional components, custom hooks)
- **Vite** (Next-generation lightning-fast build tool)
- **Axios** (Configured REST API HTTP client)
- **Lucide React** (Modern, lightweight icons)
- **Custom CSS Design System** (Variables, glassmorphism, responsive flex/grid)

### Backend
- **Node.js** (>= 18.0.0)
- **Express.js** (Modular REST API framework)
- **Mongoose 8** (Object Data Modeling with schema validation and indexing)
- **CORS & Morgan** (Cross-origin configuration and HTTP request logger)
- **Dotenv** (Secure environment configuration)

### Database
- **MongoDB Atlas** (Cloud Document Database, db: `cloud_task_manager`)

### Testing
- **Supertest** & **MongoDB Memory Server** (Automated endpoint & schema verification)

---

## 📂 Project Folder Structure

```
Zoho_Catalyst/
│
├── frontend/                     # Client application (Vite + React)
│   ├── public/
│   │   └── favicon.svg           # Brand favicon
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskDetailModal.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   ├── TaskTable.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/                # Page views
│   │   │   ├── DashboardPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── services/             # API client integration
│   │   │   └── api.js
│   │   ├── App.css               # Core styling & theme variables
│   │   ├── App.jsx               # Application controller & state
│   │   ├── index.css             # Reset & global styles
│   │   └── main.jsx              # React DOM entry point
│   ├── .env.example              # Client environment template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Express REST API Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection & status tracker
│   ├── controllers/
│   │   └── taskController.js     # Task CRUD and metrics business logic
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized error handler & 404 catcher
│   │   └── validateTask.js       # Request validation & ObjectId guards
│   ├── models/
│   │   └── Task.js               # Mongoose Task schema and indexes
│   ├── routes/
│   │   ├── healthRoutes.js       # /api/health endpoint
│   │   └── taskRoutes.js         # /api/tasks endpoints
│   ├── tests/
│   │   └── test-runner.js        # Automated API test suite
│   ├── .env.example              # Server environment template
│   ├── package.json
│   └── server.js                 # Express server initialization
│
├── .gitignore                    # Prevents node_modules, .env, and dist commits
└── README.md                     # Documentation
```

---

## 📋 Prerequisites

Before running the application, ensure you have:
- **Node.js** (v18.0.0 or higher) installed: `node -v`
- **npm** (v9.0.0 or higher) installed: `npm -v`
- A **MongoDB Atlas** account and cluster

---

## 🍃 MongoDB Atlas Setup

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a database user (e.g., `task_admin` with password authentication).
3. Go to **Network Access** and ensure your current IP address is whitelisted (or `0.0.0.0/0` for development).
4. Go to **Clusters** > Click **Connect** > Choose **Drivers** (Node.js).
5. Copy your connection string. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Paste your connection string into `backend/.env` under `MONGODB_URI`.

> 🔒 **Security Notice**: Never commit `backend/.env` to GitHub. The `.gitignore` file is pre-configured to prevent secret leakage.

---

## 🔐 Environment Variables Configuration

### 1. Backend (`backend/.env`)

Copy the example file:
```bash
cp backend/.env.example backend/.env
```

Set the values in `backend/.env`:
```env
PORT=5000
MONGODB_URI=PASTE_MY_MONGODB_ATLAS_CONNECTION_STRING_HERE
DB_NAME=cloud_task_manager
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (`frontend/.env`)

Copy the example file:
```bash
cp frontend/.env.example frontend/.env
```

Set the API URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## ⚡ Installation and Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### Option A: Run Backend

Open a terminal window:
```bash
cd backend
npm run dev
```
*Backend runs at: `http://localhost:5000`*

### Option B: Run Frontend

Open a second terminal window:
```bash
cd frontend
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

Open `http://localhost:5173` in your web browser.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/health` | Health & DB connection status | None |
| `GET` | `/tasks` | Retrieve all tasks | `search`, `status`, `priority`, `category`, `sortBy`, `order` |
| `GET` | `/tasks/stats/summary` | Get aggregated dashboard metrics | None |
| `GET` | `/tasks/:id` | Get individual task by ID | `:id` (24-char ObjectId) |
| `POST` | `/tasks` | Create a new task | `{ title, description, category, priority, status, dueDate }` |
| `PUT` | `/tasks/:id` | Update task details | `{ title, description, category, priority, status, dueDate }` |
| `PATCH` | `/tasks/:id/status` | Update task status | `{ status }` (`Pending`, `In Progress`, `Completed`) |
| `DELETE` | `/tasks/:id` | Delete task by ID | `:id` (24-char ObjectId) |

### Sample JSON Request: Create Task
```json
POST /api/tasks
Content-Type: application/json

{
  "title": "Configure Cloud Infrastructure",
  "description": "Prepare network access and environment configuration",
  "category": "DevOps",
  "priority": "High",
  "status": "In Progress",
  "dueDate": "2026-11-20T00:00:00.000Z"
}
```

### Sample Health Check Response
```json
GET /api/health

{
  "status": "ok",
  "service": "Cloud Task Manager Backend API",
  "uptime": "120 seconds",
  "timestamp": "2026-11-11T10:55:00.000Z",
  "database": {
    "status": "connected",
    "connected": true,
    "name": "cloud_task_manager"
  }
}
```

---

## 🧪 Testing & Quality Verification

Run the automated test suite to verify 100% of CRUD endpoints, schema validations, and error handling:

```bash
cd backend
npm test
```

Expected Result:
```
🧪 Starting Automated Backend API Test Suite...
  📦 In-Memory MongoDB connected for isolated testing.
  ✅ PASS: GET /api/health reports OK and database connected
  ✅ PASS: POST /api/tasks creates task successfully
  ✅ PASS: POST /api/tasks rejects empty title with 400 Bad Request
  ✅ PASS: POST /api/tasks rejects invalid priority
  ✅ PASS: GET /api/tasks returns all tasks
  ✅ PASS: GET /api/tasks?search matches task title
  ✅ PASS: GET /api/tasks?status filters by status
  ✅ PASS: GET /api/tasks?priority filters by priority
  ✅ PASS: GET /api/tasks/stats/summary returns correct dashboard counters
  ✅ PASS: GET /api/tasks/:id returns single task
  ✅ PASS: GET /api/tasks/invalid-id handles bad ObjectId format with 400
  ✅ PASS: GET /api/tasks/:id returns 404 for non-existent ID
  ✅ PASS: PUT /api/tasks/:id updates task details
  ✅ PASS: PATCH /api/tasks/:id/status updates status to Completed
  ✅ PASS: DELETE /api/tasks/:id deletes task
  ✅ PASS: Deleted task is no longer found (404)
========================================
🎯 Test Summary: 16 Passed, 0 Failed
========================================
```

Frontend production build verification:
```bash
cd frontend
npm run build
```

---

## ☁️ Future Deployment (Zoho Catalyst)

This application is engineered with clear separation between the Express backend and React frontend:
- Backend routes are cleanly modularized with Express Routers.
- The frontend interacts strictly through `VITE_API_BASE_URL`.
- Database credentials and settings reside exclusively in environment variables.
- When ready for deployment, the frontend can be hosted as a Web Client / AppSail on Zoho Catalyst, and the backend can be deployed as an AppSail service or Advanced I/O function without modifying core business logic.

