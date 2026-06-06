const { z } = require("zod");

const vendorBody = z.object({
  companyName: z.string().min(1, "Company name is required").max(200),
  contactPerson: z.string().min(1, "Contact person is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").max(20),
  gstNumber: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive", "blacklisted"]).optional(),
  rating: z.number().min(0).max(5).optional(),
});

const createVendorSchema = z.object({ body: vendorBody });

const updateVendorSchema = z.object({
  body: vendorBody.partial(),
});

const querySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(["active", "inactive", "blacklisted"]).optional(),
    sortBy: z.string().optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
  }),
});

module.exports = { createVendorSchema, updateVendorSchema, querySchema };
