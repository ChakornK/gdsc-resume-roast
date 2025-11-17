import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: NextRequest) {
  try {
    const aggregatedReviews = await prisma.review.groupBy({
      by: ["resumeId"],
      _avg: {
        structure: true,
        clarity: true,
        formatting: true,
        relevance: true,
        wording: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        resumeId: "asc",
      },
    });
    const reviews = await prisma.review.findMany({});

    const resumes = await prisma.resume.findMany({});

    const res = aggregatedReviews.map((r) => {
      const resume = resumes.find((resume) => resume.id == r.resumeId);
      const comments = reviews
        .filter((review) => review.resumeId == r.resumeId)
        .map((review) => review.comments);
      return {
        ...r,
        resumeLink: resume?.link,
        comments,
      };
    });

    return NextResponse.json(res);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
