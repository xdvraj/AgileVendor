const { z } = require("zod");

const createInvoiceSchema = z.object({
  body: z.object({
    poId: z.string().min(1, "Purchase order ID is required"),
  }),
});

const emailSchema = z.object({
  body: z.object({
    to: z.string().email("Invalid email").optional(),
    message: z.string().optional(),
  }),
});

module.exports = { createInvoiceSchema, emailSchema };
