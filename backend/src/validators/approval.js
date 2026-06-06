const { z } = require("zod");

const createApprovalSchema = z.object({
  body: z.object({
    rfqId: z.string().min(1, "RFQ ID is required"),
    quotationId: z.string().min(1, "Quotation ID is required"),
    assignedTo: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

const actionSchema = z.object({
  body: z.object({
    remarks: z.string().optional(),
  }),
});

module.exports = { createApprovalSchema, actionSchema };
