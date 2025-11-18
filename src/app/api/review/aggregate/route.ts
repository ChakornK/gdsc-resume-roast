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

    const res = aggregatedReviews.map(
      (
        r: Partial<
          (typeof aggregatedReviews)[0] & {
            resumeLink: string;
            comments: string[];
          }
        >
      ) => {
        const resume = resumes.find((resume) => resume.id == r.resumeId);
        const comments = reviews
          .filter((review) => review.resumeId == r.resumeId)
          .map((review) => review.comments);

        const processed = {
          ...r,
          resumeLink: resume?.link,
          comments,
        };
        delete processed.resumeId;

        return processed;
      }
    );

    return NextResponse.json(res);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
