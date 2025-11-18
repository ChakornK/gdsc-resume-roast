import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Resume } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    const resumes = await prisma.resume.findMany({
      where: {
        NOT: {
          id: id,
        },
      },
      orderBy: [
        {
          reviews: {
            _count: "asc",
          },
        },
      ],
    });
    const res = resumes.map((r: Partial<Resume>) => {
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
