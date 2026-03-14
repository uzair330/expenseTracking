"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExportButtons } from "@/components/ExportButtons";
import { Wallet } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { getTransactions, addTransaction, deleteTransaction } from "@/actions/transactions";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions(filter);
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
      setLoading(true);
      await addTransaction(data);
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900/50 pb-20">
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <header className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight leading-tight">My Account</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Daily Expense Tracker</p>
          </div>
          <ExportButtons transactions={transactions} />
        </header>

        <DashboardStats transactions={transactions} />

        <div className="mt-6 mb-6">
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
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
        </div>


        <div className="flex flex-col gap-6 mt-6">
          <div className="space-y-6">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}
