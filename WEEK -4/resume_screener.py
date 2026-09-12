import os
import re
from collections import Counter
import fitz  # PyMuPDF
import pandas as pd
import spacy

# ==============================================================================
# 1. UTILITY & CONFIGURATION FUNCTIONS
# ==============================================================================

def load_skills(skills_filepath="skills.txt"):
    """
    Dynamically loads technical skills from a plain text file (one skill per line).
    
    Args:
        skills_filepath (str): Path to the skills dictionary file.
        
    Returns:
        list: List of technical skill strings.
    """
    if not os.path.exists(skills_filepath):
        print(f"WARNING: Skill file '{skills_filepath}' not found.")
        return []
    
    with open(skills_filepath, "r", encoding="utf-8") as f:
        skills = [line.strip() for line in f if line.strip()]
    return skills


def load_spacy_model(model_name="en_core_web_sm"):
    """
    Loads the spaCy NLP language model safely.
    
    Args:
        model_name (str): Name of the spaCy model.
        
    Returns:
        spacy.Language: Loaded spaCy NLP object.
    """
    try:
        nlp = spacy.load(model_name)
        return nlp
    except Exception as e:
        print(f"ERROR: Could not load spaCy model '{model_name}'.")
        print("Please run: python -m spacy download en_core_web_sm")
        raise e


# ==============================================================================
# 2. PDF TEXT EXTRACTION
# ==============================================================================

def extract_text_from_pdf(pdf_path):
    """
    Extracts raw text from all pages of a PDF file using PyMuPDF (fitz).
    Handles read errors safely without interrupting overall execution.
    
    Args:
        pdf_path (str): Filepath of the PDF resume.
        
    Returns:
        str: Raw text extracted from the PDF, or empty string if unreadable.
    """
    extracted_text = ""
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text")
            if text:
                extracted_text += text + "\n"
        doc.close()
        
        if not extracted_text.strip():
            print(f"  [WARNING] PDF '{os.path.basename(pdf_path)}' contains no extractable text.")
            
    except Exception as e:
        print(f"  [WARNING] Could not process PDF '{os.path.basename(pdf_path)}'. Reason: {e}")
        return ""
        
    return extracted_text


# ==============================================================================
# 3. TEXT PREPROCESSING
# ==============================================================================

def clean_text(text):
    """
    Preprocesses raw text for NLP parsing while carefully preserving 
    technical terms (e.g. C++, C#, .NET, Node.js, TCP/IP, CI/CD, A/B testing).
    
    Args:
        text (str): Raw text.
        
    Returns:
        str: Cleaned and normalized text.
    """
    if not text:
        return ""
    
    # 1. Replace multiple newlines or tabs with a single space
    cleaned = re.sub(r'[\r\n\t]+', ' ', text)
    
    # 2. Normalize multiple spaces into a single space
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    # 3. Trim leading/trailing whitespace
    cleaned = cleaned.strip()
    
    return cleaned


# ==============================================================================
# 4. REGEX ENTITY EXTRACTION
# ==============================================================================

def extract_email(text):
    """
    Extracts candidate email address using Regex.
    """
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else ""


def extract_phone(text):
    """
    Extracts candidate phone number using Regex.
    Handles international formats, brackets, and hyphens.
    """
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'
    match = re.search(phone_pattern, text)
    return match.group(0).strip() if match else ""


def extract_linkedin(text):
    """
    Extracts LinkedIn profile URL or username handle using Regex.
    """
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+'
    match = re.search(linkedin_pattern, text, re.IGNORECASE)
    return match.group(0) if match else ""


def extract_github(text):
    """
    Extracts GitHub profile URL or username handle using Regex.
    """
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+'
    match = re.search(github_pattern, text, re.IGNORECASE)
    return match.group(0) if match else ""


def extract_experience(text):
    """
    Extracts years of experience mentioned in text using Regex.
    e.g., '5+ years of experience', '3 yrs exp'.
    """
    exp_pattern = r'\b(\d+(?:\.\d+)?\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?)\b'
    match = re.search(exp_pattern, text, re.IGNORECASE)
    return match.group(0) if match else ""


# ==============================================================================
# 5. NAME & EDUCATION EXTRACTION (RULE-BASED)
# ==============================================================================

