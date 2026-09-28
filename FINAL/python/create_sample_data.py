"""
Sample Data Generator
Generates realistic sample resumes in both TXT and PDF formats,
plus sample Job Descriptions in data/sample/
"""

import os
import fitz  # PyMuPDF


SAMPLE_CANDIDATES = [
    {
        "name": "Rahul Kumar",
        "email": "rahul.kumar@example.com",
        "phone": "+91 9876543210",
        "linkedin": "https://linkedin.com/in/rahulkumar-dev",
        "github": "https://github.com/rahulkumar",
        "education": "B.Tech in Computer Science, IIT Delhi",
        "experience": "4 years of experience",
        "summary": "Senior Full Stack Engineer with strong experience in building high-scale web platforms.",
        "skills": ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "SQL", "PostgreSQL", "Docker", "Git", "REST API", "Tailwind CSS"],
        "projects": "Built e-commerce microservices with Next.js and Django REST Framework. Optimized PostgreSQL queries by 40%."
    },
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "phone": "+91 9811122233",
        "linkedin": "https://linkedin.com/in/priyasharma-ai",
        "github": "https://github.com/priyasharma",
        "education": "M.Tech in Artificial Intelligence, BITS Pilani",
        "experience": "3+ years of experience",
        "summary": "Data Scientist and NLP Specialist with extensive work in Deep Learning and predictive modeling.",
        "skills": ["Python", "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "Scikit-learn", "PyTorch", "SQL", "Git", "spaCy"],
        "projects": "Implemented multi-class document classification pipeline achieving 94% F1-score with spaCy and Scikit-learn."
    },
    {
        "name": "Arjun Reddy",
        "email": "arjun.reddy@example.com",
        "phone": "+91 9700011223",
        "linkedin": "https://linkedin.com/in/arjunreddy-cloud",
        "github": "https://github.com/arjunreddy",
        "education": "B.Tech in Information Technology, NIT Warangal",
        "experience": "5 years of experience",
        "summary": "DevOps & Cloud Engineer specializing in Kubernetes cluster orchestration and CI/CD pipelines.",
        "skills": ["Linux", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Jenkins", "Bash", "Python", "Git", "Ansible"],
        "projects": "Automated zero-downtime deployments on AWS EKS using Terraform and GitHub Actions."
    },
    {
        "name": "Sneha Patel",
        "email": "sneha.patel@example.com",
        "phone": "+91 9922233445",
        "linkedin": "https://linkedin.com/in/snehapatel-frontend",
        "github": "https://github.com/snehapatel",
        "education": "B.E. in Computer Engineering, Mumbai University",
        "experience": "2 years",
        "summary": "Frontend Specialist passionate about modern reactive web apps and UI/UX design systems.",
        "skills": ["JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Git", "REST API"],
        "projects": "Created responsive dashboard UI components in React and Next.js with accessible Tailwind styling."
    },
    {
        "name": "Karthik Iyer",
        "email": "karthik.iyer@example.com",
        "phone": "+91 9845012345",
        "linkedin": "https://linkedin.com/in/karthikiyer-backend",
        "github": "https://github.com/karthikiyer",
        "education": "B.Tech in Computer Science, Anna University",
        "experience": "3 years",
        "summary": "Backend Software Developer experienced in Java enterprise applications and distributed systems.",
        "skills": ["Java", "Spring Boot", "Spring", "MySQL", "PostgreSQL", "Redis", "Kafka", "Docker", "Git", "REST API", "Microservices"],
        "projects": "Engineered high-throughput financial payment processing microservices using Spring Boot and Kafka."
    },
    {
        "name": "Ananya Roy",
        "email": "ananya.roy@example.com",
        "phone": "+91 9830055667",
        "linkedin": "https://linkedin.com/in/ananyaroy-data",
        "github": "https://github.com/ananyaroy",
        "education": "M.Sc in Data Science, Calcutta University",
        "experience": "2 years",
        "summary": "Data Analyst and Machine Learning practitioner skilled in statistical inference and business reporting.",
        "skills": ["Python", "SQL", "Pandas", "NumPy", "Tableau", "Power BI", "Scikit-learn", "Machine Learning", "Excel", "Git"],
        "projects": "Built automated customer churn prediction model and Tableau executive dashboards."
    },
    {
        "name": "Vikram Malhotra",
        "email": "vikram.m@example.com",
        "phone": "+91 9819988776",
        "linkedin": "https://linkedin.com/in/vikram-sec",
        "github": "https://github.com/vikramsec",
        "education": "B.Tech in Information Security, SRM University",
        "experience": "4 years of experience",
        "summary": "Cybersecurity Analyst specializing in vulnerability management, penetration testing, and network defense.",
        "skills": ["Cybersecurity", "Network Security", "Ethical Hacking", "Linux", "Computer Networks", "Cryptography", "Python", "Bash", "Git"],
        "projects": "Performed enterprise penetration audits and deployed automated SIEM intrusion detection scripts."
    },
    {
        "name": "Pooja Gupta",
        "email": "pooja.gupta@example.com",
        "phone": "+91 9711223344",
        "linkedin": "https://linkedin.com/in/poojagupta-dev",
        "github": "https://github.com/poojagupta",
        "education": "MCA, Delhi University",
        "experience": "Fresher",
        "summary": "Recent MCA graduate with solid foundations in data structures, algorithms, and full-stack JavaScript.",
        "skills": ["JavaScript", "HTML", "CSS", "React", "Node.js", "Express", "MongoDB", "Git", "Data Structures", "Algorithms"],
        "projects": "Developed full-stack task management application with MongoDB, Express, React, and Node (MERN)."
    },
    {
        "name": "Rohan Joshi",
        "email": "rohan.joshi@example.com",
        "phone": "+91 9820123456",
        "linkedin": "https://linkedin.com/in/rohanjoshi-ml",
        "github": "https://github.com/rohanjoshi",
        "education": "B.Tech in Computer Engineering, Pune University",
        "experience": "1 year",
        "summary": "Junior AI Engineer with focus on Computer Vision and Deep Learning pipelines.",
        "skills": ["Python", "TensorFlow", "Keras", "OpenCV", "Deep Learning", "Machine Learning", "NumPy", "Pandas", "Git"],
        "projects": "Built real-time road lane detection and traffic sign recognition using OpenCV and TensorFlow."
    },
    {
        "name": "Neha Verma",
        "email": "neha.verma@example.com",
        "phone": "+91 9899123456",
        "linkedin": "https://linkedin.com/in/nehaverma-fullstack",
        "github": "https://github.com/nehaverma",
        "education": "B.Tech in Information Technology, IP University",
        "experience": "3 years",
        "summary": "Full Stack Developer proficient in Python, Django, React, and cloud deployment.",
        "skills": ["Python", "Django", "React", "PostgreSQL", "AWS", "Git", "REST API", "Docker", "JavaScript", "HTML", "CSS"],
        "projects": "Architected multi-tenant SaaS portal with Django REST Framework and React."
    }
]


