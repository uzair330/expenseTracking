import { Download, Send } from "lucide-react";
import { generatePDF, shareToWhatsApp } from "@/lib/exportUtils";
import type { Transaction } from "@/lib/types";

export function ExportButtons({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => generatePDF(transactions)}
                disabled={transactions.length === 0}
                className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors disabled:opacity-50"
                title="Download PDF"
            >
                <Download className="w-5 h-5" />
            </button>

            <button
                onClick={() => shareToWhatsApp(transactions)}
                disabled={transactions.length === 0}
                className="p-2 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors disabled:opacity-50"
                title="Share to WhatsApp"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    );
}

