## Task Management (MERN) - Detailed Guide with Gemini AI Integration

This document explains how the application works end-to-end and how Gemini AI features are integrated on both backend and frontend. It also includes setup, environment, endpoints, components, and troubleshooting tips.

---

## 1) Architecture Overview

- **Frontend**: React (Create React App) + Chakra UI components + Axios for API calls
- **Backend**: Node.js + Express + Mongoose (MongoDB)
- **Database**: MongoDB (tasks, projects, employees, timesheets, attendance)
- **AI**: Gemini AI (via `@google/generative-ai`) with robust fallbacks if not installed/configured

High-level flow:
- Users interact with pages like `Tasks`, `Projects`, etc.
- The UI calls REST endpoints under `/api` for CRUD and analytics.
- Gemini endpoints live under `/api/ai/*` and are JWT-protected; frontend calls them through a small `aiService` wrapper.

---

## 2) Project Structure (key files)

- `backend/app.js` – Express app, route mounting, middleware, env
- `backend/routes/*.js` – REST endpoints (auth, employee, project, task, timesheet, attendance, ai)
- `backend/models/*.js` – Mongoose models (e.g., `projects.js`, `tasks.js`)
- `backend/services/geminiService.js` – All Gemini AI interactions with fallback responses
- `frontend/src/layouts/tasks/Tasks.jsx` – Tasks dashboard (dynamic from API) + AI Insights panel
- `frontend/src/layouts/tasks/modals/AddTask.jsx` – Add Task modal enhanced with AI helpers
- `frontend/src/layouts/projects/Projects.jsx` – Projects dashboard (dynamic from API)
- `frontend/src/services/aiService.js` – Frontend axios wrapper for AI endpoints with fallbacks
- `frontend/src/components/ai/*` – AI UI components

---

## 3) Local Setup

1. Install dependencies
   - Frontend
     ```bash
     cd frontend
     npm install
     npm start
     ```
   - Backend
     ```bash
     cd backend
     npm install
     node app.js
     ```

2. Environment variables (`backend/.env`)
   - Minimal example:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/task-management
     JWT_SECRET=your_jwt_secret_here
     # Optional (enables real Gemini AI):
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. Optional AI dependencies
   - To enable real Gemini AI generation (instead of fallbacks):
     ```bash
     cd backend && npm install @google/generative-ai
     cd ../frontend && npm install @google/generative-ai
     ```
   - Get your API key from Google AI Studio and place it in `backend/.env` as `GEMINI_API_KEY`.

Notes:
- If the Gemini package or API key is missing, the app continues to work using intelligent fallbacks (no crashes).
- All AI routes are protected by JWT middleware; ensure login/token flow is set.

---

## 4) Data Models (simplified)

### Task (`backend/models/tasks.js`)
- `title: String` (required)
- `description: String` (required)
- `assignTo: ObjectId(ref Employee)` (required)
- `project: ObjectId(ref Project)` (required)
- `startDate: Date` (required)
- `priority: 'Most Important' | 'Important' | 'Least Important'` (required)
- `status: String` (optional in current UI; UI supports pending/in-progress/completed)

### Project (`backend/models/projects.js`)
- `title, description, clientName, startDate` (required)
- `status: 'On Hold' | 'In Progress' | 'Testing' | 'Completed'` (required)
- `priority: 'Most Important' | 'Important' | 'Least Important'` (required)

---

## 5) REST API (selected)

### Projects
- `POST /api/project` – Add project
- `GET /api/projects` – List projects

### Tasks
- `POST /api/task` – Add task
- `GET /api/tasks` – List tasks

### Gemini AI
- `POST /api/ai/generate-description` – Body: `{ title, context? }` → `{ description }`
- `POST /api/ai/suggest-priority` – Body: `{ title, description }` → `{ priority }`
- `POST /api/ai/task-suggestions` – Body: `{ projectContext?, employeeRole? }` → `{ suggestions }`
- `POST /api/ai/analyze-performance` – Body: `{ tasks: Task[] }` → `{ analysis }`

All AI routes require a valid JWT (Authorization: `Bearer <token>`).

---

## 6) Gemini AI Service (Backend)

File: `backend/services/geminiService.js`

