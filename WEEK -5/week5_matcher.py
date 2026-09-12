import os
import re
from collections import Counter
import pandas as pd
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ==============================================================================
# 1. PATH RESOLUTION & FILE VALIDATION
# ==============================================================================

def resolve_input_paths(base_dir):
    """
    Resolves input file paths for Week 4 CSV output and skills dictionary,
    checking local WEEK -5 directory first, then fallback to WEEK -4 / Resume_Screener.
    """
    parent_dir = os.path.dirname(base_dir)

    # Candidate locations for Week 4 CSV output
    resume_csv_candidates = [
        os.path.join(base_dir, "output", "resume_extracted_data.csv"),
        os.path.join(parent_dir, "WEEK -4", "output", "resume_extracted_data.csv"),
        os.path.join(parent_dir, "WEEK -4", "Resume_Screener", "output", "resume_extracted_data.csv"),
        os.path.join(parent_dir, "Resume_Screener", "output", "resume_extracted_data.csv"),
    ]

    # Candidate locations for skills.txt
    skills_file_candidates = [
        os.path.join(base_dir, "skills.txt"),
        os.path.join(parent_dir, "WEEK -4", "skills.txt"),
        os.path.join(parent_dir, "WEEK -4", "Resume_Screener", "skills.txt"),
        os.path.join(parent_dir, "Resume_Screener", "skills.txt"),
    ]

    # Candidate locations for Job Description
    job_desc_candidates = [
        os.path.join(base_dir, "job_descriptions", "job_description.txt"),
        os.path.join(parent_dir, "WEEK -5", "job_descriptions", "job_description.txt"),
    ]

    resume_csv = next((p for p in resume_csv_candidates if os.path.exists(p)), None)
    skills_file = next((p for p in skills_file_candidates if os.path.exists(p)), None)
    job_desc_file = next((p for p in job_desc_candidates if os.path.exists(p)), None)

    return resume_csv, skills_file, job_desc_file


def validate_files(base_dir):
    """
    Validates that required files exist and displays helpful diagnostics.
    """
    resume_csv, skills_file, job_desc_file = resolve_input_paths(base_dir)

    if not resume_csv:
        print("\nERROR: Week 4 output file ('resume_extracted_data.csv') not found.")
        print("Please run 'python resume_screener.py' in the WEEK -4 directory first.")
        return False, None, None, None

    if not job_desc_file:
        print("\nERROR: Job Description file ('job_descriptions/job_description.txt') not found.")
        print("Please create 'job_descriptions/job_description.txt' containing your target job text.")
        return False, None, None, None

    if not skills_file:
        print("\nERROR: Technical skills dictionary file ('skills.txt') not found.")
        return False, None, None, None

    return True, resume_csv, skills_file, job_desc_file


def load_skills(skills_filepath):
    """Loads technical skills list from text file."""
    if not skills_filepath or not os.path.exists(skills_filepath):
        return []
    with open(skills_filepath, "r", encoding="utf-8") as f:
        skills = [line.strip() for line in f if line.strip()]
    return skills


def load_spacy_model(model_name="en_core_web_sm"):
    """Loads spaCy model safely."""
    try:
        return spacy.load(model_name)
    except Exception as e:
        print(f"ERROR: Could not load spaCy model '{model_name}'.")
        print("Run: python -m spacy download en_core_web_sm")
        raise e


# ==============================================================================
# 2. JOB DESCRIPTION PARSING
# ==============================================================================

