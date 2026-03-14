"use server";

import { createDb } from "@/lib/db";
const db = createDb();
import { transactions } from "@/db/schema";
import { desc, gte, eq } from "drizzle-orm";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getTransactions(filter: string = "all") {
    try {
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

        return result;
    } catch (error) {
        console.error("getTransactions error:", error);
        throw new Error("Failed to fetch transactions");
    }
}

export async function addTransaction(data: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    description: string;
    date?: Date | string;
}) {
    try {
        if (data.amount === undefined || !data.type || !data.category) {
            throw new Error("Missing required fields");
        }

        const newTransaction = await db
            .insert(transactions)
            .values({
                amount: Number(data.amount),
                type: data.type,
                category: data.category,
                description: data.description,
                date: data.date ? new Date(data.date) : undefined,
            })
            .returning();

        revalidatePath("/");
        return newTransaction[0];
    } catch (error) {
        console.error("addTransaction error:", error);
        throw new Error("Failed to create transaction");
    }
}

export async function deleteTransaction(id: string) {
    try {
        const deletedTransaction = await db
            .delete(transactions)
            .where(eq(transactions.id, id))
            .returning();

        if (deletedTransaction.length === 0) {
            throw new Error("Transaction not found");
        }

        revalidatePath("/");
        return { success: true, deleted: deletedTransaction[0] };
    } catch (error) {
        console.error("deleteTransaction error:", error);
        throw new Error("Failed to delete transaction");
    }
}
