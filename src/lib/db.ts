import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { getDatabaseUrl } from "./env"
import * as schema from "../db/schema"

export function createDb(env?: { DATABASE_URL?: string }) {
    const url = getDatabaseUrl(env)

    if (!url) {
        throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(url)

    return drizzle(sql, { schema })
}
