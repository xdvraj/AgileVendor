const PurchaseOrder = require("../models/PurchaseOrder");
const Invoice = require("../models/Invoice");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getAll = catchAsync(async (req, res) => {
  const { status, search, sortBy, order } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { "vendor.companyName": { $regex: search, $options: "i" } },
    ];
  }

  const sortField = ["invoiceNumber", "totalAmount", "status", "createdAt", "updatedAt"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortOrder = order === "ASC" ? 1 : -1;

  const invoices = await Invoice.find(filter)
    .populate("po", "poNumber")
    .populate("rfq", "rfqNumber title")
    .populate("createdBy", "name email")
    .sort({ [sortField]: sortOrder });

  res.json({ success: true, count: invoices.length, data: invoices });
});

const getById = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("po", "poNumber status")
    .populate("rfq", "rfqNumber title description")
    .populate("quotation", "deliveryTimeline notes")
    .populate("createdBy", "name email");

  if (!invoice) throw new AppError("Invoice not found.", 404);

  res.json({ success: true, data: invoice });
});

const create = catchAsync(async (req, res) => {
  const { poId } = req.body;

  const po = await PurchaseOrder.findById(poId);
  if (!po) throw new AppError("Purchase order not found.", 404);
  if (po.status === "INVOICED") {
    throw new AppError("Invoice already generated for this PO.", 409);
  }
  if (po.status === "CANCELLED") {
    throw new AppError("Cannot create invoice for a cancelled PO.", 400);
  }
  if (po.status !== "SENT_TO_VENDOR" && po.status !== "ACCEPTED") {
    throw new AppError("PO must be sent or accepted before invoicing.", 400);
  }

  const existing = await Invoice.findOne({ po: poId });
  if (existing) throw new AppError("An invoice already exists for this PO.", 409);

  const invoice = await Invoice.create({
    po: po._id,
    rfq: po.rfq,
    quotation: po.quotation,
    vendor: po.vendor,
    items: po.items,
    price: po.price,
    tax: po.tax,
    totalAmount: po.totalAmount,
    deliveryTimeline: po.deliveryTimeline,
    notes: po.notes,
    createdBy: req.user.userId,
  });

  po.status = "INVOICED";
  await po.save();

  const populated = await invoice
    .populate("po", "poNumber")
    .populate("rfq", "rfqNumber title")
    .populate("createdBy", "name email");

  res.status(201).json({ success: true, message: "Invoice generated.", data: populated });
});

const download = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("po", "poNumber")
    .populate("rfq", "rfqNumber title")
    .populate("createdBy", "name email");

  if (!invoice) throw new AppError("Invoice not found.", 404);

  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.createdAt,
    status: invoice.status,
    vendor: invoice.vendor,
    rfq: invoice.rfq,
    po: invoice.po,
    items: invoice.items.map((item, i) => ({
      srNo: i + 1,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      tax: item.tax,
      total: item.total,
    })),
    summary: {
      subtotal: invoice.price,
      tax: invoice.tax,
      grandTotal: invoice.totalAmount,
    },
    notes: invoice.notes,
    generatedBy: invoice.createdBy,
  };

  res.json({
    success: true,
    message: "Invoice data ready for download.",
    data: invoiceData,
  });
});

const email = catchAsync(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new AppError("Invoice not found.", 404);
  if (invoice.status === "CANCELLED") throw new AppError("Cannot send a cancelled invoice.", 400);

  invoice.status = "SENT";
  invoice.sentAt = new Date();
  await invoice.save();

  const populated = await invoice
    .populate("po", "poNumber")
    .populate("rfq", "rfqNumber title")
    .populate("createdBy", "name email");

  res.json({
    success: true,
    message: `Invoice sent to ${invoice.vendor.email}.`,
    data: populated,
  });
});

module.exports = { getAll, getById, create, download, email };
