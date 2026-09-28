import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        matches: {
          select: {
            id: true,
            matchScore: true,
            shortlisted: true,
          },
        },
      },
    });

    const formatted = jobs.map((j) => ({
      ...j,
      requiredSkills: JSON.parse(j.requiredSkills || "[]"),
      matchCount: j.matches.length,
      shortlistedCount: j.matches.filter((m) => m.shortlisted).length,
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
    const { title, company, description, requiredSkills: inputSkills } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and Description are required." },
        { status: 400 }
      );
    }

    let finalSkills: string[] = [];

    if (Array.isArray(inputSkills) && inputSkills.length > 0) {
      finalSkills = inputSkills;
    } else {
      // Call Python NLP microservice to extract required skills from Job Description
      try {
        const pyRes = await fetch(`${PYTHON_SERVICE_URL}/api/extract-job-skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        if (pyRes.ok) {
          const pyData = await pyRes.json();
          finalSkills = pyData.skills || [];
        }
      } catch (err) {
        console.warn("Could not call Python skill extraction service:", err);
      }
    }

    const job = await prisma.job.create({
      data: {
        title: title.trim(),
        company: (company || "Company Inc.").trim(),
        description: description.trim(),
        requiredSkills: JSON.stringify(finalSkills),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        requiredSkills: finalSkills,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.match.deleteMany({});
    await prisma.job.deleteMany({});
    return NextResponse.json({ success: true, message: "All jobs and associated matches deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
