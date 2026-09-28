export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string | null;
  github: string | null;
  education: string;
  experience: string;
  resumeFile: string;
  resumeFormat: "PDF" | "TXT" | string;
  skills: string[]; // Parsed from JSON string
  keywords: string[]; // Parsed from JSON string
  rawText?: string | null;
  cleanedText?: string | null;
  createdAt: string | Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[]; // Parsed from JSON string
  createdAt: string | Date;
}

export interface MatchResult {
  id?: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resumeFile: string;
  resumeFormat: string;
  candidateSkills: string[];
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  extraSkills?: string[];
  matchScore: number;
  rank: number;
  shortlisted: boolean;
  createdAt?: string | Date;
}

export interface DashboardStats {
  totalResumes: number;
  processedResumes: number;
  activeJobs: number;
  averageMatchScore: number;
  shortlistedCandidates: number;
  pdfCount: number;
  txtCount: number;
}

export interface Week2RegressionData {
  module: string;
  model_type: string;
  total_samples: number;
  train_samples: number;
  test_samples: number;
  features: string[];
  target: string;
  coefficients: {
    experience_years: number;
    skill_count: number;
    education_level: number;
    intercept: number;
  };
  metrics: {
    MAE: number;
    MSE: number;
    RMSE: number;
    R2: number;
  };
  sample_data: Array<{
    experience_years: number;
    skill_count: number;
    education_level: number;
    target_score: number;
  }>;
  test_predictions: Array<{
    experience: number;
    skills: number;
    education: number;
    actual: number;
    predicted: number;
    error: number;
  }>;
}

export interface Week3NLPData {
  module: string;
  input_text: string;
  vocabulary_size: number;
  top_vocabulary_sample: string[];
  active_tfidf_terms: Array<{
    term: string;
    tfidf_weight: number;
  }>;
  predicted_category: string;
  category_probabilities: Array<{
    category: string;
    probability: number;
  }>;
  model_architecture: string;
}
