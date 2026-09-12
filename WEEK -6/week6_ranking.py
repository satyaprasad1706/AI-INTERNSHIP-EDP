import os
import pandas as pd

# ==============================================================================
# CONFIGURATION PARAMETERS (Easy to modify)
# ==============================================================================
SHORTLIST_THRESHOLD = 70.0    # Default Score Threshold percentage (%)
SHORTLIST_MODE = "THRESHOLD"   # Shortlisting options: "THRESHOLD" or "TOP_N"
TOP_N = 10                     # Active if SHORTLIST_MODE is set to "TOP_N"

# ==============================================================================
# 1. FILE RESOLUTION & LOADING
# ==============================================================================

def resolve_input_path(base_dir):
    """
    Resolves the filepath of Week 5 output 'resume_job_matching_results.csv',
    checking local directory first, then fallback to parent WEEK -5 / WEEK -4 folders.
    """
    parent_dir = os.path.dirname(base_dir)

    candidates = [
        os.path.join(base_dir, "output", "resume_job_matching_results.csv"),
        os.path.join(parent_dir, "WEEK -5", "output", "resume_job_matching_results.csv"),
        os.path.join(parent_dir, "WEEK -4", "output", "resume_job_matching_results.csv"),
        os.path.join(parent_dir, "Resume_Screener", "output", "resume_job_matching_results.csv"),
    ]

    for path in candidates:
        if os.path.exists(path):
            return path
    return None


def load_week5_results(csv_path):
    """
    Reads Week 5 matching results CSV using Pandas.
    Returns DataFrame or None if unreadable.
    """
    try:
        df = pd.read_csv(csv_path)
        return df
    except Exception as e:
        print(f"ERROR reading Week 5 results CSV file: {e}")
        return None


# ==============================================================================
# 2. DATA VALIDATION & CLEANING
# ==============================================================================

def validate_and_clean_data(df):
    """
    Safely validates column presence and converts numerical fields.
    Handles missing values and NaNs without crashing.
    """
    required_cols = ["Resume", "Final Match Score"]
    missing = [col for col in required_cols if col not in df.columns]
    
    if missing:
        print(f"ERROR: Missing critical column(s) in Week 5 results: {missing}")
        return None

    # Fill optional missing text columns safely
    df["Name"] = df["Name"].fillna("Not Found") if "Name" in df.columns else "Not Found"
    df["Email"] = df["Email"].fillna("") if "Email" in df.columns else ""
    df["Phone"] = df["Phone"].fillna("") if "Phone" in df.columns else ""
    df["Matching Skills"] = df["Matching Skills"].fillna("") if "Matching Skills" in df.columns else ""
    df["Missing Skills"] = df["Missing Skills"].fillna("") if "Missing Skills" in df.columns else ""
    df["Match Category"] = df["Match Category"].fillna("Uncategorized") if "Match Category" in df.columns else "Uncategorized"

    # Convert Final Match Score safely to numeric floats
    df["Final Match Score"] = pd.to_numeric(df["Final Match Score"], errors="coerce").fillna(0.0)
    
    if "Skill Match Score" in df.columns:
        df["Skill Match Score"] = pd.to_numeric(df["Skill Match Score"], errors="coerce").fillna(0.0)
    else:
        df["Skill Match Score"] = 0.0

    if "Keyword Match Score" in df.columns:
        df["Keyword Match Score"] = pd.to_numeric(df["Keyword Match Score"], errors="coerce").fillna(0.0)
    else:
        df["Keyword Match Score"] = 0.0

    return df


# ==============================================================================
# 3. RANKING LOGIC
# ==============================================================================

def calculate_ranks(df):
    """
    Sorts all candidates by Final Match Score descending and assigns Rank (1..N).
    Handles ties deterministically using secondary sort on Skill Match Score & Resume filename.
    """
    # Deterministic sorting
    df_sorted = df.sort_values(
        by=["Final Match Score", "Skill Match Score", "Resume"], 
        ascending=[False, False, True]
    ).reset_index(drop=True)

    # Assign 1-indexed Ranks
    df_sorted["Rank"] = df_sorted.index + 1
    return df_sorted


