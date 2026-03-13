import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import type { Transaction } from "@/lib/types";

export function TransactionList({
    transactions,
    onDelete,
}: {
    transactions: Transaction[];
    onDelete: (id: string) => Promise<void>;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Recent Transactions</h2>

            {transactions.length === 0 ? (
                <p className="text-center text-zinc-500 py-8">No transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-xl ${t.type === "INCOME"
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {t.type === "INCOME" ? (
                                        <ArrowUpRight className="w-5 h-5" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold dark:text-white">{t.category}</p>
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span>{format(new Date(t.date), "MMM d, yyyy")}</span>
                                        {t.description && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-[120px] sm:max-w-xs">
                                                    {t.description}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span
                                    className={`font-semibold ${t.type === "INCOME"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-zinc-900 dark:text-white"
                                        }`}
                                >
                                    {t.type === "INCOME" ? "+" : "-"}PKR {t.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onDelete(t.id)}
                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                    aria-label="Delete transaction"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
