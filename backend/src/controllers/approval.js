const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const Approval = require("../models/Approval");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getAll = catchAsync(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status) filter.status = status;

  let approvals;
  if (req.user.role === "approver") {
    approvals = await Approval.find({ ...filter, assignedTo: req.user.userId })
      .populate("rfq", "rfqNumber title status")
      .populate("quotation", "totalAmount deliveryTimeline")
      .populate("requestedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
  } else {
    approvals = await Approval.find(filter)
      .populate("rfq", "rfqNumber title status")
      .populate("quotation", "totalAmount deliveryTimeline")
      .populate("requestedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
  }

  res.json({ success: true, count: approvals.length, data: approvals });
});

const create = catchAsync(async (req, res) => {
  const { rfqId, quotationId, assignedTo, remarks } = req.body;

  const rfq = await Rfq.findById(rfqId);
  if (!rfq) throw new AppError("RFQ not found.", 404);
  if (rfq.status !== "UNDER_REVIEW") {
    throw new AppError("RFQ must be UNDER_REVIEW before creating an approval request.", 400);
  }

  const quotation = await Quotation.findById(quotationId);
  if (!quotation) throw new AppError("Quotation not found.", 404);
  if (quotation.status !== "SELECTED") {
    throw new AppError("Only selected quotations can go for approval.", 400);
  }

  const existing = await Approval.findOne({ rfq: rfqId, status: "PENDING" });
  if (existing) throw new AppError("An approval request already exists for this RFQ.", 409);

  const approval = await Approval.create({
    rfq: rfqId,
    quotation: quotationId,
    requestedBy: req.user.userId,
    assignedTo: assignedTo || null,
    remarks: remarks || null,
    history: [{ action: "CREATED", by: req.user.userId, remarks: remarks || "Approval requested" }],
  });

  rfq.status = "APPROVAL_PENDING";
  await rfq.save();

  const populated = await approval
    .populate("rfq", "rfqNumber title")
    .populate("quotation", "totalAmount deliveryTimeline")
    .populate("requestedBy", "name email")
    .populate("assignedTo", "name email");

  res.status(201).json({ success: true, message: "Approval request created.", data: populated });
});

const approve = catchAsync(async (req, res) => {
  const approval = await Approval.findById(req.params.id);
  if (!approval) throw new AppError("Approval request not found.", 404);
  if (approval.status !== "PENDING") throw new AppError("Approval is not pending.", 400);

  const { remarks } = req.body;

  approval.status = "APPROVED";
  approval.remarks = remarks || approval.remarks;
  approval.approvedAt = new Date();
  approval.history.push({
    action: "APPROVED",
    by: req.user.userId,
    remarks: remarks || "Approved",
    timestamp: new Date(),
  });
  await approval.save();

  await Rfq.findByIdAndUpdate(approval.rfq, { status: "APPROVED" });
  await Quotation.findByIdAndUpdate(approval.quotation, { status: "SELECTED" });

  const populated = await approval
    .populate("rfq", "rfqNumber title status")
    .populate("quotation", "totalAmount deliveryTimeline status")
    .populate("requestedBy", "name email")
    .populate("assignedTo", "name email")
    .populate("history.by", "name email");

  res.json({ success: true, message: "Approval granted.", data: populated });
});

const reject = catchAsync(async (req, res) => {
  const approval = await Approval.findById(req.params.id);
  if (!approval) throw new AppError("Approval request not found.", 404);
  if (approval.status !== "PENDING") throw new AppError("Approval is not pending.", 400);

  const { remarks } = req.body;

  approval.status = "REJECTED";
  approval.remarks = remarks || approval.remarks;
  approval.rejectedAt = new Date();
  approval.history.push({
    action: "REJECTED",
    by: req.user.userId,
    remarks: remarks || "Rejected",
    timestamp: new Date(),
  });
  await approval.save();

  await Rfq.findByIdAndUpdate(approval.rfq, { status: "REJECTED" });

  const populated = await approval
    .populate("rfq", "rfqNumber title status")
    .populate("quotation", "totalAmount deliveryTimeline status")
    .populate("requestedBy", "name email")
    .populate("assignedTo", "name email")
    .populate("history.by", "name email");

  res.json({ success: true, message: "Approval rejected.", data: populated });
});

module.exports = { getAll, create, approve, reject };