# ==============================================================================
# 4. SHORTLISTING LOGIC
# ==============================================================================

def apply_shortlist(df, mode=SHORTLIST_MODE, threshold=SHORTLIST_THRESHOLD, top_n=TOP_N):
    """
    Applies configurable shortlisting rules:
      - THRESHOLD mode: Candidates with Final Match Score >= threshold
      - TOP_N mode: Candidates with Rank <= top_n
    """
    if mode.upper() == "TOP_N":
        df["Shortlist Status"] = df["Rank"].apply(
            lambda r: "Shortlisted" if r <= top_n else "Not Shortlisted"
        )
    else:  # Default THRESHOLD mode
        df["Shortlist Status"] = df["Final Match Score"].apply(
            lambda score: "Shortlisted" if score >= threshold else "Not Shortlisted"
        )

    return df


# ==============================================================================
# 5. SUMMARY STATISTICS & DISTRIBUTION
# ==============================================================================

def generate_summary_statistics(df, mode, threshold, top_n):
    """
    Calculates candidate statistics and score distribution buckets.
    """
    total_candidates = len(df)
    shortlisted_df = df[df["Shortlist Status"] == "Shortlisted"]
    shortlisted_count = len(shortlisted_df)
    not_shortlisted_count = total_candidates - shortlisted_count

    max_score = df["Final Match Score"].max() if total_candidates > 0 else 0.0
    min_score = df["Final Match Score"].min() if total_candidates > 0 else 0.0
    avg_score = df["Final Match Score"].mean() if total_candidates > 0 else 0.0

    # Score Distribution Buckets
    cat_90_100 = len(df[(df["Final Match Score"] >= 90.0) & (df["Final Match Score"] <= 100.0)])
    cat_80_89 = len(df[(df["Final Match Score"] >= 80.0) & (df["Final Match Score"] < 90.0)])
    cat_70_79 = len(df[(df["Final Match Score"] >= 70.0) & (df["Final Match Score"] < 80.0)])
    cat_60_69 = len(df[(df["Final Match Score"] >= 60.0) & (df["Final Match Score"] < 70.0)])
    cat_below_60 = len(df[df["Final Match Score"] < 60.0])

    print("\n" + "=" * 60)
    print("SHORTLIST SUMMARY STATISTICS")
    print("=" * 60)
    print(f"Shortlisting Mode:        {mode}")
    if mode.upper() == "TOP_N":
        print(f"Top-N Selection Limit:    {top_n} candidates")
    else:
        print(f"Score Threshold:          {threshold:.2f}%")

    print(f"\nTotal candidates:         {total_candidates}")
    print(f"Shortlisted candidates:   {shortlisted_count} ({(shortlisted_count/total_candidates*100):.1f}%)")
    print(f"Not shortlisted:          {not_shortlisted_count}")
    print(f"\nHighest Match Score:      {max_score:.2f}%")
    print(f"Lowest Match Score:       {min_score:.2f}%")
    print(f"Average Match Score:      {avg_score:.2f}%")

    print("\n" + "-" * 40)
    print("SCORE DISTRIBUTION SUMMARY")
    print("-" * 40)
    print(f"90% - 100% (Excellent Match): {cat_90_100} candidate(s)")
    print(f"80% - 89%  (Strong Match):    {cat_80_89} candidate(s)")
    print(f"70% - 79%  (Moderate-High):   {cat_70_79} candidate(s)")
    print(f"60% - 69%  (Moderate Match):  {cat_60_69} candidate(s)")
    print(f"Below 60%  (Low Match):       {cat_below_60} candidate(s)")
    print("=" * 60)

    if shortlisted_count == 0:
        print("\n[NOTICE] No candidates meet the current shortlisting threshold.")