Responsibilities:
- Centralizes all Gemini interactions
- Provides fallbacks if:
  - `@google/generative-ai` is not installed, or
  - `GEMINI_API_KEY` is not set, or
  - API errors occur

Main methods:
- `generateTaskDescription(title, context?)`: Returns detailed task description
- `suggestPriority(title, description)`: Returns one of the enumerated priorities
- `generateTaskSuggestions(projectContext?, employeeRole?)`: Returns an array of tasks (title, description, priority)
- `analyzeTaskPerformance(tasks)`: Returns insights JSON summarizing priorities, bottlenecks, recommendations

Fallback behavior:
- When Gemini is unavailable or errors occur, the service returns deterministic, safe default responses (e.g., keyword-based priority, sensible descriptions, basic analysis).

---

## 7) Gemini AI Endpoints (Backend)

File: `backend/routes/ai.js`

Route handlers map 1:1 to `geminiService` methods, perform basic request validation, and return JSON responses. All endpoints are mounted under `/api` in `backend/app.js` and use `authMiddleware`.

---

## 8) Frontend AI Integration

### Services
- `frontend/src/services/aiService.js`
  - Wraps calls to AI endpoints
  - Adds `Authorization` header from `localStorage.tm_token`
  - Includes client-side fallbacks mirroring backend fallbacks

### AI Components
- `AITaskSuggestions.jsx` – Button to fetch 5 AI suggestions; click to auto-fill Add Task form
- `AIDescriptionGenerator.jsx` – Button to generate description from title; copy helper
- `AIPrioritySuggestion.jsx` – Button to analyze title+description to suggest priority
- `AITaskInsights.jsx` – Button to analyze current tasks and display insights (priority distribution, bottlenecks, recommendations)

### Add Task Modal Integration

File: `frontend/src/layouts/tasks/modals/AddTask.jsx`
- Displays AI suggestions and utilities above the manual fields
- On suggestion select: fills `title`, `description`, `priority`
- Description generator and priority suggestion can be invoked individually

---

## 9) Dynamic Data Rendering (No Hardcoded Demos)

### Tasks Page (`Tasks.jsx`)
- Fetches `/api/tasks` via axios in `useEffect`
- Renders sections by status (pending/in-progress/completed) from actual DB data
- Statistics and circular progress display live percentages
- AI Insights panel uses the live task list

### Projects Page (`Projects.jsx`)
- Fetches `/api/projects` via axios in `useEffect`
- Renders To-Do (On Hold), In Progress, Testing, Completed
- Statistics and status circles use live counts

We removed all demo content like “Attend Nischal’s Birthday Party” and now display only real data.

---

## 10) Theming Notes

- Global background color is configurable in `frontend/src/index.css` (`#root { background-color: ... }`).
- Sidebar colors live in `frontend/src/components/sidenav/sidenav.css`.

---

## 11) Security & Keys

- Do not commit real API keys.
- Keep `GEMINI_API_KEY` only in `backend/.env`.
- All AI endpoints are JWT-protected; ensure you set/refresh the token in `localStorage` after login.

---

## 12) Troubleshooting

Problem: “Failed to generate description”
- Ensure backend is running and reachable.
- If you want real AI: install `@google/generative-ai` in backend and set `GEMINI_API_KEY`.
- Without the package/key, the system returns safe fallback descriptions (no crash).

Problem: AI endpoints 401/403
- Ensure `tm_token` exists in `localStorage` and your `Authorization` header is sent.

Problem: Projects/Tasks not updating
- Ensure MongoDB is running and seeded with documents.
- Check network tab for `/api/tasks` or `/api/projects` responses/errors.

---

## 13) Extending the App

- Wire `ReadTaskModal`/`ReadProjectModal` to display the selected entity by lifting state up and passing props.
- Add status transitions and progress tracking to tasks/projects.
- Enhance AI prompts with richer project context or team metadata for more tailored outputs.

---

## 14) Quick Reference – Commands

Frontend
```bash
cd frontend
npm start
```

Backend
```bash
cd backend
node app.js
```

Enable Gemini (optional, for real AI)
```bash
cd backend && npm install @google/generative-ai
cd ../frontend && npm install @google/generative-ai
```

Set environment in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

With this setup, the app runs on real data and optionally leverages Gemini AI for smarter task creation, prioritization, and insights. If Gemini isn’t configured, built-in fallbacks keep all features usable.


