const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const Vendor = require("../models/Vendor");
const PurchaseOrder = require("../models/PurchaseOrder");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { logActivity, notifyAdmins } = require("../utils/logger");

const getAll = catchAsync(async (req, res) => {
  const { status, search, sortBy, order } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { poNumber: { $regex: search, $options: "i" } },
      { "vendor.companyName": { $regex: search, $options: "i" } },
    ];
  }

  const sortField = ["poNumber", "totalAmount", "status", "createdAt", "updatedAt"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortOrder = order === "ASC" ? 1 : -1;

  const pos = await PurchaseOrder.find(filter)
    .populate("rfq", "rfqNumber title")
    .populate("quotation", "totalAmount deliveryTimeline")
    .populate("createdBy", "name email")
    .sort({ [sortField]: sortOrder });

  res.json({ success: true, count: pos.length, data: pos });
});

const getById = catchAsync(async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id)
    .populate("rfq", "rfqNumber title description items deadline")
    .populate("quotation", "items price tax totalAmount deliveryTimeline notes")
    .populate("createdBy", "name email");

  if (!po) throw new AppError("Purchase order not found.", 404);

  res.json({ success: true, data: po });
});

const create = catchAsync(async (req, res) => {
  const { quotationId } = req.body;

  const quotation = await Quotation.findById(quotationId).populate("createdBy", "name email");
  if (!quotation) throw new AppError("Quotation not found.", 404);
  if (quotation.status !== "SELECTED") {
    throw new AppError("Only selected quotations can be converted to a PO.", 400);
  }

  const existing = await PurchaseOrder.findOne({ quotation: quotationId });
  if (existing) throw new AppError("A PO already exists for this quotation.", 409);

  const rfq = await Rfq.findById(quotation.rfq);
  if (!rfq) throw new AppError("RFQ not found.", 404);

  const vendors = await Vendor.findOne({ email: quotation.createdBy.email.toLowerCase() });
  const vendorData = vendors
    ? {
        companyName: vendors.companyName,
        contactPerson: vendors.contactPerson,
        email: vendors.email,
        phone: vendors.phone,
        gstNumber: vendors.gstNumber,
        address: vendors.address,
      }
    : {
        companyName: quotation.createdBy.name,
        email: quotation.createdBy.email,
      };

  const po = await PurchaseOrder.create({
    rfq: quotation.rfq,
    quotation: quotation._id,
    vendor: vendorData,
    items: quotation.items,
    price: quotation.price,
    tax: quotation.tax,
    totalAmount: quotation.totalAmount,
    deliveryTimeline: quotation.deliveryTimeline,
    notes: quotation.notes,
    createdBy: req.user.userId,
  });

  await Rfq.findByIdAndUpdate(quotation.rfq, { status: "PO_CREATED" });

  const populated = await po
    .populate("rfq", "rfqNumber title")
    .populate("quotation", "totalAmount deliveryTimeline")
    .populate("createdBy", "name email");

  await logActivity({
    action: "PO generated", entity: "PurchaseOrder", entityId: po._id,
    description: `PO ${po.poNumber} generated for ${vendorData.companyName}`,
    performedBy: req.user.userId, metadata: { totalAmount: po.totalAmount },
  });
  await notifyAdmins({
    title: "Purchase Order Generated", message: `PO ${po.poNumber} has been created.`,
    type: "success", link: `/purchase-orders/${po._id}`,
    relatedTo: { entity: "PurchaseOrder", entityId: po._id },
  });

  res.status(201).json({ success: true, message: "Purchase order created.", data: populated });
});

const send = catchAsync(async (req, res) => {
  const po = await PurchaseOrder.findById(req.params.id);
  if (!po) throw new AppError("Purchase order not found.", 404);
  if (po.status !== "GENERATED") throw new AppError("PO is already sent or cancelled.", 400);

  po.status = "SENT_TO_VENDOR";
  po.sentAt = new Date();
  await po.save();

  const populated = await po
    .populate("rfq", "rfqNumber title")
    .populate("quotation", "totalAmount deliveryTimeline")
    .populate("createdBy", "name email");

  await logActivity({
    action: "PO sent to vendor", entity: "PurchaseOrder", entityId: po._id,
    description: `PO ${po.poNumber} sent to ${po.vendor.companyName}`,
    performedBy: req.user.userId,
  });

  res.json({ success: true, message: "PO sent to vendor.", data: populated });
});

module.exports = { getAll, getById, create, send };
