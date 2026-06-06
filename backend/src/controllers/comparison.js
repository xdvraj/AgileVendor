const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const compare = catchAsync(async (req, res) => {
  const { sortBy, order } = req.query;

  const rfq = await Rfq.findById(req.params.rfqId);
  if (!rfq) throw new AppError("RFQ not found.", 404);

  const quotations = await Quotation.find({
    rfq: req.params.rfqId,
    status: { $in: ["SUBMITTED", "EDITED", "SELECTED"] },
  })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  const vendorEmails = quotations.map((q) => q.createdBy?.email).filter(Boolean);
  const vendors = await Vendor.find({ email: { $in: vendorEmails } });
  const vendorMap = {};
  for (const v of vendors) {
    vendorMap[v.email.toLowerCase()] = v;
  }

  let rows = quotations.map((q) => {
    const vendor = vendorMap[q.createdBy?.email?.toLowerCase()];
    return {
      quotationId: q._id,
      vendorCompany: vendor?.companyName || q.createdBy?.name || "Unknown",
      vendorRating: vendor?.rating || 0,
      price: q.price,
      tax: q.tax,
      totalAmount: q.totalAmount,
      deliveryTimeline: q.deliveryTimeline,
      items: q.items,
      notes: q.notes,
      status: q.status,
      createdAt: q.createdAt,
    };
  });

  const lowestPrice = rows.length > 0 ? Math.min(...rows.map((r) => r.totalAmount)) : 0;

  rows = rows.map((r) => ({
    ...r,
    isLowestPrice: r.totalAmount === lowestPrice,
  }));

  const sortField = ["price", "totalAmount", "deliveryTimeline", "vendorRating", "createdAt"].includes(sortBy)
    ? sortBy
    : "totalAmount";
  const sortOrder = order === "ASC" ? 1 : -1;

  rows.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === "deliveryTimeline") {
      valA = a.deliveryTimeline ? parseInt(a.deliveryTimeline, 10) || 0 : 0;
      valB = b.deliveryTimeline ? parseInt(b.deliveryTimeline, 10) || 0 : 0;
    }
    if (valA < valB) return -1 * sortOrder;
    if (valA > valB) return 1 * sortOrder;
    return 0;
  });

  res.json({
    success: true,
    data: {
      rfq: { id: rfq._id, rfqNumber: rfq.rfqNumber, title: rfq.title, deadline: rfq.deadline },
      summary: {
        totalQuotations: rows.length,
        lowestPrice,
        currency: "INR",
      },
      rows,
    },
  });
});

const select = catchAsync(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id);
  if (!quotation) throw new AppError("Quotation not found.", 404);
  if (quotation.status === "SELECTED") {
    throw new AppError("This quotation is already selected.", 400);
  }
  if (!["SUBMITTED", "EDITED"].includes(quotation.status)) {
    throw new AppError("Only submitted or edited quotations can be selected.", 400);
  }

  quotation.status = "SELECTED";
  await quotation.save();

  await Quotation.updateMany(
    { rfq: quotation.rfq, _id: { $ne: quotation._id }, status: { $in: ["SUBMITTED", "EDITED"] } },
    { $set: { status: "REJECTED" } }
  );

  await Rfq.findByIdAndUpdate(quotation.rfq, { status: "UNDER_REVIEW" });

  const populated = await Quotation.findById(quotation._id)
    .populate("createdBy", "name email")
    .populate("rfq", "rfqNumber title");

  res.json({
    success: true,
    message: "Quotation selected. Other quotations rejected.",
    data: populated,
  });
});

module.exports = { compare, select };
