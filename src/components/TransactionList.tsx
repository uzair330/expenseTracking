import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { useState } from "react";

export function TransactionList({
    transactions,
    onDelete,
    filter,
    onFilterChange,
}: {
    transactions: Transaction[];
    onDelete: (id: string) => Promise<void>;
    filter: string;
    onFilterChange: (f: string) => void;
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const currentTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevious = () => setCurrentPage((prev) => Math.max(1, prev - 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-lg font-bold dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
                <span>Account Statement</span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isOpen && (
                <div className="mt-4">
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-4 overflow-x-auto hide-scrollbar">
                        {["all", "today", "week", "month"].map((f) => (
                            <button
                                key={f}
                                onClick={() => { onFilterChange(f); setCurrentPage(1); }}
                                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${filter === f
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {transactions.length === 0 ? (
                        <p className="text-center text-zinc-500 py-8">No transactions found.</p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {currentTransactions.map((t) => (
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
                                                    <ArrowDownRight className="w-5 h-5" />
                                                ) : (
                                                    <ArrowUpRight className="w-5 h-5" />
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

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
