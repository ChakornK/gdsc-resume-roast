import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const {
      resumeLink,
      formatting,
      relevance,
      structure,
      clarity,
      wording,
      comments,
    } = await request.json();

    const resume = await prisma.resume.findFirstOrThrow({
      where: { link: resumeLink },
    });
    const resumeId = resume.id;

    await prisma.review.create({
      data: {
        resumeId,
        formatting,
        relevance,
        structure,
        clarity,
        wording,
        comments,
      },
    });

    return NextResponse.json("Review added successfully");
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to create new review" },
      { status: 500 }
    );
  }
}
