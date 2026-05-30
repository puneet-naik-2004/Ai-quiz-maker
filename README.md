# 🧠 Ai quiz maker

AI-powered quiz generator — MERN Stack + MVC Pattern

---

## Folder Structure

```
Ai-quiz-maker/
│
├── backend/                        ← Node.js + Express API
│   ├── config/
│   │   └── db.js                   ← MongoDB connection
│   ├── models/                     ← (M) Mongoose schemas
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Attempt.js
│   ├── controllers/                ← (C) Business logic
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   └── attemptController.js
│   ├── routes/                     ← Express route definitions
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   └── attemptRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT protection
│   ├── services/
│   │   └── aiService.js            ← OpenAI GPT-4 wrapper
│   ├── index.js                    ← Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/                       ← React + Vite app
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     ← Global auth state
    │   ├── pages/                  ← (V) React page views
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── GeneratePage.jsx
    │   │   ├── QuizPage.jsx
    │   │   ├── ResultPage.jsx
    │   │   └── HistoryPage.jsx
    │   ├── utils/
    │   │   └── api.js              ← Axios instance with JWT
    │   ├── App.jsx                 ← Routes
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup & Run

### Step 1 — Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:
```
MONGO_URI=mongodb://localhost:27017/ai-quiz-maker
JWT_SECRET=any_random_secret_string
OPENAI_API_KEY=sk-your-openai-key
```

Start the backend:
```bash
npm run dev
# Runs on http://localhost:5000
```

### Step 2 — Setup Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user (auth required) |
| POST | `/api/quiz/generate` | Generate quiz from topic (auth) |
| GET  | `/api/quiz` | Get my quizzes (auth) |
| GET  | `/api/quiz/:id` | Get single quiz (auth) |
| DELETE | `/api/quiz/:id` | Delete quiz (auth) |
| POST | `/api/attempt` | Submit quiz answers (auth) |
| GET  | `/api/attempt/history` | Get my attempt history (auth) |

---

## Tech Stack

| | Tech |
|---|---|
| Frontend | React 18, React Router v6, Vite, Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenAI GPT-4o |
