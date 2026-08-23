import { prisma } from "@/lib/prisma";

interface CreateNotificationProps {
  title: string;
  message?: string;
  type: "stock_low" | "new_order" | "new_user" | "sync_error" | "sync_success";
}

export async function createNotification({
  title,
  message,
  type,
}: CreateNotificationProps) {
  await prisma.adminNotification.create({
    data: {
      title,
      message,
      type,
    },
  });
}

export async function getUnreadNotifications() {
  const notifications = await prisma.adminNotification.findMany({
    where: { isRead: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unreadCount = await prisma.adminNotification.count({
    where: { isRead: false },
  });

  return { notifications, unreadCount };
}

export async function markAllAsRead() {
  await prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
}

export async function markAsRead(id: string) {
  await prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });
}