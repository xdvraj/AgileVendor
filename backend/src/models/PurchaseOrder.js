const mongoose = require("mongoose");

const poItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const poSchema = new mongoose.Schema(
  {
    poNumber: { type: String, unique: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "Rfq", required: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation", required: true },
    vendor: {
      companyName: { type: String, required: true },
      contactPerson: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      gstNumber: { type: String },
      address: { type: String },
    },
    items: { type: [poItemSchema], required: true },
    price: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryTimeline: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["GENERATED", "SENT_TO_VENDOR", "ACCEPTED", "CANCELLED", "INVOICED"],
      default: "GENERATED",
    },
    sentAt: { type: Date },
    acceptedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

poSchema.pre("save", async function (next) {
  if (this.isNew && !this.poNumber) {
    const count = await mongoose.model("PurchaseOrder").countDocuments();
    this.poNumber = `PO-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("PurchaseOrder", poSchema);
