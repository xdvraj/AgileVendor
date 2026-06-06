const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const env = require("./config/env");
const authRoutes = require("./routes/auth");
const vendorRoutes = require("./routes/vendor");
const rfqRoutes = require("./routes/rfq");

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
  { method: "GET",  path: "/api/health",           auth: false, description: "Server health check" },
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
app.use("/api/rfqs", rfqRoutes);

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
