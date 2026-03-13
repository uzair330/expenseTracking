import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function TransactionForm({
    onAddTransaction,
}: {
    onAddTransaction: (transaction: {
        amount: number;
        type: "INCOME" | "EXPENSE";
        category: string;
        description: string;
    }) => Promise<void>;
}) {
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const categories =
        type === "EXPENSE"
            ? ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Other"]
            : ["Salary", "Freelance", "Investment", "Gift", "Other"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        setLoading(true);
        try {
            await onAddTransaction({
                amount: Number(amount),
                type,
                category,
                description,
            });

            setAmount("");
            setDescription("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setType("EXPENSE");
                            setCategory("Food");
                        }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "EXPENSE"
                            ? "bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setType("INCOME");
                            setCategory("Salary");
                        }}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "INCOME"
                            ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                            }`}
                    >
                        Income
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rs</span>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
                        placeholder="Optional notes"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !amount}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    <PlusCircle className="w-5 h-5" />
                    {loading ? "Saving..." : "Save Transaction"}
                </button>
            </form>
        </div>
    );
}
