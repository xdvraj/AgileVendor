const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const Approval = require("../models/Approval");
const Vendor = require("../models/Vendor");
const PurchaseOrder = require("../models/PurchaseOrder");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { logActivity, notifyAdmins } = require("../utils/logger");

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

  await logActivity({
    action: "Approval request created", entity: "Approval", entityId: approval._id,
    description: `Approval requested for RFQ ${rfq.rfqNumber}`,
    performedBy: req.user.userId,
  });

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

  const quotation = await Quotation.findById(approval.quotation).populate("createdBy", "name email");
  if (quotation) {
    const vendor = await Vendor.findOne({ email: quotation.createdBy.email.toLowerCase() });
    const vendorData = vendor
      ? {
          companyName: vendor.companyName,
          contactPerson: vendor.contactPerson,
          email: vendor.email,
          phone: vendor.phone,
          gstNumber: vendor.gstNumber,
          address: vendor.address,
        }
      : { companyName: quotation.createdBy.name, email: quotation.createdBy.email };

    await PurchaseOrder.create({
      rfq: approval.rfq,
      quotation: approval.quotation,
      vendor: vendorData,
      items: quotation.items,
      price: quotation.price,
      tax: quotation.tax,
      totalAmount: quotation.totalAmount,
      deliveryTimeline: quotation.deliveryTimeline,
      notes: quotation.notes,
      createdBy: req.user.userId,
    });

    await Rfq.findByIdAndUpdate(approval.rfq, { status: "PO_CREATED" });
  }

  await logActivity({
    action: "Approval approved", entity: "Approval", entityId: approval._id,
    description: `Approval granted. PO auto-generated.`,
    performedBy: req.user.userId,
  });
  await notifyAdmins({
    title: "Approval Granted", message: "Approval approved and PO has been auto-generated.",
    type: "success", link: `/purchase-orders`,
    relatedTo: { entity: "Approval", entityId: approval._id },
  });

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

  await logActivity({
    action: "Approval rejected", entity: "Approval", entityId: approval._id,
    description: `Approval rejected.`,
    performedBy: req.user.userId, metadata: { remarks: remarks || null },
  });

  res.json({ success: true, message: "Approval rejected.", data: populated });
});

module.exports = { getAll, create, approve, reject };
