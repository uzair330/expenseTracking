"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExportButtons } from "@/components/ExportButtons";
import { Wallet } from "lucide-react";
import type { Transaction } from "@/lib/types";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions?filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (data: { amount: number; type: "INCOME" | "EXPENSE"; category: string; description: string; }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add transaction");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/50 pb-20">
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <header className="flex flex-col items-center justify-center text-center gap-4 mb-8">
          <div>
            <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Account
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">
              Daily Expense Tracker
            </p>
          </div>

          <div className="flex bg-white dark:bg-zinc-900 rounded-xl p-1 shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-x-auto hide-scrollbar">
            {["all", "today", "week", "month"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${filter === f
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <DashboardStats transactions={transactions} />

        <div className="flex flex-col gap-6 mt-6">
          <div className="space-y-6">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
          <div className="space-y-6">
            <ExportButtons transactions={transactions} />
          </div>
          <div className="mt-2">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full"></div>
                <div className="h-24 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full"></div>
                <div className="h-24 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full"></div>
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
