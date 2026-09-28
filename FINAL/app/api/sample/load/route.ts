import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const baseDir = process.cwd();
    const sampleDir = path.join(baseDir, "data", "sample");

    // Check if sample directory exists
    if (!fs.existsSync(sampleDir)) {
      return NextResponse.json(
        { success: false, error: "Sample data directory not found." },
        { status: 404 }
      );
    }

    const sampleCandidates = [
      {
        name: "Rahul Kumar",
        email: "rahul.kumar@example.com",
        phone: "+91 9876543210",
        linkedin: "https://linkedin.com/in/rahulkumar-dev",
        github: "https://github.com/rahulkumar",
        education: "B.Tech in Computer Science, IIT Delhi",
        experience: "4 years of experience",
        resumeFile: "rahul_kumar_resume.pdf",
        resumeFormat: "PDF",
        skills: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "SQL", "PostgreSQL", "Docker", "Git", "REST API", "Tailwind CSS"],
        keywords: ["Full Stack", "Microservices", "Optimization", "Database Design", "Web Architecture"],
        rawText: "Rahul Kumar\nFull Stack Engineer with 4 years of experience...",
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 9811122233",
        linkedin: "https://linkedin.com/in/priyasharma-ai",
        github: "https://github.com/priyasharma",
        education: "M.Tech in Artificial Intelligence, BITS Pilani",
        experience: "3+ years of experience",
        resumeFile: "priya_sharma_resume.txt",
        resumeFormat: "TXT",
        skills: ["Python", "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "Scikit-learn", "PyTorch", "SQL", "Git", "spaCy"],
        keywords: ["Natural Language Processing", "Document Classification", "Predictive Modeling", "Transformers", "Data Science"],
        rawText: "Priya Sharma\nData Scientist and NLP Specialist...",
      },
      {
        name: "Arjun Reddy",
        email: "arjun.reddy@example.com",
        phone: "+91 9700011223",
        linkedin: "https://linkedin.com/in/arjunreddy-cloud",
        github: "https://github.com/arjunreddy",
        education: "B.Tech in Information Technology, NIT Warangal",
        experience: "5 years of experience",
        resumeFile: "arjun_reddy_resume.pdf",
        resumeFormat: "PDF",
        skills: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Jenkins", "Bash", "Python", "Git", "Ansible"],
        keywords: ["DevOps", "Infrastructure as Code", "Kubernetes Cluster", "Deployment Automation", "Cloud"],
        rawText: "Arjun Reddy\nDevOps & Cloud Engineer...",
      },
      {
        name: "Sneha Patel",
        email: "sneha.patel@example.com",
        phone: "+91 9922233445",
        linkedin: "https://linkedin.com/in/snehapatel-frontend",
        github: "https://github.com/snehapatel",
        education: "B.E. in Computer Engineering, Mumbai University",
        experience: "2 years",
        resumeFile: "sneha_patel_resume.txt",
        resumeFormat: "TXT",
        skills: ["JavaScript", "TypeScript", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Git", "REST API"],
        keywords: ["Frontend Engineering", "UI Components", "Responsive Design", "State Management"],
        rawText: "Sneha Patel\nFrontend Specialist...",
      },
      {
        name: "Karthik Iyer",
        email: "karthik.iyer@example.com",
        phone: "+91 9845012345",
        linkedin: "https://linkedin.com/in/karthikiyer-backend",
        github: "https://github.com/karthikiyer",
        education: "B.Tech in Computer Science, Anna University",
        experience: "3 years",
        resumeFile: "karthik_iyer_resume.pdf",
        resumeFormat: "PDF",
        skills: ["Java", "Spring Boot", "Spring", "MySQL", "PostgreSQL", "Redis", "Kafka", "Docker", "Git", "REST API", "Microservices"],
        keywords: ["Backend Services", "Distributed Systems", "Message Queues", "Payment Processing"],
        rawText: "Karthik Iyer\nBackend Software Developer...",
      },
      {
        name: "Ananya Roy",
        email: "ananya.roy@example.com",
        phone: "+91 9830055667",
        linkedin: "https://linkedin.com/in/ananyaroy-data",
        github: "https://github.com/ananyaroy",
        education: "M.Sc in Data Science, Calcutta University",
        experience: "2 years",
        resumeFile: "ananya_roy_resume.txt",
        resumeFormat: "TXT",
        skills: ["Python", "SQL", "Pandas", "NumPy", "Tableau", "Power BI", "Scikit-learn", "Machine Learning", "Excel", "Git"],
        keywords: ["Data Analytics", "Business Intelligence", "Statistical Analysis", "Executive Dashboards"],
        rawText: "Ananya Roy\nData Analyst and ML Practitioner...",
      },
      {
        name: "Vikram Malhotra",
        email: "vikram.m@example.com",
        phone: "+91 9819988776",
        linkedin: "https://linkedin.com/in/vikram-sec",
        github: "https://github.com/vikramsec",
        education: "B.Tech in Information Security, SRM University",
        experience: "4 years of experience",
        resumeFile: "vikram_malhotra_resume.pdf",
        resumeFormat: "PDF",
        skills: ["Cybersecurity", "Network Security", "Ethical Hacking", "Linux", "Computer Networks", "Cryptography", "Python", "Bash", "Git"],
        keywords: ["Penetration Testing", "Security Auditing", "Vulnerability Management", "Network Protocols"],
        rawText: "Vikram Malhotra\nCybersecurity Analyst...",
      },
      {
        name: "Pooja Gupta",
        email: "pooja.gupta@example.com",
        phone: "+91 9711223344",
        linkedin: "https://linkedin.com/in/poojagupta-dev",
        github: "https://github.com/poojagupta",
        education: "MCA, Delhi University",
        experience: "Fresher",
        resumeFile: "pooja_gupta_resume.txt",
        resumeFormat: "TXT",
        skills: ["JavaScript", "HTML", "CSS", "React", "Node.js", "Express", "MongoDB", "Git", "Data Structures", "Algorithms"],
        keywords: ["Full Stack Development", "MERN Stack", "Problem Solving", "Web Applications"],
        rawText: "Pooja Gupta\nMCA Graduate...",
      },
      {
        name: "Rohan Joshi",
        email: "rohan.joshi@example.com",
        phone: "+91 9820123456",
        linkedin: "https://linkedin.com/in/rohanjoshi-ml",
        github: "https://github.com/rohanjoshi",
        education: "B.Tech in Computer Engineering, Pune University",
        experience: "1 year",
        resumeFile: "rohan_joshi_resume.pdf",
        resumeFormat: "PDF",
        skills: ["Python", "TensorFlow", "Keras", "OpenCV", "Deep Learning", "Machine Learning", "NumPy", "Pandas", "Git"],
        keywords: ["Computer Vision", "Neural Networks", "Image Processing", "Model Training"],
        rawText: "Rohan Joshi\nAI & Computer Vision Engineer...",
      },
      {
        name: "Neha Verma",
        email: "neha.verma@example.com",
        phone: "+91 9899123456",
        linkedin: "https://linkedin.com/in/nehaverma-fullstack",
        github: "https://github.com/nehaverma",
        education: "B.Tech in Information Technology, IP University",
        experience: "3 years",
        resumeFile: "neha_verma_resume.txt",
        resumeFormat: "TXT",
        skills: ["Python", "Django", "React", "PostgreSQL", "AWS", "Git", "REST API", "Docker", "JavaScript", "HTML", "CSS"],
        keywords: ["Cloud Deployment", "SaaS Platform", "Web Applications", "Relational Databases"],
        rawText: "Neha Verma\nFull Stack Developer...",
      },
    ];

    // Clear existing for clean load
    await prisma.match.deleteMany({});
    await prisma.candidate.deleteMany({});
    await prisma.job.deleteMany({});

    // Insert Candidates
    for (const c of sampleCandidates) {
      await prisma.candidate.create({
        data: {
          name: c.name,
          email: c.email,
          phone: c.phone,
          linkedin: c.linkedin,
          github: c.github,
          education: c.education,
          experience: c.experience,
          resumeFile: c.resumeFile,
          resumeFormat: c.resumeFormat,
          skills: JSON.stringify(c.skills),
          keywords: JSON.stringify(c.keywords),
          rawText: c.rawText,
          cleanedText: c.rawText,
        },
      });
    }

    // Insert Sample Jobs
    const job1 = await prisma.job.create({
      data: {
        title: "Senior Full Stack Developer",
        company: "InnovateTech Solutions",
        description:
          "Looking for an experienced Full Stack Developer to build modern web applications using Python, React, Next.js, TypeScript, PostgreSQL, Docker, Git, REST API, and AWS.",
        requiredSkills: JSON.stringify([
          "Python",
          "React",
          "Next.js",
          "TypeScript",
          "PostgreSQL",
          "Docker",
          "Git",
          "REST API",
          "AWS",
        ]),
      },
    });

    const job2 = await prisma.job.create({
      data: {
        title: "AI & Data Science Engineer",
        company: "Cognitive AI Labs",
        description:
          "Cognitive AI Labs is seeking an AI/ML Engineer to design, train, and deploy natural language processing and predictive machine learning models using Python, Machine Learning, Deep Learning, NLP, Pandas, Scikit-learn, PyTorch, SQL, and Git.",
        requiredSkills: JSON.stringify([
          "Python",
          "Machine Learning",
          "Deep Learning",
          "NLP",
          "Pandas",
          "Scikit-learn",
          "PyTorch",
          "SQL",
          "Git",
        ]),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sample dataset (10 mixed PDF/TXT resumes & 2 jobs) loaded successfully.",
      candidatesLoaded: sampleCandidates.length,
      jobsLoaded: 2,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
