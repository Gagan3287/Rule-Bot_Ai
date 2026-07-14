# RuleBot – Intelligent Rule-Based Chatbot

RuleBot is a robust, full-stack, rule-based chatbot system built as a part of the **CodSoft Artificial Intelligence Internship (Task 1)**. It serves as an educational showcase of deterministic Natural Language Processing (NLP) using strict rule matching frameworks instead of large language models (LLMs) or neural network training algorithms.

---

## 📌 CodSoft AI Internship Task 1 Context
The objective of this task is to design a chatbot that answers user queries using pre-defined rules, demonstrating the fundamentals of rule-based artificial intelligence.
RuleBot fulfills this by implementing:
1. A **Modular Rule Engine** split into individual files for distinct intents.
2. A **Confidence-Based Priority Matching** mechanism that prefers exact keyword detections over regex constraints and fuzzy structures.
3. An **Interactive Web Interface** modeled after modern conversational interfaces (like ChatGPT) with autoscroll, typing effects, PDF transcript exporters, and light/dark configurations.
4. An **Admin Analytics Dashboard** demonstrating matched intents distribution, session metrics, and query logs (including unknown queries).

---

## 🧠 AI Concepts & matching Strategies Used

RuleBot relies entirely on pre-programmed logic, showcasing the following computer science and early AI concepts:

1. **Text Normalization**: Input is cleaned by trimming spacing, converting characters to lowercase, and removing ending punctuation (e.g., matching "Hello!" or "hello?" to "hello").
2. **Confidence Scoring**: Rules assign a score between `0.0` (no match) and `1.0` (exact hit) to rank matches:
   - **Confidence 1.0 (Exact Keyword Detections)**: Direct exact comparisons with lists of keywords (highest priority).
   - **Confidence 0.8 (Regex Constraints)**: Regular expression mapping scanning for flexible queries (e.g., `what is python`, `tell me about python`).
   - **Confidence 0.6 (Fuzzy Matches)**: Checking if general terms exist anywhere in the text as a fallback.
3. **Intent Selection**: Evaluates all rules, selects the highest confidence score, and triggers the `Unknown` fallback only if the highest candidate is below a threshold `< 0.3`.
4. **No Machine Learning**: There is no training phase, neural networks, or weights adjustments. Output is completely explainable, predictable, and runs in `< 15ms` with zero hallucination.

---

## ⚙️ Rule Engine Flow Diagram

Below is the matching pipeline representing how a user query is processed:

```
        User Input
            │
            ▼
   Text Normalization (lowercase, strip ending punctuation)
            │
            ▼
   Keyword Matching (check exact keywords -> score 1.0)
            │
            ▼
    Regex Matching (match regular expressions -> score 0.8)
            │
            ▼
  Pattern/Fuzzy matching (check word occurrences -> score 0.6)
            │
            ▼
   Intent Selection (pick highest score; if best < 0.3, fallback to Unknown)
            │
            ▼
   Response Generation & Logging (return text & match logs to db)
```

Every matched intent is logged in the backend terminal in a structured format:
`[RuleEngine] Query: 'python?' | Intent: 'Python' | Confidence: 1.00`

---

## 📂 Project Folder Structure

```
TASK1/
├── backend/            # Python FastAPI web application
│   ├── main.py         # Entry routes, CORS, database sync
│   ├── engine.py       # Co-ordinator evaluating rules by confidence
│   ├── auth.py         # Secure password cryptcontext (bcrypt) & JWT sessions
│   ├── database.py     # Connection engine (PostgreSQL or SQLite fallback)
│   ├── models.py       # SQLAlchemy database schemas
│   ├── schemas.py      # Pydantic schemas validating models
│   ├── rules/          # Modular rule intent classes
│   │   ├── base.py         # Base rule interface
│   │   ├── greetings.py    # Greeting intent (score 1.0/0.8)
│   │   ├── farewells.py    # Farewell intent (score 1.0/0.8)
│   │   ├── help.py         # Command manual intent
│   │   ├── date.py         # Today's date intent
│   │   ├── time.py         # System time intent
│   │   ├── weather.py      # Climate mock response intent
│   │   ├── programming.py  # Generic code query intent
│   │   ├── python.py       # Python intent (score 1.0/0.8/0.6)
│   │   ├── java.py         # Java intent (score 1.0/0.8/0.6)
│   │   ├── ai.py           # Artificial Intelligence intent
│   │   ├── ml.py           # Machine Learning intent
│   │   ├── web_dev.py      # Web development terms intent
│   │   ├── college.py      # Academic admission intent
│   │   ├── faqs.py         # General FAQs (name, creator, origin)
│   │   └── unknown.py      # Fallback fallback (confidence < 0.3)
│   ├── requirements.txt # Python dependencies
│   ├── test_engine.py  # Verification tests
│   └── Dockerfile      # Backend docker config
├── frontend/           # Next.js 15 App Router website
│   ├── src/
│   │   ├── app/        # Pages (Landing, Login, Register, Chat, Admin, How-It-Works)
│   │   ├── context/    # Global AuthContext & ThemeContext
│   │   └── lib/        # Tailwind styling helpers
│   ├── package.json    # Next.js configurations
│   └── Dockerfile      # Frontend production server docker config
├── database/           # Prisma schema directory
│   └── schema.prisma   # PostgreSQL blueprint
├── docs/               # Technical manual
│   └── API.md          # OpenAPI / Swagger guidelines
├── docker-compose.yml  # Multi-container orchestration tool
└── README.md           # This readme manual
```

---

## 🛠️ Installation & Setup Guide

### Method A: Single Command Docker Run (PostgreSQL DB)
If you have Docker installed, you can start the entire Postgres, FastAPI, and Next.js stack with one command from the project root:
```bash
docker-compose up --build
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Method B: Local Desktop Manual Setup (Zero Configuration SQLite Fallback)
To make local testing extremely easy without needing to configure a local PostgreSQL instance, the backend database falls back to a local SQLite file (`rulebot.db`) automatically if no database environment variable is found.

#### 1. Setup Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Activate python virtual environment:
   ```bash
   python -m venv venv
   # Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install package requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

#### 2. Setup Frontend
1. In a new terminal window, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
4. Access the site at [http://localhost:3000](http://localhost:3000).

---

## 📝 API Documentation

FastAPI dynamically generates the OpenAPI schema. When the backend is active, view the interactive documentation at:
- **Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Schema View**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🚀 Deployment Instructions

### Next.js Frontend (Vercel)
1. Link your repository in the Vercel Dashboard.
2. Set the environment variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed FastAPI backend URL.
3. Deploy!

### FastAPI Backend & PostgreSQL (Render)
1. **Database**: Spin up a Render PostgreSQL database instance and copy the external connection string.
2. **FastAPI Web Service**: Create a new Web Service on Render linking your repository:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Env Variables:
     - `DATABASE_URL`: Your Render PostgreSQL database connection string.
     - `JWT_SECRET`: A secure passphrase.

---

## 📈 Future Improvements
- **Levenshtein Distance**: Integrate fuzzy spelling checks for keyword matches (e.g. matching "pythn" to "python" with 0.9 confidence).
- **Synonym Lists**: Map intent words to dynamic arrays of synonyms to expand vocabulary without coding new rules.
- **Context Preservation**: Save short conversational state variables (e.g., remembering if the user asked for temperature in Celsius or Fahrenheit).
