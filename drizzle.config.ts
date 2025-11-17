import { defineConfig } from "drizzle-kit";

// Load .env.local for local development (dotenv installed as devDependency)
// In Docker, environment variables are provided by docker-compose
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config({ path: ".env.local" });
  } catch {
    // dotenv not available, using system environment variables
  }
}

export default defineConfig({
  out: "./src/app/db/drizzle",
  schema: "./src/app/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
