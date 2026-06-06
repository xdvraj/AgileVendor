const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  const flat = parsed.error.flatten().fieldErrors;
  for (const [key, msgs] of Object.entries(flat)) {
    console.error(`   ${key}: ${msgs.join(", ")}`);
  }
  process.exit(1);
}

module.exports = parsed.data;
