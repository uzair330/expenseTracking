import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, gte, eq } from "drizzle-orm";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "all";

        let dateFilter = undefined;
        const now = new Date();

        if (filter === "today") {
            dateFilter = startOfDay(now);
        } else if (filter === "week") {
            dateFilter = startOfWeek(now, { weekStartsOn: 1 });
        } else if (filter === "month") {
            dateFilter = startOfMonth(now);
        }

        const result = await db
            .select()
            .from(transactions)
            .where(dateFilter ? gte(transactions.date, dateFilter) : undefined)
            .orderBy(desc(transactions.date));
        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/transactions error:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, type, category, description, date } = body;

        if (amount === undefined || !type || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newTransaction = await db
            .insert(transactions)
            .values({
                amount: Number(amount),
                type,
                category,
                description,
                date: date ? new Date(date) : undefined,
            })
            .returning();

        return NextResponse.json(newTransaction[0], { status: 201 });
    } catch (error) {
        console.error("POST /api/transactions error:", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
