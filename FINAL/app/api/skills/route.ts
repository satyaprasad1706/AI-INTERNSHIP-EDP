import { NextRequest, NextResponse } from "next/server";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const pyRes = await fetch(`${PYTHON_SERVICE_URL}/api/skills`, { method: "GET" });
    if (!pyRes.ok) throw new Error("Failed to fetch skills from Python service");
    const data = await pyRes.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pyRes = await fetch(`${PYTHON_SERVICE_URL}/api/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!pyRes.ok) {
      const err = await pyRes.json();
      throw new Error(err.detail || "Failed to add skill");
    }
    const data = await pyRes.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
