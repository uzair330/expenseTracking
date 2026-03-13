import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { Transaction } from "./types";

export const generatePDF = (transactions: Transaction[]) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Daily Expense Tracker Report", 14, 22);

    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, 30);

    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 40);
    doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, 46);
    doc.text(`Net Balance: $${balance.toFixed(2)}`, 14, 52);

    const tableColumn = ["Date", "Type", "Category", "Description", "Amount"];
    const tableRows = transactions.map((t) => [
        format(new Date(t.date), "MMM d, yyyy"),
        t.type,
        t.category,
        t.description || "-",
        `$${t.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: "striped",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`Expense_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const shareToWhatsApp = (transactions: Transaction[]) => {
    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const text = `*Daily Expense Tracker Report*\nGenerated: ${format(
        new Date(),
        "PP"
    )}\n\n*Summary:*\nIncome: $${totalIncome.toFixed(
        2
    )}\nExpense: $${totalExpense.toFixed(2)}\n*Balance: $${balance.toFixed(
        2
    )}*\n\n*Recent Transactions:*\n${transactions
        .slice(0, 10)
        .map(
            (t) =>
                `- ${format(new Date(t.date), "MMM d")}: ${t.category} (${t.type === "INCOME" ? "+" : "-"
                }$${t.amount.toFixed(2)})`
        )
        .join("\n")}${transactions.length > 10 ? "\n...and more." : ""
        }\n\n(Download the PDF from the app for full details.)`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
};
