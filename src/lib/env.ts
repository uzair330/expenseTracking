let databaseUrl: string | undefined

if (typeof process !== "undefined") {
    databaseUrl = process.env.DATABASE_URL
}

export function getDatabaseUrl(env?: { DATABASE_URL?: string }) {
    return databaseUrl ?? env?.DATABASE_URL
}
