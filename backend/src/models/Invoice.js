const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    po: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
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
    items: { type: [invoiceItemSchema], required: true },
    price: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryTimeline: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["GENERATED", "SENT", "PAID", "CANCELLED"],
      default: "GENERATED",
    },
    sentAt: { type: Date },
    paidAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
