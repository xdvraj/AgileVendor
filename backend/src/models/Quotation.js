const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const quotationSchema = new mongoose.Schema(
  {
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "Rfq", required: true },
    items: { type: [quotationItemSchema], required: true, validate: (v) => v.length > 0 },
    price: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryTimeline: { type: String, trim: true },
    notes: { type: String, trim: true },
    comments: { type: String, trim: true },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "EDITED", "SELECTED", "REJECTED"],
      default: "DRAFT",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
