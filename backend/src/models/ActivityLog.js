const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true, enum: ["User", "Vendor", "RFQ", "Quotation", "Approval", "PurchaseOrder", "Invoice"] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entity: 1, entityId: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
