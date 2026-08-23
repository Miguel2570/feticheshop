import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = await prisma.adminNotification.count({
    where: { isRead: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH() {
  await prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}