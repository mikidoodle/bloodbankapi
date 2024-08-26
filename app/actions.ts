// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData(query: string) {
  const sql = neon(process.env.DATABASE_URL || "");
  const data = await sql(query);
  return data;
}
