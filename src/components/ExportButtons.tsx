import { FileDown, MessageCircle } from "lucide-react";
import { generatePDF, shareToWhatsApp } from "@/lib/exportUtils";
import type { Transaction } from "@/lib/types";

export function ExportButtons({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="flex gap-2">
            <button
                onClick={() => generatePDF(transactions)}
                disabled={transactions.length === 0}
                className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                title="Download PDF"
            >
                <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>

            <button
                onClick={() => shareToWhatsApp(transactions)}
                disabled={transactions.length === 0}
                className="p-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-colors disabled:opacity-50"
                title="Share to WhatsApp"
            >
                <MessageCircle className="w-5 h-5" />
            </button>
        </div>
    );
}
