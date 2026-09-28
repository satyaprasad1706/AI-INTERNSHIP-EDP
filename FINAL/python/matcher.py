"""
Matcher & Ranking Module - Capstone Week 5 & Week 6
Implements the exact transparent skill matching formula:
Match Score = (Matching Skills / Required Job Skills) * 100

Also handles candidate ranking and shortlisting rules.
"""

from typing import List, Dict, Any, Tuple


def calculate_match_score(
    candidate_skills: List[str],
    required_skills: List[str]
) -> Dict[str, Any]:
    """
    Week 5 Exact Match Scoring Logic:
    Match Score = (Matching Skills / Required Job Skills) * 100
    
    Returns:
    - matchScore (float, rounded to 2 decimal places)
    - matchingSkills (list)
    - missingSkills (list)
    - extraSkills (candidate skills not required by job)
    """
    if not required_skills:
        return {
            "matchScore": 0.0,
            "matchingSkills": [],
            "missingSkills": [],
            "extraSkills": candidate_skills,
            "totalRequired": 0,
            "totalMatched": 0
        }
        
    cand_set = {s.strip().lower(): s.strip() for s in candidate_skills}
    req_set = {s.strip().lower(): s.strip() for s in required_skills}
    
    matching = []
    missing = []
    
    for req_lower, original_req in req_set.items():
        if req_lower in cand_set:
            matching.append(original_req)
        else:
            missing.append(original_req)
            
    extra = [s for s_lower, s in cand_set.items() if s_lower not in req_set]
    
    total_required = len(req_set)
    total_matched = len(matching)
    
    raw_score = (total_matched / total_required) * 100.0 if total_required > 0 else 0.0
    match_score = round(raw_score, 2)
    
    return {
        "matchScore": match_score,
        "matchingSkills": matching,
        "missingSkills": missing,
        "extraSkills": extra,
        "totalRequired": total_required,
        "totalMatched": total_matched
    }


def rank_candidates(
    matches: List[Dict[str, Any]],
    shortlist_mode: str = "threshold",
    threshold: float = 70.0,
    top_n: int = 5
) -> List[Dict[str, Any]]:
    """
    Week 6 Ranking & Shortlisting Logic:
    1. Sorts all candidate matches by Match Score in descending order.
    2. Assigns sequential integer rank (1, 2, 3, ...).
    3. Flags candidates as SHORTLISTED based on rule:
       - 'threshold': matchScore >= threshold
       - 'top_n': rank <= top_n
    """
    # Sort descending by matchScore
    sorted_matches = sorted(
        matches,
        key=lambda x: (x.get("matchScore", 0.0), len(x.get("matchingSkills", []))),
        reverse=True
    )
    
    ranked_results = []
    for idx, match in enumerate(sorted_matches, start=1):
        item = dict(match)
        item["rank"] = idx
        
        score = item.get("matchScore", 0.0)
        if shortlist_mode == "top_n":
            item["shortlisted"] = (idx <= top_n)
        else:
            # Default threshold
            item["shortlisted"] = (score >= threshold)
            
        ranked_results.append(item)
        
    return ranked_results
