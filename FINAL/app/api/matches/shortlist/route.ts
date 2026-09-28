import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, shortlisted, jobId, shortlistMode, threshold, topN } = body;

    // Single toggle
    if (matchId !== undefined && shortlisted !== undefined) {
      const updated = await prisma.match.update({
        where: { id: matchId },
        data: { shortlisted: Boolean(shortlisted) },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // Bulk rule re-evaluation for a specific job
    if (jobId && shortlistMode) {
      const matches = await prisma.match.findMany({
        where: { jobId },
        orderBy: { rank: "asc" },
      });

      for (const m of matches) {
        let isShortlisted = false;
        if (shortlistMode === "top_n") {
          isShortlisted = m.rank <= Number(topN || 5);
        } else {
          isShortlisted = m.matchScore >= Number(threshold || 70.0);
        }
        await prisma.match.update({
          where: { id: m.id },
          data: { shortlisted: isShortlisted },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Shortlist criteria updated successfully for job`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid payload for shortlist update" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
