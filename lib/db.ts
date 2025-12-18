import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

let sql;
export let isMock = false;
try {
    sql = neon(process.env.DATABASE_URL || "postgresql://mock_user:mock_pass@mock_host:5432/mock_db");
} catch (error) {
    sql = neon("postgresql://mock_user:mock_pass@mock_host:5432/mock_db");
    isMock = true;
}

// Check if the URL is the mock one (case where process.env contained the invalid placeholder)
if (process.env.DATABASE_URL?.includes("mock") || !process.env.DATABASE_URL) {
    isMock = true;
}
export const db = drizzle({ client: sql });
