const Vendor = require("../models/Vendor");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const getAll = catchAsync(async (req, res) => {
  const { search, category, status, sortBy, order } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (status) filter.status = status;

  const sortField = ["companyName", "contactPerson", "email", "status", "category", "rating", "createdAt", "updatedAt"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortOrder = order === "ASC" ? 1 : -1;

  const vendors = await Vendor.find(filter).sort({ [sortField]: sortOrder });

  res.json({ success: true, count: vendors.length, data: vendors });
});

const getById = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  }

  res.json({ success: true, data: vendor });
});

const create = catchAsync(async (req, res) => {
  const { companyName, contactPerson, email, phone, gstNumber, category, address, status, rating } = req.body;

  const existing = await Vendor.findOne({ email });
  if (existing) {
    throw new AppError("A vendor with this email already exists.", 409);
  }

  const vendor = await Vendor.create({
    companyName, contactPerson, email, phone, gstNumber, category, address, status, rating,
  });

  res.status(201).json({ success: true, message: "Vendor created successfully.", data: vendor });
});

const update = catchAsync(async (req, res) => {
  const existing = await Vendor.findById(req.params.id);
  if (!existing) {
    throw new AppError("Vendor not found.", 404);
  }

  if (req.body.email && req.body.email !== existing.email) {
    const emailTaken = await Vendor.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
    if (emailTaken) {
      throw new AppError("Email is already in use by another vendor.", 409);
    }
  }

  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: "Vendor updated successfully.", data: vendor });
});

const remove = catchAsync(async (req, res) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found.", 404);
  }

  res.json({ success: true, message: "Vendor deleted successfully." });
});

module.exports = { getAll, getById, create, update, remove };
