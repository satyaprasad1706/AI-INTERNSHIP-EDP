"""
Unit & Integration Test Suite for Resume-to-Job Matching Python Layer
Tests:
- Dynamic skills loading
- Regex extraction
- PyMuPDF and TXT extraction
- Deterministic Match Score: (Matching / Required) * 100
- Ranking and Shortlisting logic
- Week 2 & Week 3 ML/NLP experiments
"""

import os
import sys
import unittest

# Add current dir to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from resume_processor import (
    load_skills_dictionary,
    extract_email,
    extract_phone,
    extract_linkedin,
    extract_github,
    extract_experience,
    extract_technical_skills,
    process_resume_content
)
from matcher import calculate_match_score, rank_candidates
from ml_experiments import (
    run_week2_linear_regression_experiment,
    run_week3_nlp_classification_experiment
)


class TestResumeMatchingEngine(unittest.TestCase):

    def test_skills_dictionary_loading(self):
        skills = load_skills_dictionary()
        self.assertGreater(len(skills), 20)
        self.assertIn("Python", skills)
        self.assertIn("SQL", skills)
        self.assertIn("React", skills)

    def test_regex_extractions(self):
        sample_text = """
        John Doe
        Email: john.doe@example.com | Phone: +91 9876543210
        LinkedIn: https://linkedin.com/in/johndoe | GitHub: https://github.com/johndoe
        Summary: Full stack developer with 3+ years of experience in web systems.
        """
        email = extract_email(sample_text)
        phone = extract_phone(sample_text)
        linkedin = extract_linkedin(sample_text)
        github = extract_github(sample_text)
        exp = extract_experience(sample_text)

        self.assertEqual(email, "john.doe@example.com")
        self.assertIn("9876543210", phone or "")
        self.assertEqual(linkedin, "https://linkedin.com/in/johndoe")
        self.assertEqual(github, "https://github.com/{handle}".replace("{handle}", "johndoe"))
        self.assertIn("3+ years", exp.lower())

    def test_technical_skill_extraction(self):
        text = "Skilled in Python, React, Next.js, Node.js, PostgreSQL, Docker, and Machine Learning."
        skills = extract_technical_skills(text)
        self.assertIn("Python", skills)
        self.assertIn("React", skills)
        self.assertIn("Next.js", skills)
        self.assertIn("Docker", skills)
        self.assertIn("Machine Learning", skills)

    def test_week5_match_scoring_formula(self):
        # Week 5 Exact Formula: (Matching Skills / Required Job Skills) * 100
        req_skills = ["Python", "SQL", "Machine Learning", "Pandas", "Git", "AWS"]
        cand_skills = ["Python", "SQL", "Machine Learning", "Pandas", "Java", "React"]

        result = calculate_match_score(cand_skills, req_skills)
        self.assertEqual(len(result["matchingSkills"]), 4)
        self.assertEqual(len(result["missingSkills"]), 2)
        self.assertIn("Git", result["missingSkills"])
        self.assertIn("AWS", result["missingSkills"])
        self.assertAlmostEqual(result["matchScore"], 66.67, places=2)

    def test_ranking_and_shortlisting(self):
        matches = [
            {"candidateName": "Candidate A", "matchScore": 91.67, "matchingSkills": ["Python", "SQL", "React"]},
            {"candidateName": "Candidate B", "matchScore": 83.33, "matchingSkills": ["Python", "SQL"]},
            {"candidateName": "Candidate C", "matchScore": 66.67, "matchingSkills": ["Python"]},
        ]
        ranked_thresh = rank_candidates(matches, shortlist_mode="threshold", threshold=70.0)
        self.assertEqual(ranked_thresh[0]["rank"], 1)
        self.assertEqual(ranked_thresh[0]["candidateName"], "Candidate A")
        self.assertTrue(ranked_thresh[0]["shortlisted"])
        self.assertTrue(ranked_thresh[1]["shortlisted"])
        self.assertFalse(ranked_thresh[2]["shortlisted"])

    def test_week2_linear_regression_experiment(self):
        exp = run_week2_linear_regression_experiment()
        self.assertIn("metrics", exp)
        self.assertIn("MAE", exp["metrics"])
        self.assertIn("RMSE", exp["metrics"])
        self.assertIn("R2", exp["metrics"])
        self.assertGreaterEqual(exp["metrics"]["R2"], 0.70)

    def test_week3_nlp_classification_experiment(self):
        text = "Building modern frontend user interfaces with React, TypeScript, Next.js, and Tailwind CSS."
        exp = run_week3_nlp_classification_experiment(text)
        self.assertEqual(exp["predicted_category"], "Software Engineering")
        self.assertGreater(len(exp["active_tfidf_terms"]), 0)


if __name__ == "__main__":
    unittest.main()