def extract_name(raw_text):
    """
    Extracts candidate name using top-of-resume line scanning.
    Excludes lines containing email, phone, web links, or metadata terms.
    
    Args:
        raw_text (str): Raw extracted PDF text.
        
    Returns:
        str: Detected name or empty string if inconclusive.
    """
    if not raw_text:
        return ""
        
    ignore_keywords = [
        "resume", "cv", "curriculum vitae", "email", "phone", "mobile", "address", 
        "linkedin", "github", "profile", "http", "https", "@", "page", "contact", 
        "summary", "experience", "education", "skills"
    ]
    
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    
    for line in lines[:10]:  # Check first 10 non-empty lines
        line_lower = line.lower()
        
        # Skip lines with metadata keywords
        if any(keyword in line_lower for keyword in ignore_keywords):
            continue
            
        # Check word count and characters (typically names are 2-4 words)
        words = line.split()
        if 2 <= len(words) <= 4 and all(re.match(r'^[A-Za-z.\'-]+$', w) for w in words):
            return line
            
    return ""


def extract_education(text):
    """
    Detects common technical education degrees and disciplines.
    
    Args:
        text (str): Cleaned text.
        
    Returns:
        str: Comma-separated list of detected education degrees.
    """
    degree_keywords = [
        "B.Tech", "BTech", "B.E", "B.E.", "Bachelor of Technology", "Bachelor of Engineering",
        "Bachelor", "M.Tech", "MTech", "M.E", "M.E.", "Master of Technology", "Master of Engineering",
        "Master", "MCA", "BCA", "MBA", "Ph.D", "PhD",
        "Computer Science", "Information Technology", "Information Systems"
    ]
    
    found_degrees = []
    for degree in degree_keywords:
        # Boundary matching for degree terms
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(degree) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text, re.IGNORECASE):
            found_degrees.append(degree)
            
    # Remove redundant generic terms if specific ones exist
    unique_degrees = list(dict.fromkeys(found_degrees))
    return ", ".join(unique_degrees) if unique_degrees else ""


# ==============================================================================
# 6. TECHNICAL SKILL EXTRACTION
# ==============================================================================

def extract_skills(text, skills_list):
    """
    Searches text for technical skills defined in skills.txt using regex 
    boundary matching to eliminate false positives (e.g. C++ vs C).
    
    Args:
        text (str): Cleaned text.
        skills_list (list): List of skills loaded from skills.txt.
        
    Returns:
        list: Sorted unique list of detected skills.
    """
    detected_skills = []
    
    for skill in skills_list:
        # Construct pattern preventing partial word matches
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text, re.IGNORECASE):
            detected_skills.append(skill)
            
    return sorted(list(set(detected_skills)))


# ==============================================================================
# 7. SPACY NLP KEYWORD EXTRACTION
# ==============================================================================

def extract_keywords(text, nlp, max_keywords=40):
    """
    Extracts key NOUN and PROPN entities using spaCy NLP pipeline.
    Performs tokenization, stop-word filtering, punctuation removal, 
    and lemmatization.
    
    Args:
        text (str): Preprocessed text.
        nlp (spacy.Language): Loaded spaCy NLP model.
        max_keywords (int): Maximum number of keywords to return (30-50).
        
    Returns:
        list: Unique list of clean extracted NLP keywords.
    """
    if not text:
        return []
        
    doc = nlp(text)
    keywords = []
    
    for token in doc:
        # Filter for NOUN and PROPN, exclude stop words, punctuation, spaces, short words
        if token.pos_ in ["NOUN", "PROPN"]:
            if not token.is_stop and not token.is_punct and not token.is_space:
                clean_lemma = token.lemma_.strip().lower()
                # Ensure word length is meaningful (>2 characters)
                if len(clean_lemma) > 2 and not clean_lemma.isdigit():
                    keywords.append(clean_lemma)
                    
    # Frequency ranking & deduplication
    keyword_counts = Counter(keywords)
    top_keywords = [word for word, count in keyword_counts.most_common(max_keywords)]
    
    return top_keywords


# ==============================================================================
# 8. RESUME PIPELINE ORCHESTRATION
# ==============================================================================

def process_resume(pdf_path, skills_list, nlp):
    """
    Processes a single PDF resume through the entire extraction pipeline.
    
    Args:
        pdf_path (str): Path to the PDF file.
        skills_list (list): Loaded technical skills dictionary.
        nlp (spacy.Language): spaCy NLP model.
        
    Returns:
        dict: Extracted resume attributes.
    """
    filename = os.path.basename(pdf_path)
    
    # Step 1: Read PDF
    raw_text = extract_text_from_pdf(pdf_path)
    
    # Step 2: Clean Text
    cleaned_text = clean_text(raw_text)
    
    # Step 3: Entity Extractions
    name = extract_name(raw_text)
    email = extract_email(cleaned_text)
    phone = extract_phone(cleaned_text)
    linkedin = extract_linkedin(cleaned_text)
    github = extract_github(cleaned_text)
    experience = extract_experience(cleaned_text)
    education = extract_education(cleaned_text)
    
    # Step 4: Skill & NLP Keyword Extractions
    detected_skills = extract_skills(cleaned_text, skills_list)
    nlp_keywords = extract_keywords(cleaned_text, nlp, max_keywords=40)
    
    return {
        "Resume": filename,
        "Name": name,
        "Email": email,
        "Phone": phone,
        "LinkedIn": linkedin,
        "GitHub": github,
        "Experience": experience,
        "Education": education,
        "Skills": ", ".join(detected_skills),
        "Keywords": ", ".join(nlp_keywords),
        "Skills_Count": len(detected_skills)  # Helper metric for stats
    }


