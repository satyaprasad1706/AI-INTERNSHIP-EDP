import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const shortlistedOnly = searchParams.get("shortlisted") === "true";

    const where: any = {};
    if (jobId) where.jobId = jobId;
    if (shortlistedOnly) where.shortlisted = true;

    const matches = await prisma.match.findMany({
      where,
      include: {
        candidate: true,
        job: true,
      },
      orderBy: { rank: "asc" },
    });

    const formatted = matches.map((m) => ({
      id: m.id,
      candidateId: m.candidateId,
      jobId: m.jobId,
      candidateName: m.candidate.name,
      candidateEmail: m.candidate.email,
      candidatePhone: m.candidate.phone,
      resumeFile: m.candidate.resumeFile,
      resumeFormat: m.candidate.resumeFormat,
      candidateSkills: JSON.parse(m.candidate.skills || "[]"),
      requiredSkills: JSON.parse(m.job.requiredSkills || "[]"),
      matchingSkills: JSON.parse(m.matchingSkills || "[]"),
      missingSkills: JSON.parse(m.missingSkills || "[]"),
      matchScore: m.matchScore,
      rank: m.rank,
      shortlisted: m.shortlisted,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, shortlistMode = "threshold", threshold = 70.0, topN = 5 } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId is required to run matching." },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    const requiredSkills: string[] = JSON.parse(job.requiredSkills || "[]");
    if (requiredSkills.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected job has no required skills extracted. Please add required skills to the job.",
        },
        { status: 400 }
      );
    }

    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No candidates found in database. Please upload resumes first.",
        },
        { status: 400 }
      );
    }

    // Process matching for all candidates
    const rawMatches = [];
    const reqSet = new Map<string, string>(
      requiredSkills.map((s) => [s.trim().toLowerCase(), s.trim()])
    );

    for (const candidate of candidates) {
      const candSkills: string[] = JSON.parse(candidate.skills || "[]");
      const candSet = new Map<string, string>(
        candSkills.map((s) => [s.trim().toLowerCase(), s.trim()])
      );

      const matching: string[] = [];
      const missing: string[] = [];

      for (const [reqLower, originalReq] of reqSet.entries()) {
        if (candSet.has(reqLower)) {
          matching.push(originalReq);
        } else {
          missing.push(originalReq);
        }
      }

      const totalRequired = requiredSkills.length;
      const totalMatched = matching.length;
      const rawScore = totalRequired > 0 ? (totalMatched / totalRequired) * 100 : 0;
      const matchScore = Math.round(rawScore * 100) / 100;

      rawMatches.push({
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        candidatePhone: candidate.phone,
        resumeFile: candidate.resumeFile,
        resumeFormat: candidate.resumeFormat,
        candidateSkills: candSkills,
        matchingSkills: matching,
        missingSkills: missing,
        matchScore,
      });
    }

    // Call Python ranking engine or perform in-memory deterministic sort
    // Week 6: Sort by matchScore DESC
    rawMatches.sort((a, b) => b.matchScore - a.matchScore || b.matchingSkills.length - a.matchingSkills.length);

    const rankedResults = rawMatches.map((item, index) => {
      const rank = index + 1;
      let shortlisted = false;
      if (shortlistMode === "top_n") {
        shortlisted = rank <= Number(topN);
      } else {
        shortlisted = item.matchScore >= Number(threshold);
      }
      return {
        ...item,
        rank,
        shortlisted,
      };
    });

    // Save/Update in SQLite database
    const savedMatches = [];
    for (const item of rankedResults) {
      const matchRecord = await prisma.match.upsert({
        where: {
          candidateId_jobId: {
            candidateId: item.candidateId,
            jobId: job.id,
          },
        },
        create: {
          candidateId: item.candidateId,
          jobId: job.id,
          matchingSkills: JSON.stringify(item.matchingSkills),
          missingSkills: JSON.stringify(item.missingSkills),
          matchScore: item.matchScore,
          rank: item.rank,
          shortlisted: item.shortlisted,
        },
        update: {
          matchingSkills: JSON.stringify(item.matchingSkills),
          missingSkills: JSON.stringify(item.missingSkills),
          matchScore: item.matchScore,
          rank: item.rank,
          shortlisted: item.shortlisted,
        },
      });

      savedMatches.push({
        id: matchRecord.id,
        ...item,
        jobId: job.id,
        requiredSkills,
      });
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        requiredSkills,
      },
      totalCandidates: candidates.length,
      shortlistedCount: rankedResults.filter((r) => r.shortlisted).length,
      data: savedMatches,
    });
  } catch (error: any) {
    console.error("Matching error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate matches" },
      { status: 500 }
    );
  }
}