def create_sample_files():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sample_dir = os.path.join(base_dir, "data", "sample")
    os.makedirs(sample_dir, exist_ok=True)
    
    # 1. Create Resumes: 5 TXT and 5 PDF files
    for idx, cand in enumerate(SAMPLE_CANDIDATES):
        safe_name = cand["name"].lower().replace(" ", "_")
        resume_text = f"""{cand['name']}
Email: {cand['email']} | Phone: {cand['phone']}
LinkedIn: {cand['linkedin']} | GitHub: {cand['github']}
Education: {cand['education']}
Experience: {cand['experience']}

Professional Summary:
{cand['summary']}

Technical Skills:
{", ".join(cand['skills'])}

Key Projects & Experience:
{cand['projects']}
- Utilized agile methodologies and version control for collaborative development.
- Delivered robust software solutions adhering to clean code standards and system design principles.
"""
        # Alternate formats: even index -> PDF, odd index -> TXT
        if idx % 2 == 0:
            pdf_path = os.path.join(sample_dir, f"{safe_name}_resume.pdf")
            doc = fitz.open()
            page = doc.new_page()
            page.insert_text(fitz.Point(50, 60), resume_text, fontsize=11)
            doc.save(pdf_path)
            doc.close()
            print(f"Created PDF: {pdf_path}")
        else:
            txt_path = os.path.join(sample_dir, f"{safe_name}_resume.txt")
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(resume_text)
            print(f"Created TXT: {txt_path}")
            
    # 2. Create Sample Job Descriptions
    jobs = [
        {
            "filename": "job_description_fullstack.txt",
            "content": """Job Title: Senior Full Stack Developer
Company: InnovateTech Solutions
Location: Bangalore, India (Hybrid)
Experience: 3+ years

Job Description:
We are looking for an experienced Full Stack Developer to build modern, high-performance web applications.
The ideal candidate will design scalable RESTful APIs, develop intuitive frontend user interfaces, and collaborate with cross-functional teams.

Required Technical Skills:
- Python
- React
- Next.js
- TypeScript
- PostgreSQL
- Docker
- Git
- REST API
- AWS

Key Responsibilities:
- Build modular, maintainable full-stack software components.
- Integrate frontend client interfaces with secure backend microservices.
- Optimize database queries and ensure high system availability.
"""
        },
        {
            "filename": "job_description_datascience.txt",
            "content": """Job Title: AI & Data Science Engineer
Company: Cognitive AI Labs
Location: Hyderabad, India
Experience: 2-4 years

Job Description:
Cognitive AI Labs is seeking an AI/ML Engineer to design, train, and deploy natural language processing and predictive machine learning models.

Required Technical Skills:
- Python
- Machine Learning
- Deep Learning
- NLP
- Pandas
- Scikit-learn
- PyTorch
- SQL
- Git

Key Responsibilities:
- Clean and preprocess structured and unstructured text datasets.
- Develop, evaluate, and fine-tune machine learning and deep learning models.
- Deploy scalable inference pipelines for production analytics.
"""
        }
    ]
    
    for job in jobs:
        job_path = os.path.join(sample_dir, job["filename"])
        with open(job_path, "w", encoding="utf-8") as f:
            f.write(job["content"])
        print(f"Created Job Description: {job_path}")


if __name__ == "__main__":
    create_sample_files()
