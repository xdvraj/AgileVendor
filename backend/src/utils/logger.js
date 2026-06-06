const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const User = require("../models/User");

async function logActivity({ action, entity, entityId, description, performedBy, metadata }) {
  try {
    await ActivityLog.create({ action, entity, entityId, description, performedBy, metadata });
  } catch (err) {
    console.error("[LOGGER] Failed to log activity:", err.message);
  }
}

async function notifyAdmins({ title, message, type = "info", link, relatedTo }) {
  try {
    const admins = await User.find({ role: { $in: ["admin", "procurement_officer"] } }).select("_id");
    const notifications = admins.map((user) => ({
      user: user._id,
      title,
      message,
      type,
      link,
      relatedTo,
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error("[LOGGER] Failed to notify admins:", err.message);
  }
}

async function notifyUser({ userId, title, message, type = "info", link, relatedTo }) {
  try {
    await Notification.create({ user: userId, title, message, type, link, relatedTo });
  } catch (err) {
    console.error("[LOGGER] Failed to notify user:", err.message);
  }
}

module.exports = { logActivity, notifyAdmins, notifyUser };
