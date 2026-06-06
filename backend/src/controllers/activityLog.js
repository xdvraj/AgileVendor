const ActivityLog = require("../models/ActivityLog");
const catchAsync = require("../utils/catchAsync");

const getAll = catchAsync(async (req, res) => {
  const { entity, action, sortBy, order } = req.query;

  const filter = {};
  if (entity) filter.entity = entity;
  if (action) filter.action = { $regex: action, $options: "i" };

  const sortField = ["createdAt", "action", "entity"].includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "ASC" ? 1 : -1;

  const logs = await ActivityLog.find(filter)
    .populate("performedBy", "name email role")
    .sort({ [sortField]: sortOrder });

  res.json({ success: true, count: logs.length, data: logs });
});

module.exports = { getAll };
