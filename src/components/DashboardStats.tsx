import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "@/lib/types";

export function DashboardStats({ transactions }: { transactions: Transaction[] }) {
    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <p className="text-zinc-400 text-sm font-medium mb-1">Available Balance</p>
                    <h3 className="text-4xl font-bold tracking-tight mb-6">Rs {balance.toFixed(2)}</h3>

                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Wallet className="w-4 h-4" />
                        <span>Everyday Account</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Credits</p>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rs {totalIncome.toFixed(2)}</h3>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Debits</p>
                    </div>
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Rs {totalExpense.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
}
