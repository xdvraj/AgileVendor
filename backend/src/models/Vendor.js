const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true, maxlength: 200 },
    contactPerson: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, maxlength: 20 },
    gstNumber: { type: String, trim: true },
    category: { type: String, trim: true },
    address: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "blacklisted"],
      default: "active",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

vendorSchema.index({ companyName: "text", contactPerson: "text", email: "text" });

module.exports = mongoose.model("Vendor", vendorSchema);
