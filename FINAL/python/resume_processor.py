"""
Resume Processor Module - Capstone Week 4 & Week 7
Handles PDF (PyMuPDF) and TXT extraction, text cleaning, regex extraction,
spaCy NLP parsing, and dynamic skills dictionary matching.
"""

import os
import re
from typing import List, Dict, Any, Optional
import fitz  # PyMuPDF
from nlp_processor import clean_text, extract_keywords, nlp


def load_skills_dictionary(skills_file_path: Optional[str] = None) -> List[str]:
    """
    Dynamically loads technical skills from data/skills.txt.
    Ensures extensibility without hardcoding skills in source code.
    """
    if not skills_file_path:
        # Default path relative to this script
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        skills_file_path = os.path.join(base_dir, "data", "skills.txt")
        
    if not os.path.exists(skills_file_path):
        # Fallback list if file is missing
        return [
            "Python", "Java", "C++", "JavaScript", "TypeScript", "SQL",
            "React", "Node.js", "Django", "FastAPI", "Machine Learning", "Git"
        ]
        
    with open(skills_file_path, "r", encoding="utf-8") as f:
        skills = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        
    # Return unique sorted skills
    return list(dict.fromkeys(skills))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from multi-page PDF files using PyMuPDF (fitz).
    Gracefully handles empty or corrupted PDFs.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text_pages = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text")
            if text:
                text_pages.append(text)
        doc.close()
        return "\n".join(text_pages)
    except Exception as e:
        raise ValueError(f"Failed to extract PDF text: {str(e)}")


def extract_text_from_txt(file_bytes: bytes) -> str:
    """
    Extracts text from TXT files with multi-encoding fallback.
    """
    encodings = ["utf-8", "latin-1", "cp1252", "iso-8859-1"]
    for enc in encodings:
        try:
            return file_bytes.decode(enc)
        except UnicodeDecodeError:
            continue
    raise ValueError("Unable to decode TXT file with supported encodings.")


def extract_candidate_name(text: str, doc_nlp: Any = None) -> str:
    """
    Extracts candidate name using spaCy NER PERSON tag combined with header heuristics.
    """
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if not lines:
        return "Unknown Candidate"
    
    # Check top lines first
    header_chunk = "\n".join(lines[:5])
    if doc_nlp is None:
        doc_nlp = nlp(header_chunk)
    else:
        # If full doc provided, also check first 50 tokens
        header_chunk_doc = nlp(header_chunk)
        
    for ent in header_chunk_doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip()
            # Basic validation: between 2 and 4 words, alphabetic
            words = name.split()
            if 1 <= len(words) <= 4 and all(w.replace(".", "").isalpha() for w in words):
                # Avoid common resume section headers falsely tagged
                if name.lower() not in ["resume", "curriculum vitae", "summary", "profile", "contact", "education", "experience", "skills"]:
                    return name
                    
    # Heuristic fallback: top non-empty line if it looks like a clean name
    first_line = lines[0]
    first_line_clean = re.sub(r"[^a-zA-Z\s\.]", "", first_line).strip()
    words = first_line_clean.split()
    if 1 <= len(words) <= 4 and len(first_line_clean) < 40 and not any(kw in first_line_clean.lower() for kw in ["resume", "curriculum", "email", "phone", "profile"]):
        return first_line_clean.title()
        
    return "Candidate"


def extract_email(text: str) -> Optional[str]:
    """
    Extracts email address using standard regex.
    """
    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else None


def extract_phone(text: str) -> Optional[str]:
    """
    Extracts Indian and international phone numbers.
    Supports formats like: +91 9876543210, +91-98765-43210, 09876543210, 9876543210, (123) 456-7890.
    """
    phone_pattern = r"(?:(?:\+?91[\-\s]?)?[6-9]\d{9})|(?:\+?1[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}"
    matches = re.findall(phone_pattern, text)
    if matches:
        # Clean extracted number
        return re.sub(r"[^\d+]", "", matches[0])
    return None


def extract_linkedin(text: str) -> Optional[str]:
    """
    Detects LinkedIn profile URLs or handles.
    """
    linkedin_pattern = r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)"
    matches = re.search(linkedin_pattern, text, re.IGNORECASE)
    if matches:
        handle = matches.group(1)
        return f"https://linkedin.com/in/{handle}"
    return None


def extract_github(text: str) -> Optional[str]:
    """
    Detects GitHub profile URLs or handles.
    """
    github_pattern = r"(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)"
    matches = re.search(github_pattern, text, re.IGNORECASE)
    if matches:
        handle = matches.group(1)
        # Filter out common github non-user paths
        if handle.lower() not in ["features", "topics", "collections", "pricing"]:
            return f"https://github.com/{handle}"
    return None


def extract_experience(text: str) -> str:
    """
    Detects experience expressions like '2 years', '3+ years', '5 years of experience', 'Fresher'.
    """
    exp_patterns = [
        r"(\d+(?:\.\d+)?\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?)",
        r"(?:experience\s*:\s*)(\d+(?:\.\d+)?\+?\s*(?:years?|yrs?))",
        r"\b(fresher|entry[\s-]level)\b"
    ]
    for pattern in exp_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return "Not specified"


