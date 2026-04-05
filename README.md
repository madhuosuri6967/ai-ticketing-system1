# ⚡ AI Ticketing System

A smart internal ticketing platform where Claude AI reads incoming tickets,
auto-resolves simple ones, and routes complex ones to the right department and employee.

## Tech Stack
- **Backend** — Python · FastAPI · SQLite · Anthropic SDK
- **Frontend** — React 18 · Vite · CSS Variables (no extra UI lib needed)
- **AI** — Claude (claude-opus-4-5) via Anthropic API

## Quick Start

### 1. Clone & set up backend
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env` file in `backend/`:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Run the API server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Set up frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:3000**

## Features (All 6 Modules)
1. **Ticket Intake & AI Analysis** — category, severity, sentiment, confidence score
2. **Auto-Resolution Engine** — AI responds to simple tickets; Yes/No feedback loop
3. **Intelligent Routing** — department + best-fit employee selected by skill/load/availability
4. **Employee Directory** — add/edit/deactivate; live ticket load per agent
5. **Ticket Lifecycle** — full status flow, internal notes, AI-drafted agent replies, timeline
6. **Analytics Dashboard** — KPIs, dept load charts, top categories, severity distribution

## Project Structure
```
ai-ticketing-system/
├── backend/
│   ├── main.py          ← FastAPI app + all routes + AI logic
│   ├── requirements.txt
│   └── .env             ← ANTHROPIC_API_KEY goes here
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js        ← all fetch calls
    │   ├── styles.css
    │   └── components/
    │       ├── SubmitTicket.jsx
    │       ├── TicketList.jsx
    │       ├── TicketDetail.jsx
    │       ├── Employees.jsx
    │       ├── Analytics.jsx
    │       └── ui.jsx    ← shared badges, helpers
    ├── index.html
    ├── vite.config.js
    └── package.json
```
