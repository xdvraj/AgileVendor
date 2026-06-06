const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { logActivity, notifyAdmins } = require("../utils/logger");

const getVendorRfqs = catchAsync(async (req, res) => {
  const rfqs = await Rfq.find({ status: "OPEN" })
    .populate("assignedVendors", "companyName")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  const myQuotations = await Quotation.find({ createdBy: req.user.userId }).select("rfq status");

  const quotedMap = {};
  for (const q of myQuotations) {
    const key = q.rfq.toString();
    if (!quotedMap[key]) quotedMap[key] = [];
    quotedMap[key].push({ id: q._id, status: q.status });
  }

  const data = rfqs.map((rfq) => ({
    ...rfq.toObject(),
    myQuotations: quotedMap[rfq._id.toString()] || [],
  }));

  res.json({ success: true, count: data.length, data });
});

const create = catchAsync(async (req, res) => {
  const rfq = await Rfq.findById(req.params.rfqId);
  if (!rfq) throw new AppError("RFQ not found.", 404);
  if (rfq.status !== "OPEN") throw new AppError("RFQ is not open for quotations.", 400);

  const existing = await Quotation.findOne({
    rfq: req.params.rfqId,
    createdBy: req.user.userId,
    status: { $in: ["DRAFT", "SUBMITTED"] },
  });
  if (existing) throw new AppError("You already have a quotation for this RFQ.", 409);

  const quotation = await Quotation.create({
    ...req.body,
    rfq: req.params.rfqId,
    createdBy: req.user.userId,
  });

  const populated = await quotation.populate("rfq", "rfqNumber title deadline");

  await logActivity({
    action: "Quotation submitted", entity: "Quotation", entityId: quotation._id,
    description: `Quotation submitted for RFQ ${rfq.rfqNumber}`,
    performedBy: req.user.userId, metadata: { totalAmount: quotation.totalAmount },
  });
  await notifyAdmins({
    title: "New Quotation Received", message: `A quotation has been submitted for ${rfq.rfqNumber}`,
    type: "info", link: `/rfqs/${rfq._id}/compare`,
    relatedTo: { entity: "Quotation", entityId: quotation._id },
  });

  res.status(201).json({ success: true, message: "Quotation submitted.", data: populated });
});

const update = catchAsync(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id);
  if (!quotation) throw new AppError("Quotation not found.", 404);
  if (quotation.createdBy.toString() !== req.user.userId) {
    throw new AppError("You can only edit your own quotations.", 403);
  }
  if (!["DRAFT", "EDITED"].includes(quotation.status)) {
    throw new AppError("Only drafts can be edited.", 400);
  }

  const body = { ...req.body };
  if (body.status === "SUBMITTED") {
    const rfq = await Rfq.findById(quotation.rfq);
    if (rfq && rfq.status !== "OPEN") throw new AppError("RFQ is no longer open.", 400);
  }

  const updated = await Quotation.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).populate("rfq", "rfqNumber title deadline");

  await logActivity({
    action: "Quotation updated", entity: "Quotation", entityId: quotation._id,
    description: `Quotation updated for RFQ`,
    performedBy: req.user.userId,
  });

  res.json({ success: true, message: "Quotation updated.", data: updated });
});

const getByRfq = catchAsync(async (req, res) => {
  const rfq = await Rfq.findById(req.params.rfqId);
  if (!rfq) throw new AppError("RFQ not found.", 404);

  const filter = { rfq: req.params.rfqId };

  if (req.user.role === "vendor") {
    filter.createdBy = req.user.userId;
  }

  const quotations = await Quotation.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: quotations.length, data: quotations });
});

module.exports = { getVendorRfqs, create, update, getByRfq };