def extract_education(text: str) -> str:
    """
    Detects degree and education qualifications.
    """
    edu_keywords = [
        "B.Tech", "B.E.", "Bachelor of Technology", "Bachelor of Engineering",
        "M.Tech", "M.E.", "Master of Technology", "Master of Engineering",
        "MCA", "BCA", "B.Sc", "M.Sc", "Bachelor of Science", "Master of Science",
        "B.Com", "M.Com", "MBA", "Ph.D", "PhD", "Diploma"
    ]
    found_degrees = []
    text_lower = text.lower()
    for edu in edu_keywords:
        pattern = r"\b" + re.escape(edu.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found_degrees.append(edu)
            
    if found_degrees:
        return ", ".join(list(dict.fromkeys(found_degrees)))
    return "Graduate / Bachelor's Degree"


def extract_technical_skills(text: str, skills_dict: Optional[List[str]] = None) -> List[str]:
    """
    Matches technical skills against the dynamic skills dictionary.
    Handles special characters (C++, C#, .NET, Node.js) with regex word/symbol boundaries.
    """
    if skills_dict is None:
        skills_dict = load_skills_dictionary()
        
    found_skills = []
    text_lower = text.lower()
    
    for skill in skills_dict:
        skill_clean = skill.strip()
        skill_lower = skill_clean.lower()
        
        # Special handling for C++, C#, .NET, etc.
        if skill_lower == "c++":
            pattern = r"(?:^|[\s,;/\(\)])c\+\+(?:$|[\s,;/\(\)])"
        elif skill_lower == "c#":
            pattern = r"(?:^|[\s,;/\(\)])c\#(?:$|[\s,;/\(\)])"
        elif skill_lower == "c":
            pattern = r"(?:^|[\s,;/\(\)])c(?:$|[\s,;/\(\)])"
        elif skill_lower in [".net", "asp.net"]:
            pattern = r"(?:^|[\s,;/\(\)])\.?asp\.net(?:$|[\s,;/\(\)])|(?:^|[\s,;/\(\)])\.net(?:$|[\s,;/\(\)])"
        elif " " in skill_lower or "-" in skill_lower:
            # Multi-word skill: direct substring or regex
            pattern = r"\b" + re.escape(skill_lower) + r"\b"
        else:
            pattern = r"\b" + re.escape(skill_lower) + r"\b"
            
        if re.search(pattern, text_lower):
            # Normalize aliases
            normalized_skill = skill_clean
            if normalized_skill.lower() == "reactjs":
                normalized_skill = "React"
            elif normalized_skill.lower() == "node":
                normalized_skill = "Node.js"
            elif normalized_skill.lower() == "express":
                normalized_skill = "Express.js"
                
            if normalized_skill not in found_skills:
                found_skills.append(normalized_skill)
                
    return found_skills


def process_resume_content(
    file_bytes: bytes,
    filename: str,
    skills_dict: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Complete Resume Processing Pipeline:
    1. File Format Detection (.pdf / .txt)
    2. Text Extraction (PyMuPDF / TXT decoder)
    3. Text Cleaning & Normalization
    4. Regex Information Extraction (Email, Phone, LinkedIn, GitHub, Exp, Edu)
    5. spaCy NLP Processing (NER for Name, POS, Lemmatization)
    6. Technical Skill Extraction from skills.txt
    7. Keyword Extraction
    8. Return Structured Candidate Record
    """
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        resume_format = "PDF"
        raw_text = extract_text_from_pdf(file_bytes)
    elif ext == ".txt":
        resume_format = "TXT"
        raw_text = extract_text_from_txt(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: '{ext}'. Supported formats: PDF, TXT.")
        
    if not raw_text or not raw_text.strip():
        raise ValueError("Resume file contains no extractable text.")
        
    cleaned = clean_text(raw_text)
    doc = nlp(cleaned[:5000])  # Process initial document segment for NLP extraction
    
    candidate_name = extract_candidate_name(raw_text, doc)
    email = extract_email(raw_text) or "N/A"
    phone = extract_phone(raw_text) or "N/A"
    linkedin = extract_linkedin(raw_text) or "N/A"
    github = extract_github(raw_text) or "N/A"
    experience = extract_experience(raw_text)
    education = extract_education(raw_text)
    
    extracted_skills = extract_technical_skills(raw_text, skills_dict)
    extracted_keywords = extract_keywords(raw_text, top_n=12)
    
    return {
        "candidateName": candidate_name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "education": education,
        "experience": experience,
        "skills": extracted_skills,
        "keywords": extracted_keywords,
        "resumeFile": filename,
        "resumeFormat": resume_format,
        "rawText": raw_text,
        "cleanedText": cleaned,
        "wordCount": len(cleaned.split()),
        "skillCount": len(extracted_skills)
    }
