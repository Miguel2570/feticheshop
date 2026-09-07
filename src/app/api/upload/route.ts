// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    const urls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/images/reviews", fileName);
      
      await writeFile(filePath, buffer);
      urls.push(`/images/reviews/${fileName}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { message: "Erro ao fazer upload" },
      { status: 500 }
    );
  }
}