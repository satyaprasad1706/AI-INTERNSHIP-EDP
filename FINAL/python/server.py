"""
FastAPI NLP/ML Microservice - Resume-to-Job Matching Platform
B.Tech IT Capstone Project Backend Service
Runs on http://127.0.0.1:8000
"""

import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

from resume_processor import (
    process_resume_content,
    load_skills_dictionary,
    extract_technical_skills
)
from nlp_processor import preprocess_for_nlp, clean_text
from matcher import calculate_match_score, rank_candidates
from ml_experiments import (
    run_week2_linear_regression_experiment,
    run_week3_nlp_classification_experiment
)

app = FastAPI(
    title="Resume-to-Job Matching NLP Service",
    description="Backend NLP, Parsing, and Matching Microservice for Capstone Weeks 1-8",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MatchRequest(BaseModel):
    candidate_skills: List[str]
    required_skills: List[str]


class RankingRequest(BaseModel):
    matches: List[Dict[str, Any]]
    shortlist_mode: Optional[str] = "threshold"
    threshold: Optional[float] = 70.0
    top_n: Optional[int] = 5


class JobSkillExtractionRequest(BaseModel):
    title: Optional[str] = ""
    description: str


class TextAnalysisRequest(BaseModel):
    text: str


class AddSkillRequest(BaseModel):
    skill: str


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Resume-to-Job Matching Platform - NLP/ML Engine",
        "weeks_integrated": "Weeks 1 through 8",
        "docs_url": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "model": "en_core_web_sm", "pymupdf": "active"}


@app.get("/api/skills")
def get_skills():
    """Returns all loaded skills from data/skills.txt."""
    skills = load_skills_dictionary()
    return {"count": len(skills), "skills": skills}


@app.post("/api/skills")
def add_skill(payload: AddSkillRequest):
    """Dynamically appends a new skill to data/skills.txt."""
    new_skill = payload.skill.strip()
    if not new_skill:
        raise HTTPException(status_code=400, detail="Skill name cannot be empty.")
        
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    skills_file_path = os.path.join(base_dir, "data", "skills.txt")
    
    current_skills = load_skills_dictionary(skills_file_path)
    if new_skill.lower() in [s.lower() for s in current_skills]:
        return {"message": "Skill already exists", "skills": current_skills}
        
    with open(skills_file_path, "a", encoding="utf-8") as f:
        f.write(f"\n{new_skill}")
        
    updated = load_skills_dictionary(skills_file_path)
    return {"message": f"Added skill '{new_skill}'", "count": len(updated), "skills": updated}


@app.post("/api/process-resume")
async def process_single_resume(file: UploadFile = File(...)):
    """
    Parses a single resume (PDF or TXT) and returns a structured candidate record.
    """
    filename = file.filename or "resume.pdf"
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
    try:
        record = process_resume_content(content, filename)
        return {"success": True, "data": record}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to process '{filename}': {str(e)}")


@app.post("/api/process-resumes-batch")
async def process_resumes_batch(files: List[UploadFile] = File(...)):
    """
    Week 7: Batch processing of mixed PDF & TXT resumes.
    Gracefully catches individual failures without terminating the entire batch.
    """
    results = []
    errors = []
    
    for file in files:
        filename = file.filename or "unnamed_resume"
        try:
            content = await file.read()
            if len(content) == 0:
                errors.append({"filename": filename, "reason": "Empty file (0 bytes)"})
                continue
            record = process_resume_content(content, filename)
            results.append(record)
        except Exception as e:
            errors.append({"filename": filename, "reason": str(e)})
            
    return {
        "success": True,
        "processed_count": len(results),
        "failed_count": len(errors),
        "results": results,
        "errors": errors
    }


@app.post("/api/extract-job-skills")
def extract_job_skills(payload: JobSkillExtractionRequest):
    """
    Extracts required technical skills from Job Description text using the skills dictionary.
    """
    full_text = f"{payload.title}\n{payload.description}"
    skills = extract_technical_skills(full_text)
    return {
        "skills": skills,
        "skill_count": len(skills),
        "cleaned_text": clean_text(full_text)
    }


@app.post("/api/match-candidate")
def match_candidate(payload: MatchRequest):
    """
    Week 5 Deterministic Match Score Calculation:
    Match Score = (Matching Skills / Required Job Skills) * 100
    """
    result = calculate_match_score(payload.candidate_skills, payload.required_skills)
    return result


@app.post("/api/rank-and-shortlist")
def rank_and_shortlist_candidates(payload: RankingRequest):
    """
    Week 6 Ranking and Shortlisting engine.
    """
    ranked = rank_candidates(
        payload.matches,
        shortlist_mode=payload.shortlist_mode or "threshold",
        threshold=payload.threshold or 70.0,
        top_n=payload.top_n or 5
    )
    return {
        "ranked_candidates": ranked,
        "total": len(ranked),
        "shortlisted_count": sum(1 for c in ranked if c.get("shortlisted"))
    }


@app.get("/api/experiments/week2-regression")
def get_week2_experiment(test_size: float = 0.25):
    """
    Week 2 Academic Learning Module: Supervised Linear Regression Experiment.
    """
    result = run_week2_linear_regression_experiment(test_size=test_size)
    return result


@app.post("/api/experiments/week3-nlp-classify")
def run_week3_nlp_experiment(payload: TextAnalysisRequest):
    """
    Week 3 Academic Learning Module: TF-IDF + Multinomial Naive Bayes Classifier.
    """
    result = run_week3_nlp_classification_experiment(payload.text)
    return result


@app.post("/api/nlp/preprocess")
def nlp_preprocess_view(payload: TextAnalysisRequest):
    """
    Detailed NLP tokenization, lemmatization, and POS breakdown for educational inspection.
    """
    return preprocess_for_nlp(payload.text)


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=False)