def load_job_description(file_path):
    """Reads job description text file using UTF-8 encoding."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception as e:
        print(f"ERROR reading job description file: {e}")
        return ""


def extract_job_skills(job_text, skills_list):
    """
    Extracts required technical skills from the Job Description using 
    regex boundary matching against skills.txt.
    """
    detected_skills = []
    for skill in skills_list:
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, job_text, re.IGNORECASE):
            detected_skills.append(skill)
    return sorted(list(set(detected_skills)))


def extract_job_keywords(job_text, nlp, max_keywords=40):
    """
    Extracts key NOUN and PROPN entities from the Job Description using spaCy.
    """
    if not job_text:
        return []
    doc = nlp(job_text)
    keywords = []
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"]:
            if not token.is_stop and not token.is_punct and not token.is_space:
                clean_lemma = token.lemma_.strip().lower()
                if len(clean_lemma) > 2 and not clean_lemma.isdigit():
                    keywords.append(clean_lemma)
    keyword_counts = Counter(keywords)
    return [word for word, count in keyword_counts.most_common(max_keywords)]


# ==============================================================================
# 3. MATCHING LOGIC & SCORE CALCULATIONS
# ==============================================================================

def get_match_category(final_score):
    """
    Classifies the final score into a human-readable match category.
    Note: This is a transparent rule-based classification, not an ML prediction.
    """
    if final_score >= 90.0:
        return "Excellent Match"
    elif final_score >= 75.0:
        return "Strong Match"
    elif final_score >= 60.0:
        return "Moderate Match"
    elif final_score >= 40.0:
        return "Weak Match"
    else:
        return "Low Match"


def calculate_scores(matching_skills_count, total_job_skills_count, 
                     matching_keywords_count, total_job_keywords_count):
    """
    Calculates Skill Score, Keyword Score, and Weighted Final Score.
    
    Formulae:
      - Skill Match Score = (Matching Job Skills / Total Job Skills) * 100
      - Keyword Match Score = (Matching Keywords / Total Job Keywords) * 100
      - Final Score = (Skill Score * 0.70) + (Keyword Score * 0.30)
    """
    if total_job_skills_count > 0:
        skill_score = (matching_skills_count / total_job_skills_count) * 100
    else:
        skill_score = 0.0

    if total_job_keywords_count > 0:
        keyword_score = (matching_keywords_count / total_job_keywords_count) * 100
    else:
        keyword_score = 0.0

    skill_score = round(skill_score, 2)
    keyword_score = round(keyword_score, 2)
    final_score = round((skill_score * 0.70) + (keyword_score * 0.30), 2)

    return skill_score, keyword_score, final_score


def calculate_tfidf_similarity(job_text, resume_texts):
    """
    Calculates TF-IDF + Cosine Similarity between Job Description text 
    and resume texts. Returns similarity percentage scores (0.0 to 100.0).
    """
    if not job_text or not resume_texts:
        return [0.0] * len(resume_texts)

    documents = [job_text] + resume_texts
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        cosine_sims = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        return [round(float(sim) * 100, 2) for sim in cosine_sims]
    except Exception as e:
        print(f"Notice: Could not compute TF-IDF Cosine Similarity ({e})")
        return [0.0] * len(resume_texts)


def compare_experience(resume_exp, job_text):
    """Basic experience presence check."""
    if not resume_exp or pd.isna(resume_exp):
        return "Not Specified"
    return "Yes" if str(resume_exp).strip() else "Not Specified"


# ==============================================================================
# 4. UNIT TEST SUITE
# ==============================================================================

def run_unit_tests(skills_list):
    """
    Runs automated unit tests to verify algorithm correctness and edge cases.
    """
    print("\n" + "=" * 60)
    print("RUNNING UNIT TESTS")
    print("=" * 60)

    # Test 1: High Matching Skills
    job_skills_1 = {"python", "sql", "git", "docker", "machine learning"}
    res_skills_1 = {"python", "sql", "git", "docker", "machine learning", "java"}
    match_1 = res_skills_1.intersection(job_skills_1)
    s_score, _, _ = calculate_scores(len(match_1), len(job_skills_1), 0, 0)
    assert s_score == 100.0, f"Test 1 failed: Expected 100.0, got {s_score}"
    print("[PASS] Test 1: High matching skills (100% skill score)")

    # Test 2: Moderate / Partial Matching Skills
    job_skills_2 = {"python", "sql", "git", "docker", "aws"}
    res_skills_2 = {"python", "sql", "git"}
    match_2 = res_skills_2.intersection(job_skills_2)
    s_score_2, _, _ = calculate_scores(len(match_2), len(job_skills_2), 0, 0)
    assert s_score_2 == 60.0, f"Test 2 failed: Expected 60.0, got {s_score_2}"
    print("[PASS] Test 2: Partial matching skills (3/5 skills = 60.0%)")

    # Test 3: Zero Matching Skills
    job_skills_3 = {"docker", "kubernetes", "aws"}
    res_skills_3 = {"python", "sql"}
    match_3 = res_skills_3.intersection(job_skills_3)
    s_score_3, _, _ = calculate_scores(len(match_3), len(job_skills_3), 0, 0)
    assert s_score_3 == 0.0, f"Test 3 failed: Expected 0.0, got {s_score_3}"
    print("[PASS] Test 3: Zero matching skills (0.0% skill score)")

    # Test 4: Empty Resume Skills
    match_4 = set().intersection(job_skills_3)
    s_score_4, _, _ = calculate_scores(len(match_4), len(job_skills_3), 0, 0)
    assert s_score_4 == 0.0, f"Test 4 failed: Expected 0.0, got {s_score_4}"
    print("[PASS] Test 4: Empty resume skills list (0.0%)")

    # Test 5: Zero Job Description Skills (Division by zero protection)
    s_score_5, k_score_5, f_score_5 = calculate_scores(0, 0, 0, 0)
    assert s_score_5 == 0.0 and f_score_5 == 0.0, "Test 5 failed"
    print("[PASS] Test 5: Zero JD skills division-by-zero protection")

    print("All 5 unit tests passed successfully!\n" + "=" * 60)


# ==============================================================================
# 5. MAIN PROGRAM EXECUTION
# ==============================================================================

def main():
    print("=" * 60)
    print("WEEK 5 - RESUME TO JOB DESCRIPTION MATCHING & SCORING")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    valid, resume_csv, skills_file, job_desc_file = validate_files(base_dir)

    if not valid:
        return

    output_matching_csv = os.path.join(base_dir, "output", "resume_job_matching_results.csv")

    print(f"Reading Week 4 Resume CSV from: {resume_csv}")
    print(f"Reading Technical Skills from:  {skills_file}")
    print(f"Reading Job Description from:   {job_desc_file}")

    # Load Skills & spaCy model
    skills_list = load_skills(skills_file)
    nlp = load_spacy_model("en_core_web_sm")

    # Run automated unit tests first
    run_unit_tests(skills_list)

    # Load Job Description
    print("Loading Job Description...")
    job_text = load_job_description(job_desc_file)
    if not job_text:
        print("ERROR: Job Description file is empty.")
        return
    print("Job Description loaded successfully.")

    # Extract Job Description Skills & Keywords
    print("\nExtracting Job Description skills & keywords...")
    job_skills_list = extract_job_skills(job_text, skills_list)
    job_keywords_list = extract_job_keywords(job_text, nlp, max_keywords=40)

    print(f"Required technical skills detected ({len(job_skills_list)}):")
    print("  " + ", ".join(job_skills_list) if job_skills_list else "  None detected.")

    # Load Week 4 Resume CSV Data
    print(f"\nLoading Week 4 resume data from '{resume_csv}'...")
    df_resumes = pd.read_csv(resume_csv)
    total_resumes = len(df_resumes)
    print(f"Resumes loaded: {total_resumes}\n")

    # Prepare Skill Case Mapping for Clean Display
    skill_case_map = {s.lower(): s for s in skills_list}
    job_skills_lower = set(s.lower() for s in job_skills_list)
    job_keywords_set = set(k.lower() for k in job_keywords_list)

    # Process Resumes
    print("=" * 60)
    print("MATCHING RESUMES AGAINST JOB DESCRIPTION")
    print("=" * 60)

    results = []
    resume_combined_texts = []

    for idx, row in df_resumes.iterrows():
        resume_file = str(row.get("Resume", f"Resume_{idx+1}"))
        candidate_name = str(row.get("Name", "")) if pd.notna(row.get("Name")) else "Not Found"
        email = str(row.get("Email", "")) if pd.notna(row.get("Email")) else ""
        phone = str(row.get("Phone", "")) if pd.notna(row.get("Phone")) else ""
        education = str(row.get("Education", "")) if pd.notna(row.get("Education")) else ""
        experience = str(row.get("Experience", "")) if pd.notna(row.get("Experience")) else ""

        # Parse Resume Skills
        raw_skills = str(row.get("Skills", "")) if pd.notna(row.get("Skills")) else ""
        resume_skills_raw = [s.strip() for s in raw_skills.split(",") if s.strip()]
        resume_skills_lower = set(s.lower() for s in resume_skills_raw)

        # Parse Resume Keywords
        raw_keywords = str(row.get("Keywords", "")) if pd.notna(row.get("Keywords")) else ""
        resume_keywords_raw = [k.strip().lower() for k in raw_keywords.split(",") if k.strip()]
        resume_keywords_set = set(resume_keywords_raw)

        # Combined text for TF-IDF
        combined_text = f"{raw_skills} {raw_keywords}"
        resume_combined_texts.append(combined_text)

        # Perform Skill Arithmetic
        matching_lower = resume_skills_lower.intersection(job_skills_lower)
        missing_lower = job_skills_lower - resume_skills_lower
        additional_lower = resume_skills_lower - job_skills_lower

        # Map back to original capitalization
        matching_skills = sorted([skill_case_map.get(s, s.title()) for s in matching_lower])
        missing_skills = sorted([skill_case_map.get(s, s.title()) for s in missing_lower])
        additional_skills = sorted([skill_case_map.get(s, s.title()) for s in additional_lower])

        # Keyword overlap
        matching_keywords_set = resume_keywords_set.intersection(job_keywords_set)

        # Calculate Scores
        skill_score, keyword_score, final_score = calculate_scores(
            len(matching_lower), len(job_skills_lower),
            len(matching_keywords_set), len(job_keywords_set)
        )

        match_cat = get_match_category(final_score)

        results.append({
            "Resume": resume_file,
            "Name": candidate_name,
            "Email": email,
            "Phone": phone,
            "Skills": ", ".join(sorted(resume_skills_raw)),
            "Matching Skills": ", ".join(matching_skills),
            "Missing Skills": ", ".join(missing_skills),
            "Additional Skills": ", ".join(additional_skills),
            "Skill Match Score": skill_score,
            "Keyword Match Score": keyword_score,
            "Final Match Score": final_score,
            "Match Category": match_cat,
            "Experience": experience,
            "Education": education,
        })

    # Calculate TF-IDF Cosine Similarity
    print(f"Calculating TF-IDF Cosine Similarity for {total_resumes} resumes...")
    tfidf_sim_scores = calculate_tfidf_similarity(job_text, resume_combined_texts)
    for i, res in enumerate(results):
        res["Text Similarity Score"] = tfidf_sim_scores[i]

    # Convert to DataFrame & Sort by Final Match Score Descending
    df_results = pd.DataFrame(results)
    df_results.sort_values(by="Final Match Score", ascending=False, inplace=True)

    # Save to CSV
    os.makedirs(os.path.dirname(output_matching_csv), exist_ok=True)
    df_results.to_csv(output_matching_csv, index=False, encoding="utf-8")

    print("\n" + "=" * 60)
    print("MATCHING PROCESS COMPLETED SUCCESSFULLY")
    print("=" * 60)
    print(f"Processed & matched: {total_resumes} resumes")
    print(f"Results saved to:    {output_matching_csv}")

    # Display Top Matched Candidates Summary Table
    print("\nTop 5 Candidates by Final Match Score:")
    summary_cols = ["Resume", "Name", "Skill Match Score", "Final Match Score", "Match Category"]
    print(df_results[summary_cols].head(5).to_string(index=False))
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
