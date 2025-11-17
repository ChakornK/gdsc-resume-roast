import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ message: "DB running" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "DB not running" }, { status: 500 });
  }
}