# ==============================================================================
# 9. MAIN PROGRAM EXECUTION
# ==============================================================================

def main():
    print("=" * 60)
    print("TECHNICAL RESUME SCREENER (WEEK 4 - NLP & REGEX PIPELINE)")
    print("=" * 60)
    
    # Define directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    resumes_dir = os.path.join(base_dir, "resumes")
    output_dir = os.path.join(base_dir, "output")
    skills_file = os.path.join(base_dir, "skills.txt")
    output_csv = os.path.join(output_dir, "resume_extracted_data.csv")
    
    # Create required directories if missing
    os.makedirs(resumes_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)
    
    # Step A: Load Technical Skills Dictionary
    print("\nLoading technical skills dictionary...")
    skills_list = load_skills(skills_file)
    print(f"Skills loaded: {len(skills_list)}")
    
    # Step B: Load spaCy NLP Model
    print("\nLoading spaCy NLP model ('en_core_web_sm')...")
    nlp = load_spacy_model("en_core_web_sm")
    print("spaCy model loaded successfully.")
    
    # Step C: Scan Resumes Folder
    print(f"\nScanning resumes folder: '{resumes_dir}'...")
    pdf_files = [f for f in os.listdir(resumes_dir) if f.lower().endswith(".pdf")]
    total_files = len(pdf_files)
    
    if total_files == 0:
        print("\n[NOTICE] No PDF resumes found in the 'resumes/' folder.")
        print(f"Please add your candidate PDF resumes to: {resumes_dir}")
        print("Then run this script again.")
        return
        
    print(f"Found {total_files} PDF resume(s).\n")
    
    # Step D: Process PDF Resumes
    extracted_data = []
    for idx, pdf_file in enumerate(pdf_files, 1):
        pdf_path = os.path.join(resumes_dir, pdf_file)
        print(f"Processing {idx}/{total_files}: {pdf_file}")
        
        try:
            resume_data = process_resume(pdf_path, skills_list, nlp)
            extracted_data.append(resume_data)
        except Exception as e:
            print(f"  [WARNING] Could not process {pdf_file}. Reason: {e}")
            
    if not extracted_data:
        print("\nNo data could be extracted from the resumes.")
        return
        
    # Step E: Convert to Pandas DataFrame
    df = pd.DataFrame(extracted_data)
    
    # Reorder columns as requested
    columns_order = [
        "Resume", "Name", "Email", "Phone", "LinkedIn", 
        "GitHub", "Experience", "Education", "Skills", "Keywords"
    ]
    df_output = df[columns_order]
    
    # Step F: Export to CSV
    df_output.to_csv(output_csv, index=False, encoding="utf-8")
    
    print("\n" + "=" * 60)
    print("PROCESSING COMPLETED")
    print("=" * 60)
    print(f"Total resumes processed: {total_files}")
    print(f"\nOutput saved to:\n  {output_csv}")
    
    # Step G: Display Summary Statistics
    emails_found = df["Email"].apply(lambda x: 1 if x else 0).sum()
    phones_found = df["Phone"].apply(lambda x: 1 if x else 0).sum()
    linkedin_found = df["LinkedIn"].apply(lambda x: 1 if x else 0).sum()
    github_found = df["GitHub"].apply(lambda x: 1 if x else 0).sum()
    avg_skills = df["Skills_Count"].mean() if "Skills_Count" in df else 0
    
    # Aggregate top skills across all resumes
    all_skills = []
    for s_str in df["Skills"]:
        if s_str:
            all_skills.extend([s.strip() for s in s_str.split(",")])
            
    top_skills_counts = Counter(all_skills).most_common(6)
    
    print("\n" + "=" * 60)
    print("SUMMARY STATISTICS")
    print("=" * 60)
    print(f"Total resumes processed: {total_files}")
    print(f"Emails found:            {emails_found} / {total_files}")
    print(f"Phone numbers found:     {phones_found} / {total_files}")
    print(f"LinkedIn profiles found: {linkedin_found} / {total_files}")
    print(f"GitHub profiles found:   {github_found} / {total_files}")
    print(f"\nAverage technical skills per resume: {avg_skills:.1f}")
    
    if top_skills_counts:
        print("\nMost frequently detected technical skills:")
        for skill, count in top_skills_counts:
            print(f"  - {skill}: {count} resume(s)")
            
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
