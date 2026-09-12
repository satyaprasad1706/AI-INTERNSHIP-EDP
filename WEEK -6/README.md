# Week 6: Candidate Resume Ranking & Shortlisting

## 📌 Project Overview
An automated Python candidate ranking and shortlisting system that processes Week 5 match scores, assigns deterministic candidate Ranks (Rank 1..N), applies configurable shortlisting rules (Score Threshold $\ge 70\%$ or Top-N selection), and exports `output/ranked_candidates.csv` and `output/shortlisted_candidates.csv`.

---

## 💡 Key Learning Concepts
1. **Deterministic Candidate Ranking**: Sorting candidates by `Final Match Score` descending and assigning 1-indexed candidate Ranks.
2. **Configurable Shortlisting Rules**: Implementing threshold filtering (`SHORTLIST_THRESHOLD = 70`) and Top-N selection (`TOP_N = 10`).
3. **Distribution & Summary Analytics**: Aggregating candidate match scores into distribution buckets (90-100%, 80-89%, 70-79%, 60-69%, <60%).
4. **Cross-Folder Data Integration**: Reading Week 5 matching results (`resume_job_matching_results.csv`) across the `EDP INTERNSHIP` workspace.

---

## 🛠️ Project Structure & Setup

```
WEEK -6/
├── week6_ranking.py            # Main candidate ranking & shortlisting script
├── requirements.txt            # Dependencies (pandas)
├── README.md                   # Learning guide
└── output/
    ├── ranked_candidates.csv    # Full candidate ranking dataset
    └── shortlisted_candidates.csv # Shortlisted candidates dataset
```

### Installation
```bash
pip install -r requirements.txt
```

### How to Run
```bash
cd "WEEK -6"
python week6_ranking.py
```

---

## ⚙️ Processing Pipeline Workflow
```
Load Week 5 Results ➔ Validate Final Match Scores ➔ Sort Descending & Assign Ranks ➔ Apply Shortlisting Threshold (70%) ➔ Compute Statistics & Distribution ➔ CSV Exports
```
