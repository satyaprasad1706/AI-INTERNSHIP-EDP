"""
ML & NLP Experiments Module - Capstone Week 2 & Week 3
Provides dedicated educational analytics and experiments demonstrating:
- Week 2: Linear Regression, Train/Test Split, MAE, MSE, RMSE, R-squared
- Week 3: Text Preprocessing, TF-IDF Representation, Multinomial Naive Bayes text classification
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import math


def run_week2_linear_regression_experiment(test_size: float = 0.25, random_state: int = 42) -> Dict[str, Any]:
    """
    Week 2 Learning Module: Linear Regression Experiment
    Demonstrates supervised regression with training/testing split, model fitting, and evaluation metrics:
    - MAE (Mean Absolute Error)
    - MSE (Mean Squared Error)
    - RMSE (Root Mean Squared Error)
    - R² (Coefficient of Determination)
    """
    np.random.seed(random_state)
    n_samples = 120
    
    # Feature 1: Years of Experience (0.5 to 12.0)
    experience = np.random.uniform(0.5, 12.0, n_samples)
    # Feature 2: Number of Technical Skills (2 to 20)
    skill_count = np.random.randint(2, 20, n_samples)
    # Feature 3: Education Level Score (1 to 4: Diploma, Bachelor, Master, PhD)
    edu_score = np.random.choice([1, 2, 3, 4], size=n_samples, p=[0.1, 0.6, 0.25, 0.05])
    
    # Target: Synthetic Tech Compensation / Assessment Score index (e.g. 30k to 180k)
    # True relation: Base + 9.5*Exp + 4.2*Skills + 12*Edu + Gaussian Noise
    noise = np.random.normal(0, 5.0, n_samples)
    target_score = 25.0 + 8.2 * experience + 3.8 * skill_count + 11.5 * edu_score + noise
    
    df = pd.DataFrame({
        "experience_years": np.round(experience, 1),
        "skill_count": skill_count,
        "education_level": edu_score,
        "target_score": np.round(target_score, 2)
    })
    
    X = df[["experience_years", "skill_count", "education_level"]]
    y = df["target_score"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = math.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Coefficients
    coefficients = {
        "experience_years": round(float(model.coef_[0]), 3),
        "skill_count": round(float(model.coef_[1]), 3),
        "education_level": round(float(model.coef_[2]), 3),
        "intercept": round(float(model.intercept_), 3)
    }
    
    # Sample predictions for plotting/visualization
    test_results = []
    for actual, pred, (_, row) in zip(y_test.values, y_pred, X_test.iterrows()):
        test_results.append({
            "experience": float(row["experience_years"]),
            "skills": int(row["skill_count"]),
            "education": int(row["education_level"]),
            "actual": round(float(actual), 2),
            "predicted": round(float(pred), 2),
            "error": round(float(actual - pred), 2)
        })
        
    return {
        "module": "Week 2 ML Experiment / Learning Module",
        "model_type": "Linear Regression (Ordinary Least Squares)",
        "total_samples": n_samples,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "features": ["Experience (Years)", "Skill Count", "Education Level"],
        "target": "Candidate Compensation / Assessment Score",
        "coefficients": coefficients,
        "metrics": {
            "MAE": round(float(mae), 3),
            "MSE": round(float(mse), 3),
            "RMSE": round(float(rmse), 3),
            "R2": round(float(r2), 4)
        },
        "sample_data": df.head(10).to_dict(orient="records"),
        "test_predictions": test_results[:15]
    }


# Week 3 Synthetic Classification Training Dataset
SAMPLE_TRAINING_CORPUS = [
    # Software Engineering
    ("Experienced Full Stack Developer proficient in React, Node.js, Express, TypeScript, REST APIs, and PostgreSQL database architecture.", "Software Engineering"),
    ("Backend Engineer building scalable microservices with Java, Spring Boot, Docker, Kubernetes, and Redis caching.", "Software Engineering"),
    ("Frontend Developer creating responsive web applications using Next.js, Tailwind CSS, Redux, and modern HTML/CSS.", "Software Engineering"),
    ("Software Engineer with expertise in C++, algorithms, data structures, multithreading, and system design.", "Software Engineering"),
    ("Web Developer skilled in Django, Python, HTML, CSS, JavaScript, and MySQL database management.", "Software Engineering"),
    
    # Data Science & AI/ML
    ("Data Scientist with hands-on experience in Machine Learning, Deep Learning, Python, Pandas, Scikit-learn, and PyTorch.", "Data Science & AI/ML"),
    ("AI Engineer specializing in NLP, transformers, spaCy, NLTK, Large Language Models, and TensorFlow.", "Data Science & AI/ML"),
    ("Data Analyst proficient in SQL, Pandas, NumPy, Tableau, Power BI, statistical analysis, and data visualization.", "Data Science & AI/ML"),
    ("Machine Learning Engineer developing computer vision and predictive models using OpenCV, Keras, and Scikit-learn.", "Data Science & AI/ML"),
    ("Big Data Engineer working with Python, Spark, Hadoop, Kafka, Pandas, and ETL pipelines.", "Data Science & AI/ML"),
    
    # Cloud & DevOps
    ("DevOps Engineer experienced with AWS, Terraform, Docker, Kubernetes, CI/CD pipelines, and Jenkins automation.", "Cloud & DevOps"),
    ("Cloud Solutions Architect specializing in Azure cloud infrastructure, Linux administration, and Ansible configuration.", "Cloud & DevOps"),
    ("Site Reliability Engineer managing GCP cloud workloads, Prometheus monitoring, Docker clusters, and Bash scripting.", "Cloud & DevOps"),
    ("Infrastructure Engineer skilled in Kubernetes orchestration, Linux system tuning, Terraform IaC, and Git workflows.", "Cloud & DevOps"),
    
    # Cybersecurity & Networks
    ("Cybersecurity Analyst skilled in ethical hacking, penetration testing, network security, Wireshark, and firewall auditing.", "Cybersecurity & Networks"),
    ("Information Security Officer with expertise in cryptography, SIEM tools, vulnerability assessment, and Linux security.", "Cybersecurity & Networks"),
    ("Network Engineer configuring Cisco routers, switches, TCP/IP networking, VPN protocols, and network firewalls.", "Cybersecurity & Networks"),
    ("Security Engineer focused on threat modeling, application security, ethical hacking, and identity management.", "Cybersecurity & Networks")
]


def train_week3_classifier():
    """Trains the TF-IDF Vectorizer and Multinomial Naive Bayes model."""
    texts = [item[0] for item in SAMPLE_TRAINING_CORPUS]
    labels = [item[1] for item in SAMPLE_TRAINING_CORPUS]
    
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=100)
    X_tfidf = vectorizer.fit_transform(texts)
    
    clf = MultinomialNB()
    clf.fit(X_tfidf, labels)
    
    return vectorizer, clf


_global_tfidf, _global_nb = train_week3_classifier()


def run_week3_nlp_classification_experiment(input_text: str = "") -> Dict[str, Any]:
    """
    Week 3 Learning Module: NLP Text Classification Experiment
    Demonstrates:
    1. Preprocessing (tokenization, stopword removal)
    2. TF-IDF feature extraction (vocabulary & sparse vector representation)
    3. Multinomial Naive Bayes domain classification
    """
    if not input_text or not input_text.strip():
        input_text = "Experienced Data Scientist with skills in Python, Machine Learning, Pandas, Scikit-learn, and Deep Learning models."
        
    vectorizer = _global_tfidf
    clf = _global_nb
    
    # Transform input text
    X_input = vectorizer.transform([input_text])
    
    predicted_category = clf.predict(X_input)[0]
    probabilities = clf.predict_proba(X_input)[0]
    
    class_probs = []
    for cls, prob in zip(clf.classes_, probabilities):
        class_probs.append({
            "category": cls,
            "probability": round(float(prob) * 100, 2)
        })
    class_probs = sorted(class_probs, key=lambda x: x["probability"], reverse=True)
    
    # Extract top active TF-IDF terms in this text
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = X_input.toarray()[0]
    
    active_terms = []
    for idx, score in enumerate(tfidf_scores):
        if score > 0:
            active_terms.append({
                "term": feature_names[idx],
                "tfidf_weight": round(float(score), 4)
            })
    active_terms = sorted(active_terms, key=lambda x: x["tfidf_weight"], reverse=True)
    
    return {
        "module": "Week 3 NLP Text Classification Experiment",
        "input_text": input_text,
        "vocabulary_size": len(feature_names),
        "top_vocabulary_sample": list(feature_names[:30]),
        "active_tfidf_terms": active_terms,
        "predicted_category": predicted_category,
        "category_probabilities": class_probs,
        "model_architecture": "TF-IDF Vectorizer (1-2 ngrams) + Multinomial Naive Bayes (MultinomialNB)"
    }
