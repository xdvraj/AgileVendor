const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const env = require("./config/env");
const authRoutes = require("./routes/auth");
const vendorRoutes = require("./routes/vendor");
const rfqRoutes = require("./routes/rfq");
const quotationRoutes = require("./routes/quotation");
const approvalRoutes = require("./routes/approval");
const purchaseOrderRoutes = require("./routes/purchaseOrder");
const invoiceRoutes = require("./routes/invoice");
const activityLogRoutes = require("./routes/activityLog");
const notificationRoutes = require("./routes/notification");

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

const apiRoutes = [
  { method: "POST", path: "/api/auth/signup", auth: false, description: "Create a new account" },
  { method: "POST", path: "/api/auth/login",  auth: false, description: "Login with email & password" },
  { method: "POST", path: "/api/auth/logout", auth: false, description: "Clear auth cookie" },
  { method: "GET",  path: "/api/auth/me",     auth: true,  description: "Get current authenticated user" },
  { method: "GET",  path: "/api/vendors",         auth: true, description: "List / search vendors" },
  { method: "POST", path: "/api/vendors",         auth: true, description: "Create a vendor" },
  { method: "GET",  path: "/api/vendors/:id",     auth: true, description: "Get vendor by ID" },
  { method: "PATCH",path: "/api/vendors/:id",     auth: true, description: "Update vendor" },
  { method: "DELETE",path: "/api/vendors/:id",    auth: true, description: "Delete vendor" },
  { method: "GET",  path: "/api/rfqs",             auth: true, description: "List / search RFQs" },
  { method: "POST", path: "/api/rfqs",             auth: true, description: "Create an RFQ" },
  { method: "GET",  path: "/api/rfqs/:id",         auth: true, description: "Get RFQ by ID" },
  { method: "PATCH",path: "/api/rfqs/:id",         auth: true, description: "Update RFQ" },
  { method: "DELETE",path: "/api/rfqs/:id",        auth: true, description: "Delete RFQ" },
  { method: "POST", path: "/api/rfqs/:id/assign-vendors", auth: true, description: "Assign vendors to RFQ" },
  { method: "GET",  path: "/api/vendor/rfqs",          auth: true, description: "Vendor browse open RFQs" },
  { method: "GET",  path: "/api/rfqs/:rfqId/quotations",  auth: true, description: "Get quotations for RFQ" },
  { method: "POST", path: "/api/rfqs/:rfqId/quotations",  auth: true, description: "Vendor submit quotation" },
  { method: "PATCH",path: "/api/quotations/:id",          auth: true, description: "Vendor edit quotation" },
  { method: "GET",  path: "/api/rfqs/:rfqId/quotations/compare", auth: true, description: "Compare quotations" },
  { method: "POST", path: "/api/quotations/:id/select",         auth: true, description: "Select winning quotation" },
  { method: "GET",  path: "/api/approvals",                  auth: true, description: "List approval requests" },
  { method: "POST", path: "/api/approvals",                  auth: true, description: "Create approval request" },
  { method: "POST", path: "/api/approvals/:id/approve",      auth: true, description: "Approve request" },
  { method: "POST", path: "/api/approvals/:id/reject",       auth: true, description: "Reject request" },
  { method: "GET",  path: "/api/purchase-orders",             auth: true, description: "List purchase orders" },
  { method: "POST", path: "/api/purchase-orders",             auth: true, description: "Create PO from selected quotation" },
  { method: "GET",  path: "/api/purchase-orders/:id",         auth: true, description: "Get PO by ID" },
  { method: "POST", path: "/api/purchase-orders/:id/send",    auth: true, description: "Send PO to vendor" },
  { method: "GET",  path: "/api/invoices",                    auth: true, description: "List invoices" },
  { method: "POST", path: "/api/invoices",                    auth: true, description: "Generate invoice from PO" },
  { method: "GET",  path: "/api/invoices/:id",                auth: true, description: "Get invoice by ID" },
  { method: "GET",  path: "/api/invoices/:id/download",       auth: true, description: "Download invoice data" },
  { method: "POST", path: "/api/invoices/:id/email",          auth: true, description: "Send invoice to vendor" },
  { method: "GET",  path: "/api/activity-logs",               auth: true, description: "List activity logs" },
  { method: "GET",  path: "/api/notifications",               auth: true, description: "List my notifications" },
  { method: "PATCH",path: "/api/notifications/:id/read",      auth: true, description: "Mark notification as read" },
  { method: "GET",  path: "/api/health",                      auth: false, description: "Server health check" },
];

app.get("/api/health", async (_req, res) => {
  const mongoose = require("mongoose");
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

  res.json({
    success: true,
    message: "Server is healthy.",
    data: {
      server: { status: "running", uptime: process.uptime(), timestamp: new Date().toISOString() },
      database: { status: dbStatus[dbState] || "unknown", state: dbState },
      routes: apiRoutes,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api", quotationRoutes);
app.use("/api/rfqs", rfqRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/notifications", notificationRoutes);

app.all("*", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Something went wrong.";

  console.error(`[ERROR] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running → http://localhost:${env.PORT}`);
  connectDB();
});
