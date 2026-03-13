import { pgTable, text, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", ["INCOME", "EXPENSE"]);

export const transactions = pgTable("transactions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    amount: doublePrecision("amount").notNull(),
    type: transactionTypeEnum("type").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    date: timestamp("date", { mode: "date" }).notNull().defaultNow(),
});
