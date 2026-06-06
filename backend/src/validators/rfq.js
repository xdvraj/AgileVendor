const { z } = require("zod");

const rfqItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unit: z.string().optional(),
});

const createRfqSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().optional(),
    items: z.array(rfqItemSchema).min(1, "At least one item is required"),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    status: z.enum(["DRAFT", "OPEN", "CLOSED", "UNDER_REVIEW", "APPROVAL_PENDING", "APPROVED", "REJECTED", "PO_CREATED"]).optional(),
    assignedVendors: z.array(z.string()).optional(),
    attachments: z.array(z.object({
      filename: z.string().min(1),
      url: z.string().min(1),
    })).optional(),
  }),
});

const updateRfqSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().optional(),
    items: z.array(rfqItemSchema).min(1).optional(),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date").optional(),
    status: z.enum(["DRAFT", "OPEN", "CLOSED", "UNDER_REVIEW", "APPROVAL_PENDING", "APPROVED", "REJECTED", "PO_CREATED"]).optional(),
    assignedVendors: z.array(z.string()).optional(),
    attachments: z.array(z.object({
      filename: z.string().min(1),
      url: z.string().min(1),
    })).optional(),
  }),
});

const assignVendorsSchema = z.object({
  body: z.object({
    vendorIds: z.array(z.string()).min(1, "At least one vendor is required"),
  }),
});

const querySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
  }),
});

module.exports = { createRfqSchema, updateRfqSchema, assignVendorsSchema, querySchema };
