# Week 4: Technical Resume Screener (NLP & Regex Pipeline)

## 📌 Project Overview
An automated, lightweight Python pipeline that parses candidate PDF resumes, extracts structured contact information, identifies technical skills via dictionary matching, extracts key NLP terms with spaCy, and exports aggregated data into CSV format.

---

## 💡 Key Learning Concepts
1. **PDF Text Extraction**: Reading raw text across multi-page PDFs using PyMuPDF (`fitz`).
2. **Regex Entity Parsing**: Extracting email addresses, telephone numbers, LinkedIn URLs, GitHub profiles, and years of experience using regular expressions.
3. **Boundary-Aware Skill Matching**: Matching skills from `skills.txt` using regex boundaries (`r'(?<![a-zA-Z0-9])'`) to prevent false-positive partial matches (e.g., distinguishing `C++` from `C`).
4. **spaCy NLP Keyword Tagging**: Tokenizing, lemmatizing, filtering stop words, and isolating `NOUN` / `PROPN` tokens using `en_core_web_sm`.

---

## 🛠️ Project Structure & Setup

```
WEEK -4/
├── resume_screener.py          # Main execution script
├── skills.txt                  # Technical skills dictionary (one per line)
├── requirements.txt            # Dependencies (pandas, PyMuPDF, spacy)
├── README.md                   # Learning guide
├── resumes/                    # Folder containing candidate PDF resumes
└── output/
    └── resume_extracted_data.csv# Generated structured dataset
```

### Installation
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### How to Run
```bash
cd "WEEK -4"
python resume_screener.py
```

---

## ⚙️ Processing Pipeline Workflow
```
PDF Resume ➔ PyMuPDF Text Extraction ➔ Text Cleaning ➔ Regex Extractions ➔ skills.txt Matching ➔ spaCy NLP Keywords ➔ Pandas DataFrame ➔ CSV Output
```