# ==============================================================================
# 6. OUTPUT SAVING
# ==============================================================================

def save_results(df, output_dir):
    """
    Saves ranked_candidates.csv and shortlisted_candidates.csv.
    """
    os.makedirs(output_dir, exist_ok=True)
    ranked_csv = os.path.join(output_dir, "ranked_candidates.csv")
    shortlisted_csv = os.path.join(output_dir, "shortlisted_candidates.csv")

    # Column ordering for ranked candidates CSV
    ranked_cols = [
        "Rank", "Resume", "Name", "Email", "Phone", 
        "Skill Match Score", "Keyword Match Score", "Final Match Score", 
        "Match Category", "Matching Skills", "Missing Skills", "Shortlist Status"
    ]
    
    # Filter columns present in DataFrame
    ranked_cols_present = [col for col in ranked_cols if col in df.columns]
    df_ranked = df[ranked_cols_present]
    df_ranked.to_csv(ranked_csv, index=False, encoding="utf-8")

    # Shortlisted output
    df_shortlisted = df[df["Shortlist Status"] == "Shortlisted"]
    shortlisted_cols = [
        "Rank", "Resume", "Name", "Email", "Final Match Score", 
        "Match Category", "Matching Skills", "Missing Skills"
    ]
    shortlisted_cols_present = [col for col in shortlisted_cols if col in df.columns]
    
    df_shortlisted_out = df_shortlisted[shortlisted_cols_present]
    df_shortlisted_out.to_csv(shortlisted_csv, index=False, encoding="utf-8")

    print("\n" + "=" * 60)
    print("OUTPUT FILES SAVED SUCCESSFULLY")
    print("=" * 60)
    print(f"Ranked candidates saved to:      {ranked_csv}")
    print(f"Shortlisted candidates saved to: {shortlisted_csv}")
    print("=" * 60 + "\n")


# ==============================================================================
# 7. MAIN PROGRAM EXECUTION
# ==============================================================================

def main():
    print("=" * 60)
    print("WEEK 6 - CANDIDATE RESUME RANKING & SHORTLISTING")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "output")

    # Step A: Resolve Input Path
    csv_path = resolve_input_path(base_dir)
    if not csv_path:
        print("\nERROR: Week 5 results not found.")
        print("Expected file: 'output/resume_job_matching_results.csv'")
        print("Please run 'python week5_matcher.py' first.")
        return

    print(f"Loading Week 5 results from: '{csv_path}'...")
    df_raw = load_week5_results(csv_path)

    if df_raw is None or len(df_raw) == 0:
        print("ERROR: Week 5 results file is empty.")
        return

    print(f"Candidates loaded: {len(df_raw)}")

    # Step B: Data Validation & Cleaning
    df_clean = validate_and_clean_data(df_raw)
    if df_clean is None:
        return

    # Step C: Ranking Logic
    df_ranked = calculate_ranks(df_clean)

    # Step D: Shortlisting Logic
    df_shortlisted = apply_shortlist(
        df_ranked, 
        mode=SHORTLIST_MODE, 
        threshold=SHORTLIST_THRESHOLD, 
        top_n=TOP_N
    )

    # Display Top Ranked Candidates Table
    print("\n" + "=" * 60)
    print("TOP RANKED CANDIDATES")
    print("=" * 60)
    display_cols = ["Rank", "Name", "Final Match Score", "Match Category", "Shortlist Status"]
    display_cols_present = [c for c in display_cols if c in df_shortlisted.columns]
    print(df_shortlisted[display_cols_present].head(10).to_string(index=False))

    # Step E: Generate Summary Statistics & Score Distribution
    generate_summary_statistics(
        df_shortlisted, 
        mode=SHORTLIST_MODE, 
        threshold=SHORTLIST_THRESHOLD, 
        top_n=TOP_N
    )

    # Step F: Save CSV Outputs
    save_results(df_shortlisted, output_dir)


if __name__ == "__main__":
    main()
