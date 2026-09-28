import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalCandidates,
      pdfCandidates,
      txtCandidates,
      totalJobs,
      matches,
      recentCandidates,
      recentJobs,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.count({ where: { resumeFormat: "PDF" } }),
      prisma.candidate.count({ where: { resumeFormat: "TXT" } }),
      prisma.job.count(),
      prisma.match.findMany({
        select: {
          matchScore: true,
          shortlisted: true,
        },
      }),
      prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const shortlistedCount = matches.filter((m) => m.shortlisted).length;
    const avgScore =
      matches.length > 0
        ? matches.reduce((acc, curr) => acc + curr.matchScore, 0) / matches.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalResumes: totalCandidates,
          processedResumes: totalCandidates,
          activeJobs: totalJobs,
          averageMatchScore: Math.round(avgScore * 100) / 100,
          shortlistedCandidates: shortlistedCount,
          totalMatches: matches.length,
          pdfCount: pdfCandidates,
          txtCount: txtCandidates,
        },
        recentCandidates: recentCandidates.map((c) => ({
          ...c,
          skills: JSON.parse(c.skills || "[]"),
          keywords: JSON.parse(c.keywords || "[]"),
        })),
        recentJobs: recentJobs.map((j) => ({
          ...j,
          requiredSkills: JSON.parse(j.requiredSkills || "[]"),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
