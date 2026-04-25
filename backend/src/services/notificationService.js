import prisma from "../config/database.js";

// Create notification
export const createNotification = async (recipientId, notificationData) => {
  const { senderId, title, message, type, relatedId } = notificationData;

  const notification = await prisma.notification.create({
    data: {
      recipientId,
      senderId,
      title,
      message,
      type,
      relatedId,
    },
    include: {
      recipient: {
        select: { id: true, name: true, email: true },
      },
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return notification;
};

// Get user notifications
export const getUserNotifications = async (userId, includeRead = false) => {
  const where = { recipientId: userId };

  if (!includeRead) {
    where.read = false;
  }

  return await prisma.notification.findMany({
    where,
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get notification by ID
export const getNotificationById = async (notificationId) => {
  return await prisma.notification.findUnique({
    where: { id: notificationId },
    include: {
      recipient: {
        select: { id: true, name: true, email: true },
      },
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
    include: {
      recipient: {
        select: { id: true, name: true, email: true },
      },
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { recipientId: userId, read: false },
    data: { read: true },
  });
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  return await prisma.notification.delete({
    where: { id: notificationId },
  });
};

// Get unread notification count
export const getUnreadNotificationCount = async (userId) => {
  return await prisma.notification.count({
    where: { recipientId: userId, read: false },
  });
};

// Send bulk notifications
export const sendBulkNotifications = async (userIds, notificationData) => {
  const { senderId, title, message, type, relatedId } = notificationData;

  const notifications = await Promise.all(
    userIds.map((userId) =>
      prisma.notification.create({
        data: {
          recipientId: userId,
          senderId,
          title,
          message,
          type,
          relatedId,
        },
      })
    )
  );

  return notifications;
};
