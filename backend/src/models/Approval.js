const mongoose = require("mongoose");

const historyEntrySchema = new mongoose.Schema({
  action: { type: String, enum: ["CREATED", "APPROVED", "REJECTED"], required: true },
  by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  remarks: { type: String, trim: true },
  timestamp: { type: Date, default: Date.now },
});

const approvalSchema = new mongoose.Schema(
  {
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "Rfq", required: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    remarks: { type: String, trim: true },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    history: [historyEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Approval", approvalSchema);
