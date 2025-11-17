import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_: NextRequest) {
  try {
    const reviews = await prisma.review.groupBy({
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

    const resumes = await prisma.resume.findMany({});

    const res = reviews.map((r) => {
      const resume = resumes.find((resume) => resume.id == r.resumeId);
      return {
        ...r,
        resumeLink: resume?.link,
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
