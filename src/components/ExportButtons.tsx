import { FileDown, MessageCircle } from "lucide-react";
import { generatePDF, shareToWhatsApp } from "@/lib/exportUtils";
import type { Transaction } from "@/lib/types";

export function ExportButtons({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
                onClick={() => generatePDF(transactions)}
                disabled={transactions.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors dark:text-white font-medium disabled:opacity-50"
            >
                <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Download PDF
            </button>

            <button
                onClick={() => shareToWhatsApp(transactions)}
                disabled={transactions.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-colors font-medium disabled:opacity-50"
            >
                <MessageCircle className="w-5 h-5" />
                Share to WhatsApp
            </button>
        </div>
    );
}
