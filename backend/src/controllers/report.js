const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const Rfq = require("../models/Rfq");
const Quotation = require("../models/Quotation");
const PurchaseOrder = require("../models/PurchaseOrder");
const Invoice = require("../models/Invoice");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const vendorPerformance = catchAsync(async (req, res) => {
  const { year } = req.query;
  const matchYear = year ? parseInt(year) : new Date().getFullYear();

  const quotations = await Quotation.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: "$createdBy",
        totalQuotations: { $sum: 1 },
        submittedCount: { $sum: { $cond: [{ $in: ["$status", ["SUBMITTED", "EDITED", "SELECTED"]] }, 1, 0] } },
        selectedCount: { $sum: { $cond: [{ $eq: ["$status", "SELECTED"] }, 1, 0] } },
        totalQuotedAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const userIds = quotations.map((q) => q._id);
  const vendors = await Vendor.find({ email: { $in: [] } });

  const pos = await PurchaseOrder.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPOValue: { $sum: "$totalAmount" },
        poCount: { $sum: 1 },
      },
    },
  ]);

  const vendorEmails = quotations.map((q) => q._id).filter(Boolean);
  const vendorMap = {};
  const vendorDocs = await Vendor.find({}).select("companyName email rating");
  for (const v of vendorDocs) {
    vendorMap[v._id.toString()] = v;
  }

  const userMap = {};
  const users = await mongoose.model("User").find({}).select("name email");
  for (const u of users) {
    userMap[u._id.toString()] = u;
  }

  const data = quotations.map((q) => {
    const userId = q._id?.toString() || "";
    const user = userMap[userId];
    const vendor = vendorMap[userId];
    return {
      vendorId: vendor?._id || null,
      vendorName: vendor?.companyName || user?.name || "Unknown",
      vendorEmail: vendor?.email || user?.email || "",
      rating: vendor?.rating || 0,
      totalQuotations: q.totalQuotations,
      submittedCount: q.submittedCount,
      selectedCount: q.selectedCount,
      totalQuotedAmount: q.totalQuotedAmount,
      selectionRate: q.totalQuotations > 0 ? ((q.selectedCount / q.totalQuotations) * 100).toFixed(1) : "0.0",
    };
  });

  data.sort((a, b) => b.totalQuotedAmount - a.totalQuotedAmount);

  res.json({
    success: true,
    data: {
      year: matchYear,
      totalVendors: data.length,
      summary: {
        totalQuotations: quotations.reduce((s, q) => s + q.totalQuotations, 0),
        totalPOValue: pos.length > 0 ? pos[0].totalPOValue : 0,
        poCount: pos.length > 0 ? pos[0].poCount : 0,
      },
      vendors: data,
    },
  });
});

const monthlySpending = catchAsync(async (req, res) => {
  const { year } = req.query;
  const matchYear = year ? parseInt(year) : new Date().getFullYear();

  const spending = await PurchaseOrder.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
        status: { $ne: "CANCELLED" },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        totalSpent: { $sum: "$totalAmount" },
        poCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const found = spending.find((s) => s._id.month === i + 1);
    return {
      month: monthNames[i],
      monthIndex: i + 1,
      totalSpent: found?.totalSpent || 0,
      poCount: found?.poCount || 0,
    };
  });

  const totalSpent = monthlyData.reduce((s, m) => s + m.totalSpent, 0);
  const averageMonthly = monthlyData.length > 0 ? totalSpent / 12 : 0;

  res.json({
    success: true,
    data: {
      year: matchYear,
      summary: { totalSpent, averageMonthly, totalPOs: monthlyData.reduce((s, m) => s + m.poCount, 0) },
      monthly: monthlyData,
    },
  });
});

const rfqStatus = catchAsync(async (req, res) => {
  const { year } = req.query;
  const matchYear = year ? parseInt(year) : new Date().getFullYear();

  const statuses = await Rfq.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalRfqs = statuses.reduce((s, st) => s + st.count, 0);

  const monthlyTrend = await Rfq.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, status: "$status" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const allStatuses = [...new Set(monthlyTrend.map((m) => m._id.status))];

  const trend = monthNames.map((name, i) => {
    const monthData = { month: name, monthIndex: i + 1 };
    for (const s of allStatuses) monthData[s] = 0;
    for (const m of monthlyTrend) {
      if (m._id.month === i + 1) monthData[m._id.status] = m.count;
    }
    return monthData;
  });

  res.json({
    success: true,
    data: {
      year: matchYear,
      totalRfqs,
      statusBreakdown: statuses.map((s) => ({ status: s._id, count: s.count, percentage: ((s.count / totalRfqs) * 100).toFixed(1) })),
      monthlyTrend: trend,
    },
  });
});

const purchaseOrders = catchAsync(async (req, res) => {
  const { year } = req.query;
  const matchYear = year ? parseInt(year) : new Date().getFullYear();

  const statuses = await PurchaseOrder.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 }, totalValue: { $sum: "$totalAmount" } },
    },
    { $sort: { count: -1 } },
  ]);

  const totalPOs = statuses.reduce((s, st) => s + st.count, 0);
  const totalValue = statuses.reduce((s, st) => s + st.totalValue, 0);

  res.json({
    success: true,
    data: {
      year: matchYear,
      summary: { totalPOs, totalValue, averageValue: totalPOs > 0 ? (totalValue / totalPOs).toFixed(2) : 0 },
      statusBreakdown: statuses.map((s) => ({ status: s._id, count: s.count, totalValue: s.totalValue })),
    },
  });
});

const invoices = catchAsync(async (req, res) => {
  const { year } = req.query;
  const matchYear = year ? parseInt(year) : new Date().getFullYear();

  const statuses = await Invoice.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${matchYear}-01-01`),
          $lte: new Date(`${matchYear}-12-31`),
        },
      },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 }, totalValue: { $sum: "$totalAmount" } },
    },
    { $sort: { count: -1 } },
  ]);

  const totalInvoices = statuses.reduce((s, st) => s + st.count, 0);
  const totalValue = statuses.reduce((s, st) => s + st.totalValue, 0);

  const paidInvoices = statuses.find((s) => s._id === "PAID");
  const pendingAmount = totalValue - (paidInvoices?.totalValue || 0);

  res.json({
    success: true,
    data: {
      year: matchYear,
      summary: {
        totalInvoices,
        totalValue,
        paidValue: paidInvoices?.totalValue || 0,
        pendingAmount,
        collectionRate: totalValue > 0 ? (((paidInvoices?.totalValue || 0) / totalValue) * 100).toFixed(1) : "0.0",
      },
      statusBreakdown: statuses.map((s) => ({ status: s._id, count: s.count, totalValue: s.totalValue })),
    },
  });
});

module.exports = { vendorPerformance, monthlySpending, rfqStatus, purchaseOrders, invoices };
