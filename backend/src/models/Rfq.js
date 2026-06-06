const mongoose = require("mongoose");

const rfqItemSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, trim: true, default: "pcs" },
});

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
});

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: { type: String, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true },
    items: { type: [rfqItemSchema], required: true, validate: v => v.length > 0 },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "OPEN", "CLOSED", "UNDER_REVIEW", "APPROVAL_PENDING", "APPROVED", "REJECTED", "PO_CREATED"],
      default: "DRAFT",
    },
    assignedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
    attachments: [attachmentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

rfqSchema.pre("save", async function (next) {
  if (this.isNew && !this.rfqNumber) {
    const count = await mongoose.model("Rfq").countDocuments();
    this.rfqNumber = `RFQ-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Rfq", rfqSchema);
