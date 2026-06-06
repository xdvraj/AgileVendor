const { z } = require("zod");

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
    role: z.enum(["admin", "procurement_officer", "vendor", "approver"]).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

module.exports = { signupSchema, loginSchema };
