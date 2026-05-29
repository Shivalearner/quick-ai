// Works in Node.js, Next.js, serverless, and edge runtimes
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default sql;
