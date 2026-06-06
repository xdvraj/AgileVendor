const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getAll = catchAsync(async (req, res) => {
  const { isRead } = req.query;

  const filter = { user: req.user.userId };
  if (isRead === "true") filter.isRead = true;
  if (isRead === "false") filter.isRead = false;

  const notifications = await Notification.find(filter).sort({ createdAt: -1 });

  const unreadCount = await Notification.countDocuments({ user: req.user.userId, isRead: false });

  res.json({ success: true, unreadCount, count: notifications.length, data: notifications });
});

const markRead = catchAsync(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new AppError("Notification not found.", 404);
  if (notification.user.toString() !== req.user.userId) {
    throw new AppError("Not authorized.", 403);
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, message: "Notification marked as read.", data: notification });
});

module.exports = { getAll, markRead };
