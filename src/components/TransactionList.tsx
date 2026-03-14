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
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-bold mb-4 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">Account Statement</h2>

            {transactions.length === 0 ? (
                <p className="text-center text-zinc-500 py-8">No transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center justify-between py-3 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 group"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${t.type === "INCOME"
                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {t.type === "INCOME" ? (
                                        <ArrowDownRight className="w-5 h-5" /> // Inwards for credit
                                    ) : (
                                        <ArrowUpRight className="w-5 h-5" /> // Outwards for debit
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[15px] dark:text-white leading-tight">{t.category}</p>
                                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {format(new Date(t.date), "MMM d")}
                                        {t.description && ` • ${t.description.substring(0, 20)}${t.description.length > 20 ? '...' : ''}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span
                                        className={`font-semibold text-[15px] ${t.type === "INCOME"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        {t.type === "INCOME" ? "+" : "-"}Rs {t.amount.toFixed(2)}
                                    </span>
                                    <span className="text-[11px] font-medium text-zinc-400 uppercase">
                                        {t.type === "INCOME" ? "Credit" : "Debit"}
                                    </span>
                                </div>
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
