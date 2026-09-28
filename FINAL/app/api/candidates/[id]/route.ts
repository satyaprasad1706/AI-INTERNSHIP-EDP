import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        matches: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    const formatted = {
      ...candidate,
      skills: JSON.parse(candidate.skills || "[]"),
      keywords: JSON.parse(candidate.keywords || "[]"),
      matches: candidate.matches.map((m) => ({
        ...m,
        matchingSkills: JSON.parse(m.matchingSkills || "[]"),
        missingSkills: JSON.parse(m.missingSkills || "[]"),
        job: {
          ...m.job,
          requiredSkills: JSON.parse(m.job.requiredSkills || "[]"),
        },
      })),
    };

    return NextResponse.json({ success: true, data: formatted });
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
    await prisma.candidate.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Candidate deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
