# Week 5: Resume-to-Job Description Matching & Scoring

## 📌 Project Overview
An automated Python matching system that parses a technical Job Description, compares required skills and spaCy NLP keywords against Week 4 resume data, calculates weighted match scores, computes TF-IDF Cosine Similarity, and exports sorted results to CSV.

---

## 💡 Key Learning Concepts
1. **Job Description Skill Extraction**: Boundary-aware skill parsing from `job_description.txt` using `skills.txt`.
2. **Skill Set Arithmetic**: Performing set operations (`intersection`, `difference`) to calculate `Matching Skills`, `Missing Skills`, and `Additional Skills`.
3. **Rule-Based Match Scoring**: Computing transparent weighted scores (70% Skill Score + 30% Keyword Score) without black-box ML predictions.
4. **TF-IDF Cosine Similarity**: Computing text similarity percentages using `scikit-learn`.

---

## 🛠️ Project Structure & Setup

```
WEEK -5/
├── week5_matcher.py            # Main matching & scoring script
├── skills.txt                  # Technical skills dictionary
├── requirements.txt            # Dependencies (pandas, PyMuPDF, spacy, scikit-learn)
├── README.md                   # Learning guide
├── job_descriptions/
│   └── job_description.txt     # Target Job Description input
└── output/
    └── resume_job_matching_results.csv # Generated results CSV
```

### Installation
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### How to Run
```bash
cd "WEEK -5"
python week5_matcher.py
```

---

## ⚙️ Processing Pipeline Workflow
```
Job Description ➔ Skill & Keyword Extraction ➔ Load Week 4 Resume CSV ➔ Set Arithmetic (Matching/Missing Skills) ➔ 70/30 Weighted Scoring ➔ TF-IDF Cosine Sim ➔ Sort & CSV Export
```
