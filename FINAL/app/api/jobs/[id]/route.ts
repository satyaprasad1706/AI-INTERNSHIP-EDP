import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            candidate: true,
          },
          orderBy: { rank: "asc" },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        requiredSkills: JSON.parse(job.requiredSkills || "[]"),
        matches: job.matches.map((m) => ({
          ...m,
          matchingSkills: JSON.parse(m.matchingSkills || "[]"),
          missingSkills: JSON.parse(m.missingSkills || "[]"),
          candidate: {
            ...m.candidate,
            skills: JSON.parse(m.candidate.skills || "[]"),
            keywords: JSON.parse(m.candidate.keywords || "[]"),
          },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
