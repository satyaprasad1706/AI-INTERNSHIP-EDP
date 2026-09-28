# Resume-to-Job Matching Platform

> **Final B.Tech IT Capstone Project**  
> *A Production-Quality Full-Stack AI/NLP-Powered Recruitment Screening, Skill Matching, Ranking, and Shortlisting Platform combining Weeks 1 through 8.*

---

## 📌 1. Project Overview

The **Resume-to-Job Matching Platform** is an enterprise-grade recruitment screening application designed to streamline the candidate evaluation lifecycle. Recruiter workflows often suffer from manual resume screening bottlenecks, arbitrary keyword searches, and opaque ranking algorithms. 

This platform solves those challenges by implementing an end-to-end automated pipeline:
1. **Multi-format Ingestion:** Accepts mixed batches of `.pdf` (via PyMuPDF) and `.txt` resumes.
2. **Information Extraction:** Extracts candidate contact info (Email, Phone, LinkedIn, GitHub), education, and experience using robust regular expressions and spaCy NLP Named Entity Recognition.
3. **Dynamic Skill Mining:** Scans both resumes and Job Descriptions against an extensible technical skills database (`data/skills.txt`).
4. **Deterministic Match Scoring:** Computes transparent, 100% audit-proof match scores without hidden weights or artificial hallucinations.
5. **Ranking & Shortlisting:** Automatically orders candidates by Match Score DESC and applies recruiter-defined rules (Score Threshold $\ge X\%$ or Top $N$ candidates).
6. **Academic ML/NLP Labs:** Includes dedicated experimental modules demonstrating supervised Linear Regression (Week 2) and TF-IDF Naive Bayes text classification (Week 3).

---

## 🏛️ 2. Architectural Diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NEXT.JS 15 FRONTEND                             │
│                                                                             │
│  [Recruiter Dashboard]   [Batch Upload Zone]   [Candidate Directory]       │
│  [Job Manager]           [Matching Engine]     [Leaderboard & Shortlist]    │
│  [Comparison Matrix]     [ML & NLP Analytics Lab]                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / FormData
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP ROUTER API LAYER                        │
│                                                                             │
│  /api/candidates       /api/jobs          /api/matches    /api/dashboard    │
│  /api/skills           /api/analytics     /api/sample     /api/export-csv   │
└──────────────────┬──────────────────────────────────────────┬───────────────┘
                   │                                          │
       Prisma ORM │ SQLite Persistence           REST Proxy  │ HTTP Port 8000
                   ▼                                          ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────────┐
│          SQLITE DATABASE             │   │    FASTAPI NLP/ML MICROSERVICE   │
│                                      │   │                                  │
│  • Candidate Table (JSON skills/kw)  │   │  • PyMuPDF (PDF Parser)          │
│  • Job Table (Required Skills)       │   │  • spaCy en_core_web_sm (NLP)    │
│  • Match Table (Scores, Ranks)       │   │  • Regex Extraction Engine       │
└──────────────────────────────────────┘   │  • Dynamic skills.txt Loader     │
                                           │  • Scikit-Learn ML Experiments   │
                                           └──────────────────────────────────┘
```

---

## ⚙️ 3. Technology Stack

### Frontend & Application Layer
- **Framework:** Next.js 15 (App Router, Server Components & Client Components)
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 3.4 (Modern SaaS Slate/Blue theme, responsive layout)
- **Icons:** Lucide React
- **Database & ORM:** SQLite 3 with Prisma ORM 6.4

### Backend NLP & Machine Learning Service
- **Microservice Framework:** FastAPI & Uvicorn (Asynchronous REST API)
- **PDF Extraction:** PyMuPDF (`fitz` / `pymupdf` v1.28)
- **NLP & Linguistics:** spaCy 3.8 (`en_core_web_sm` model, POS tagging, noun chunks, lemmatization)
- **Data Science:** Pandas 3.0 & NumPy 2.4
- **Machine Learning:** Scikit-Learn 1.8 (Linear Regression, TF-IDF Vectorizer, Multinomial Naive Bayes)

---

## 📊 4. The 10-Step Capstone Recruitment Pipeline

```text
1. Upload Resumes (PDF & TXT Batch)
        ↓
