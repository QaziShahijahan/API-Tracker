📊 API Tracker — MERN Stack Application

An end-to-end API Monitoring Dashboard built with the MERN stack (MongoDB, Express.js, React, Node.js).
This project helps track APIs in real time, monitor uptime, request/response metrics, and visualize analytics.

🚀 Live Demo:

Frontend: https://tracer-frontend.onrender.com
Backend API: https://api-tracker-zbdd.onrender.com


This project provides a centralized dashboard to:-

Track different APIs and their health status.
Store logs of API calls (method, path, status code, response time).
Show analytics like uptime %, average response time, request volume, and error rate.
Manage API configurations (enable/disable, scheduling, request limits).
Secure endpoints with API Keys.

✨ Features :-

🔐 API key-based authentication for log ingestion.
📊 Real-time status grid for each API.
📝 Trace Logs with timestamps, console logs, and error details.
📈 Analytics dashboard: uptime %, response times, error rates.
⚙️ Config management: enable/disable APIs, scheduling, request limits.
🌐 Deployed full-stack on Render with MongoDB Atlas.

🛠 Tech Stack :-

Frontend: React (Vite), Axios, Recharts, React Router
Backend: Node.js, Express.js, Mongoose
Database: MongoDB Atlas
Hosting: Render (Static site + Web Service)
Auth: API Key Middleware

📂 Project Structure :-
tracer-app/
  frontend/           # React + Vite app
    src/
    package.json
  backend/            # Node/Express API
    src/
      models/
      routes/
      middleware/
      config/
    package.json
  .gitignore
  README.md

⚙️ Local Setup :-
1. Clone Repo
git clone https://github.com/<your-username>/tracer-app.git
cd tracer-app

2. Backend Setup
cd backend
npm install

3.Create .env inside backend/ :-
PORT=4000
MONGODB_URI=<your-mongo-atlas-uri>
TRACER_API_KEY=<your-api-key>
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development

4.Start backend :-
npm run dev

5. Frontend Setup :-
cd ../frontend
npm install

6.Create .env.local inside frontend/ :-
VITE_API_BASE=http://localhost:4000/api

7.Start frontend :-
npm run dev


🔗 API Endpoints :-

1.Configs:-
GET /api/configs → list configs
POST /api/configs → add config
PUT /api/configs/:id → update config
DELETE /api/configs/:id → delete config

2.Keys :-
GET /api/keys → list keys
POST /api/keys → add new API key

3.Tracer :-
POST /api/tracer/log → add tracer log (requires x-api-key)
GET /api/tracer/logs → get logs (supports filters: apiName, from, to, pagination)
GET /api/tracer/stats → aggregated stats (uptime %, avg response time, errors, etc.)
  
