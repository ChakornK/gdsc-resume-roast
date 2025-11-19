import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AggregatedReview } from "@/lib/types";
import type { Resume, Review } from "@prisma/client";

let cachedTime = 0;
let cachedData: {
  aggregatedReviews: AggregatedReview[];
  reviews: Review[];
  resumes: Resume[];
} | null = null;
const getFromPrisma = async () => {
  if (cachedData && Date.now() - cachedTime < 1000 * 8) {
    return cachedData;
  }
  const [aggregatedReviews, reviews, resumes] = await Promise.all([
    prisma.review.groupBy({
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
    }),
    prisma.review.findMany({}),
    prisma.resume.findMany({}),
  ]);
  cachedTime = Date.now();
  cachedData = { aggregatedReviews, reviews, resumes };
  return { aggregatedReviews, reviews, resumes };
};

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { aggregatedReviews, reviews, resumes } = await getFromPrisma();

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
          self: r.resumeId == id,
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
