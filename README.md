# EDP Internship Journal

My weekly learning log for the EDP Internship.

---

## Week 1: Data Cleaning with Pandas

Check out the full notes: [WEEK-1/README.md](file:///j:/EDP%20INTERNSHIP/WEEK-1/README.md)

### Quick Summary
- Loaded `diamonds.csv` and `Mall_Customers.csv`.
- Checked data shapes, data types, missing values, and summary stats.
- Renamed messy column names to clean formats (`Annual_Income`, `Spending_Score`).
- Saved clean output to `clean_mall_customers.csv`.

---

## Week 2: Linear Regression Model

Check out the full notes: [WEEK-2/README.md](file:///j:/EDP%20INTERNSHIP/WEEK-2/README.md)

### Quick Summary
- Encoded categorical variables (`cut`, `color`, `clarity`) using `LabelEncoder`.
- Split dataset into 80% training and 20% testing sets using `train_test_split`.
- Trained a Multiple Linear Regression model to predict diamond prices.
- Evaluated performance achieving an R² score of 0.885 (~88.5% accuracy).
- Tested predictions on new custom diamond data points.

---

## Week 3: SMS Spam Classification Model

Check out the full notes: [WEEK-3/README.md](file:///j:/EDP%20INTERNSHIP/WEEK%20-3/README.md)

### Quick Summary
- Loaded `SMSSpamCollection` dataset, cleaned text, and dropped duplicate entries.
- Applied regex text cleaning (lowercasing, punctuation removal, whitespace trimming).
- Converted text into numerical features using `TfidfVectorizer`.
- Trained a `MultinomialNB` (Multinomial Naive Bayes) classification model.
- Evaluated model achieving an accuracy of **95.55%** on test messages.
- Created a custom inference function `predict_message()` for real-time spam detection.

---

## Week 4: Technical Resume Screener (NLP & Regex Pipeline)

Check out the full notes: [WEEK -4/README.md](file:///j:/EDP%20INTERNSHIP/WEEK%20-4/README.md)

### Quick Summary
- Extracted raw text from candidate PDF resumes using PyMuPDF (`fitz`).
- Extracted email, phone number, LinkedIn, GitHub, and experience using Regex pattern matching.
- Developed boundary-aware matching to scan technical skills from `skills.txt` without false positives.
- Filtered NOUN and PROPN tokens, removed stop words, and lemmatized keywords using spaCy (`en_core_web_sm`).
- Automated multi-PDF folder processing and saved extracted structured data to `output/resume_extracted_data.csv`.

---

## Week 5: Resume-to-Job Description Matching & Scoring

Check out the full notes: [WEEK -5/README.md](file:///j:/EDP%20INTERNSHIP/WEEK%20-5/README.md)

### Quick Summary
- Parsed technical Job Description from `job_descriptions/job_description.txt`.
- Extracted required JD skills and spaCy NLP keywords (`en_core_web_sm`).
- Accessed Week 4 resume data (`output/resume_extracted_data.csv`) from the parent workspace.
- Performed set arithmetic to identify matching, missing, and additional technical skills.
- Calculated weighted match scores (70% Skill Score + 30% Keyword Score) and TF-IDF Cosine Similarity (`scikit-learn`).
- Sorted candidates by `Final Match Score` descending and saved results to `output/resume_job_matching_results.csv`.

---

## Week 6: Candidate Resume Ranking & Shortlisting

Check out the full notes: [WEEK -6/README.md](file:///j:/EDP%20INTERNSHIP/WEEK%20-6/README.md)

### Quick Summary
- Loaded Week 5 matching results (`output/resume_job_matching_results.csv`) across the workspace.
- Sorted candidate scores in descending order and assigned deterministic candidate Ranks (Rank 1 = highest score).
- Applied configurable shortlisting criteria (`SHORTLIST_THRESHOLD = 70%` or `TOP_N = 10`).
- Generated statistical summaries and score distribution analysis (90-100%, 80-89%, 70-79%, 60-69%, <60%).
- Saved outputs to `output/ranked_candidates.csv` and `output/shortlisted_candidates.csv`.
