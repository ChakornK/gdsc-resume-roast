import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Resume } from "@prisma/client";

let cachedTime = 0;
let cachedData: {
  resumes: Resume[];
} | null = null;
const getFromPrisma = async () => {
  if (cachedData && Date.now() - cachedTime < 1000 * 8) {
    return cachedData;
  }
  const resumes = await prisma.resume.findMany({
    orderBy: [
      {
        reviews: {
          _count: "asc",
        },
      },
    ],
  });
  cachedTime = Date.now();
  cachedData = { resumes };
  return { resumes };
};
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { resumes } = await getFromPrisma();
    const res = resumes
      .filter((r) => r.id != id)
      .map((r: Partial<Resume>) => {
        delete r.id;
        return r;
      });

    return NextResponse.json(res);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
