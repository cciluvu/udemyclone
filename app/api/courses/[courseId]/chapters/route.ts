import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();
    const { courseId } = params;
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const position = lastChapter?.position ? lastChapter.position + 1 : 1;
    const chapter = await db.chapter.create({
      data: { title, courseId, position },
    });
    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