2. File Format Detection & PyMuPDF / TXT Parsing
        ↓
3. Regex Extraction (Email, Phone, LinkedIn, GitHub, Exp, Edu)
        ↓
4. spaCy NLP Pipeline (Tokenization, POS, Lemmatization, Keyword Extraction)
        ↓
5. Dynamic Technical Skill Extraction (from data/skills.txt)
        ↓
6. Create / Upload Job Description & Extract Required Skills
        ↓
7. Deterministic Skill Matching (Matching Skills vs Required Skills)
        ↓
8. Calculate Transparent Match Score (%)
        ↓
9. Rank Candidates (Match Score DESC)
        ↓
10. Apply Shortlisting Rules & Export Comprehensive CSV Reports
```

---

## 🎯 5. Core Scoring Formula (Week 5)

The platform adheres to an exact, audit-proof deterministic scoring model:

$$\text{Match Score} = \left( \frac{\text{Matching Technical Skills}}{\text{Total Required Job Skills}} \right) \times 100$$

### Example Calculation:
- **Required Job Skills ($N = 6$):** `Python`, `SQL`, `Machine Learning`, `Pandas`, `Git`, `AWS`
- **Candidate Extracted Skills:** `Python`, `SQL`, `Machine Learning`, `Pandas`, `Java`, `React`
- **Matching Skills ($M = 4$):** `Python`, `SQL`, `Machine Learning`, `Pandas`
- **Missing Skills ($K = 2$):** `Git`, `AWS`

$$\text{Match Score} = \frac{4}{6} \times 100 = 66.67\%$$

---

## 🚀 6. Installation & Step-by-Step Setup Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22+ recommended)
- **Python:** v3.10 to v3.14
- **npm** or **yarn**

### Step 1: Clone Repository & Install Node Dependencies
```bash
cd "j:\EDP INTERNSHIP\FINAL"
npm install
```

### Step 2: Initialize SQLite Database with Prisma
```bash
npx prisma db push
```

### Step 3: Install Python NLP Dependencies
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Step 4: Run the Python NLP Microservice (Port 8000)
```bash
python python/server.py
```
*The FastAPI backend will start on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### Step 5: Start the Next.js Development Server (Port 3000)
In a separate terminal:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 7. Project Structure

```text
FINAL/
├── app/
│   ├── page.tsx                 # Modern Hero Landing Page & Capstone Overview
│   ├── dashboard/page.tsx       # Recruiter Dashboard (KPIs, Charts, Recent Activity)
│   ├── resumes/page.tsx         # Drag-and-Drop Batch Upload (PDF/TXT) with Live Status
│   ├── candidates/page.tsx      # Candidate Directory & Search/Filter Screener
│   ├── candidates/[id]/page.tsx # Detailed Candidate Profile & Raw/Cleaned Text Viewer
│   ├── jobs/page.tsx            # Job Description Manager & Skill Extraction
│   ├── matching/page.tsx        # Skill Matching Engine & Transparent Score Breakdown
│   ├── ranking/page.tsx         # Candidate Leaderboard (Sorted by Match Score DESC)
│   ├── shortlist/page.tsx       # Shortlisted Candidates View & CSV Exporter
│   ├── compare/page.tsx         # Side-by-side Candidate Comparison Matrix
│   ├── analytics/page.tsx       # Academic ML (Linear Regression) & NLP (TF-IDF/NB) Lab
│   ├── layout.tsx               # Root Layout with Sidebar & Header
│   └── api/                     # Next.js API Routes (candidates, jobs, matches, analytics, csv)
│
├── components/
│   ├── layout/                  # Sidebar, Header with Health Indicator, WorkflowBanner
│   └── ui/                      # Badges, Gauges, Modals
│
├── lib/
│   ├── db.ts                    # Prisma SQLite Client Singleton
│   ├── types.ts                 # TypeScript Interfaces
│   ├── export-csv.ts            # CSV Generation & Browser Download Handlers
│   └── utils.ts                 # Tailwind cn & Score Formatting Helpers
│
├── python/
│   ├── server.py                # FastAPI Backend Service (Port 8000)
│   ├── resume_processor.py      # PyMuPDF/TXT Parser, Regex & Dynamic Skill Extraction
│   ├── nlp_processor.py         # spaCy Tokenizer, POS, Lemmatizer & Keyword Miner
│   ├── matcher.py               # Deterministic Match & Ranking Algorithms
│   ├── ml_experiments.py        # Week 2 Regression & Week 3 TF-IDF Naive Bayes Modules
│   ├── create_sample_data.py    # Generates 10 mixed PDF/TXT Resumes + Sample Jobs
│   └── test_backend.py          # Automated Unit & Integration Test Suite
│
├── data/
│   ├── skills.txt               # Extensible Technical Skill Dictionary (100+ Skills)
│   └── sample/                  # Pre-generated sample PDF & TXT Resumes and Jobs
│
├── prisma/
│   ├── schema.prisma            # SQLite Database Schema
│   └── dev.db                   # Local SQLite Database File
│
├── requirements.txt             # Python Package Dependencies
├── package.json                 # Next.js Application Dependencies
└── README.md                    # Project Documentation
```

---

## 🧪 8. Automated Testing

Run the Python backend test suite to verify parsing, regex extraction, deterministic scoring, and ML experiments:

```bash
python python/test_backend.py
```

Expected Output:
```text
.......
----------------------------------------------------------------------
Ran 7 tests in 0.172s

