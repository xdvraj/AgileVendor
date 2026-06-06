const Rfq = require("../models/Rfq");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { logActivity, notifyAdmins } = require("../utils/logger");

const getAll = catchAsync(async (req, res) => {
  const { search, status, sortBy, order } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { rfqNumber: { $regex: search, $options: "i" } },
    ];
  }
  if (status) filter.status = status;

  const sortField = ["title", "rfqNumber", "status", "deadline", "createdAt", "updatedAt"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortOrder = order === "ASC" ? 1 : -1;

  const rfqs = await Rfq.find(filter)
    .populate("assignedVendors", "companyName email phone")
    .populate("createdBy", "name email")
    .sort({ [sortField]: sortOrder });

  res.json({ success: true, count: rfqs.length, data: rfqs });
});

const getById = catchAsync(async (req, res) => {
  const rfq = await Rfq.findById(req.params.id)
    .populate("assignedVendors", "companyName email phone contactPerson")
    .populate("createdBy", "name email");

  if (!rfq) {
    throw new AppError("RFQ not found.", 404);
  }

  res.json({ success: true, data: rfq });
});

const create = catchAsync(async (req, res) => {
  const { title, description, items, deadline, status, assignedVendors, attachments } = req.body;

  if (assignedVendors && assignedVendors.length > 0) {
    const valid = await Vendor.countDocuments({ _id: { $in: assignedVendors } });
    if (valid !== assignedVendors.length) {
      throw new AppError("One or more vendor IDs are invalid.", 400);
    }
  }

  const rfq = await Rfq.create({
    title,
    description,
    items,
    deadline: new Date(deadline),
    status,
    assignedVendors,
    attachments,
    createdBy: req.user.userId,
  });

  const populated = await rfq.populate("assignedVendors", "companyName email phone");

  await logActivity({
    action: "RFQ created", entity: "RFQ", entityId: rfq._id,
    description: `RFQ ${rfq.rfqNumber} - ${title} created`,
    performedBy: req.user.userId,
  });
  await notifyAdmins({
    title: "New RFQ Created", message: `RFQ ${rfq.rfqNumber}: ${title}`,
    type: "info", link: `/rfqs/${rfq._id}`,
    relatedTo: { entity: "RFQ", entityId: rfq._id },
  });

  res.status(201).json({ success: true, message: "RFQ created successfully.", data: populated });
});

const update = catchAsync(async (req, res) => {
  const rfq = await Rfq.findById(req.params.id);
  if (!rfq) {
    throw new AppError("RFQ not found.", 404);
  }

  if (req.body.assignedVendors) {
    const valid = await Vendor.countDocuments({ _id: { $in: req.body.assignedVendors } });
    if (valid !== req.body.assignedVendors.length) {
      throw new AppError("One or more vendor IDs are invalid.", 400);
    }
  }

  const body = { ...req.body };
  if (body.deadline) body.deadline = new Date(body.deadline);

  const updated = await Rfq.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  })
    .populate("assignedVendors", "companyName email phone")
    .populate("createdBy", "name email");

  await logActivity({
    action: "RFQ updated", entity: "RFQ", entityId: rfq._id,
    description: `RFQ ${rfq.rfqNumber} updated`,
    performedBy: req.user.userId,
  });

  res.json({ success: true, message: "RFQ updated successfully.", data: updated });
});

const remove = catchAsync(async (req, res) => {
  const rfq = await Rfq.findByIdAndDelete(req.params.id);
  if (!rfq) {
    throw new AppError("RFQ not found.", 404);
  }

  await logActivity({
    action: "RFQ deleted", entity: "RFQ", entityId: rfq._id,
    description: `RFQ ${rfq.rfqNumber} - ${rfq.title} deleted`,
    performedBy: req.user.userId,
  });

  res.json({ success: true, message: "RFQ deleted successfully." });
});

const assignVendors = catchAsync(async (req, res) => {
  const rfq = await Rfq.findById(req.params.id);
  if (!rfq) {
    throw new AppError("RFQ not found.", 404);
  }

  const { vendorIds } = req.body;
  const valid = await Vendor.countDocuments({ _id: { $in: vendorIds } });
  if (valid !== vendorIds.length) {
    throw new AppError("One or more vendor IDs are invalid.", 400);
  }

  const existingSet = new Set(rfq.assignedVendors.map((v) => v.toString()));
  const newVendors = vendorIds.filter((id) => !existingSet.has(id));
  rfq.assignedVendors.push(...newVendors);
  await rfq.save();

  const populated = await rfq.populate("assignedVendors", "companyName email phone");

  const assignedVendorsList = await Vendor.find({ _id: { $in: newVendors } }).select("companyName");
  const vendorNames = assignedVendorsList.map((v) => v.companyName).join(", ");

  await logActivity({
    action: "Vendors assigned to RFQ", entity: "RFQ", entityId: rfq._id,
    description: `${vendorNames} assigned to RFQ ${rfq.rfqNumber}`,
    performedBy: req.user.userId,
  });

  res.json({ success: true, message: "Vendors assigned successfully.", data: populated });
});

module.exports = { getAll, getById, create, update, remove, assignVendors };
