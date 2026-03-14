import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { Transaction } from "./types";

export const generatePDF = (transactions: Transaction[]) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Account Statement", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, 30);
    doc.setTextColor(0);

    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    doc.text(`Total Credits: Rs ${totalIncome.toFixed(2)}`, 14, 40);
    doc.text(`Total Debits: Rs ${totalExpense.toFixed(2)}`, 14, 46);
    doc.setFont("helvetica", "bold");
    doc.text(`Available Balance: Rs ${balance.toFixed(2)}`, 14, 52);
    doc.setFont("helvetica", "normal");

    const tableColumn = ["Date", "Type", "Description", "Debit", "Credit"];
    const tableRows = transactions.map((t) => [
        format(new Date(t.date), "MMM d, yyyy"),
        t.category,
        t.description || "-",
        t.type === "EXPENSE" ? `Rs ${t.amount.toFixed(2)}` : "-",
        t.type === "INCOME" ? `Rs ${t.amount.toFixed(2)}` : "-",
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: "striped",
        headStyles: { fillColor: [30, 41, 59] }, // Dark slate
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            3: { textColor: [220, 38, 38], fontStyle: 'bold' }, // Red for Debit
            4: { textColor: [22, 163, 74], fontStyle: 'bold' }, // Green for Credit
        },
    });

    doc.save(`Statement_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const shareToWhatsApp = (transactions: Transaction[]) => {
    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const text = `*Account Statement*\nGenerated: ${format(
        new Date(),
        "PP"
    )}\n\n*Summary:*\nCredits: Rs ${totalIncome.toFixed(
        2
    )}\nDebits: Rs ${totalExpense.toFixed(2)}\n*Balance: Rs ${balance.toFixed(
        2
    )}*\n\n*Recent Transactions:*\n${transactions
        .slice(0, 10)
        .map(
            (t) =>
                `- ${format(new Date(t.date), "MMM d")}: ${t.category} (${t.type === "INCOME" ? "+" : "-"
                }Rs ${t.amount.toFixed(2)})`
        )
        .join("\n")}${transactions.length > 10 ? "\n...and more." : ""
        }\n\n(Download the PDF from the app for full details.)`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
};
