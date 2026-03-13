import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        // Awaiting params is required in newer Next.js versions
        const { id } = await Promise.resolve(context.params);
        const body = await request.json();
        const { amount, type, category, description, date } = body;

        const updatedTransaction = await db
            .update(transactions)
            .set({
                amount: amount !== undefined ? Number(amount) : undefined,
                type,
                category,
                description,
                date: date ? new Date(date) : undefined,
            })
            .where(eq(transactions.id, id))
            .returning();

        if (updatedTransaction.length === 0) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTransaction[0]);
    } catch (error) {
        console.error("PUT /api/transactions/[id] error:", error);
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await Promise.resolve(context.params);

        const deletedTransaction = await db
            .delete(transactions)
            .where(eq(transactions.id, id))
            .returning();

        if (deletedTransaction.length === 0) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, deleted: deletedTransaction[0] });
    } catch (error) {
        console.error("DELETE /api/transactions/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}
