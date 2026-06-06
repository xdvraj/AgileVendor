const { z } = require("zod");

const createPOSchema = z.object({
  body: z.object({
    quotationId: z.string().min(1, "Quotation ID is required"),
  }),
});

const sendSchema = z.object({
  body: z.object({
    message: z.string().optional(),
  }),
});

module.exports = { createPOSchema, sendSchema };
