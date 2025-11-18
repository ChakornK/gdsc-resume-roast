import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { s3, s3Put } from "@/lib/aws";

export async function POST(request: NextRequest) {
  try {
    const file = (await request.formData()).get("file");
    if (file instanceof File == false || file.type !== "application/pdf") {
      throw new Error("Invalid file type");
    }

    const fileName = `${crypto.randomUUID()}-${Date.now()}.pdf`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: `resumes/${fileName}`,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    };
    const location = await s3Put(params);

    const r = await prisma.resume.create({
      data: {
        link: location,
      },
    });

    return NextResponse.json(r);
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to create new resume" },
      { status: 500 }
    );
  }
}
