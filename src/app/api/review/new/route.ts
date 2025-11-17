import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { resumeId, formatting, relevance, structure, clarity, wording } =
      await request.json();

    await prisma.review.create({
      data: {
        resumeId,
        formatting,
        relevance,
        structure,
        clarity,
        wording,
      },
    });

    return NextResponse.json("Review added successfully");
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to create new review" },
      { status: 500 }
    );
  }
}
