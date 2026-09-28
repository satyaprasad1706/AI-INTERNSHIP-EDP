import { NextRequest, NextResponse } from "next/server";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testSize = searchParams.get("testSize") || "0.25";

    const pyRes = await fetch(
      `${PYTHON_SERVICE_URL}/api/experiments/week2-regression?test_size=${testSize}`,
      { method: "GET" }
    );

    if (!pyRes.ok) {
      throw new Error(`Python service responded with status: ${pyRes.status}`);
    }

    const data = await pyRes.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to run Week 2 Linear Regression experiment",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    const pyRes = await fetch(`${PYTHON_SERVICE_URL}/api/experiments/week3-nlp-classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text || "" }),
    });

    if (!pyRes.ok) {
      throw new Error(`Python service responded with status: ${pyRes.status}`);
    }

    const data = await pyRes.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to run Week 3 NLP experiment",
      },
      { status: 500 }
    );
  }
}
