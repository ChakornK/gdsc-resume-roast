import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

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

    return NextResponse.json(resumes);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { message: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
