import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const search = searchParams.get("search");

    const where: any = {};
    if (format && format !== "ALL") {
      where.resumeFormat = format;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
        { experience: { contains: search } },
      ];
    }

    const records = await prisma.candidate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const parsed = records.map((r) => ({
      ...r,
      skills: JSON.parse(r.skills || "[]"),
      keywords: JSON.parse(r.keywords || "[]"),
    }));

    return NextResponse.json({ success: true, count: parsed.length, data: parsed });
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Forward to Python NLP microservice for parsing
    const pythonFormData = new FormData();
    for (const file of files) {
      pythonFormData.append("files", file, file.name);
    }

    const pyResponse = await fetch(`${PYTHON_SERVICE_URL}/api/process-resumes-batch`, {
      method: "POST",
      body: pythonFormData,
    });

    if (!pyResponse.ok) {
      const errText = await pyResponse.text();
      throw new Error(`Python NLP Service error: ${errText}`);
    }

    const pyResult = await pyResponse.json();
    const savedCandidates = [];

    // Save each parsed candidate to SQLite database via Prisma
    for (const item of pyResult.results) {
      const candidate = await prisma.candidate.create({
        data: {
          name: item.candidateName || "Candidate",
          email: item.email || "N/A",
          phone: item.phone || "N/A",
          linkedin: item.linkedin || null,
          github: item.github || null,
          education: item.education || "Bachelor's Degree",
          experience: item.experience || "Not specified",
          resumeFile: item.resumeFile,
          resumeFormat: item.resumeFormat,
          skills: JSON.stringify(item.skills || []),
          keywords: JSON.stringify(item.keywords || []),
          rawText: item.rawText || "",
          cleanedText: item.cleanedText || "",
        },
      });

      savedCandidates.push({
        ...candidate,
        skills: item.skills,
        keywords: item.keywords,
      });
    }

    return NextResponse.json({
      success: true,
      processed: savedCandidates.length,
      failed: pyResult.failed_count || 0,
      errors: pyResult.errors || [],
      data: savedCandidates,
    });
  } catch (error: any) {
    console.error("Error processing resumes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process resumes. Ensure Python backend is running on port 8000.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.match.deleteMany({});
    await prisma.candidate.deleteMany({});
    return NextResponse.json({ success: true, message: "All candidates and matches deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
