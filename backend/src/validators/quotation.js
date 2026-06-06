const { z } = require("zod");

const quotationItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be 0 or more"),
  tax: z.number().min(0).optional(),
  total: z.number().min(0, "Total must be 0 or more"),
});

const createQuotationSchema = z.object({
  body: z.object({
    items: z.array(quotationItemSchema).min(1, "At least one item is required"),
    price: z.number().min(0, "Price must be 0 or more"),
    tax: z.number().min(0).optional(),
    totalAmount: z.number().min(0, "Total amount must be 0 or more"),
    deliveryTimeline: z.string().optional(),
    notes: z.string().optional(),
    comments: z.string().optional(),
    status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
  }),
});

const updateQuotationSchema = z.object({
  body: z.object({
    items: z.array(quotationItemSchema).min(1).optional(),
    price: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    totalAmount: z.number().min(0).optional(),
    deliveryTimeline: z.string().optional(),
    notes: z.string().optional(),
    comments: z.string().optional(),
    status: z.enum(["DRAFT", "SUBMITTED", "EDITED"]).optional(),
  }),
});

module.exports = { createQuotationSchema, updateQuotationSchema };