OK
```

---

## 🎓 9. Viva / Defense Q&A Cheatsheet

| Question | Answer |
| :--- | :--- |
| **How does PDF extraction work?** | We utilize `PyMuPDF` (`fitz`), reading text streams page by page to handle multi-page, non-standard, or corrupted documents gracefully. |
| **How are skills extracted without hardcoding?** | Skills are loaded dynamically from `data/skills.txt` at runtime. Regular expression word/symbol boundaries handle tricky cases like `C++`, `C#`, `.NET`, `Node.js`, and `React`. |
| **Why is Match Scoring deterministic?** | To ensure 100% transparency for recruiters and eliminate LLM hallucinations or hidden biased weights. Every point in the match score corresponds directly to a matched skill. |
| **What was the role of Week 2 & 3 in the project?** | Week 2 covered foundational supervised ML (Linear Regression with train/test splits and evaluation metrics MAE/MSE/RMSE/$R^2$). Week 3 covered NLP text preprocessing, TF-IDF vectorization, and Multinomial Naive Bayes domain classification. These are integrated into the interactive **ML & NLP Analytics Lab** as academic learning modules. |

---

## 🔮 10. Future Scope

1. **Semantic Embeddings:** Optional hybrid scoring using Sentence-Transformers (`all-MiniLM-L6-v2`) for soft synonym matching (e.g. `ReactJS` $\approx$ `React`).
2. **Automated Interview Scheduling:** Integration with Google Calendar and Outlook APIs for shortlisted candidates.
3. **OCR for Scanned Image Resumes:** Integration of Tesseract OCR for image-only PDF scans.
4. **Cloud Database Deployment:** Multi-tenant PostgreSQL deployment via Supabase or AWS RDS.

---

## 👨‍💻 Capstone Information

- **Project:** Resume-to-Job Matching Platform
- **Course:** B.Tech Information Technology Capstone Project
- **Duration:** Weeks 1 through 8
- **License:** MIT
