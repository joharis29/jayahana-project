"use client";

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Wifi, 
  Wallet, 
  Receipt, 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  Check,
  X,
  CreditCard,
  Download,
  AlertTriangle,
  RotateCw,
  MoreVertical,
  CircleDot,
  Activity,
  Printer,
  Truck,
  FileCheck,
  ClipboardCheck,
  Boxes,
  FileText,
  Send
} from "lucide-react";
import { PrintableDocumentModal } from "@/components/PrintableDocumentModal";
import { 
  COMPANY_NAME, 
  BUSINESS_UNITS, 
  INITIAL_COST_CENTERS, 
  INITIAL_REQUESTS, 
  INITIAL_SUBSCRIBERS, 
  INITIAL_INVOICES,
  INITIAL_SALES_INVOICES,
  INITIAL_RECEIPTS_BKM,
  INITIAL_TRANSACTIONS,
  HISTORICAL_FINANCIAL_DATA,
  INITIAL_PENDING_APPROVALS,
  DIVISION_BUDGET_YEARS,
  WEEKLY_SALES_TREND,
  ANNUAL_PROFIT_LOSS_ACCURATE,
  COMPANY_EXPENSE_ACCURATE,
  SALES_SUMMARY_ACCURATE,
  PURCHASE_SUMMARY_ACCURATE,
  USER_ACTIVITY_ACCURATE,
  type PendingApprovalItem
} from "@/lib/constants";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { BusinessUnit, BudgetRequest, RequestType, UserRole, FinancialTransaction, ProcurementItem, SalesInvoice, OfficialReceiptBKM, InvoicePaymentRecord, SITE_DIVISIONS, EXPENSE_CATEGORIES, ExpenseCategory } from "@/types";

const MONTH_NAMES = [
  { num: 1, name: "Januari", short: "Jan" },
  { num: 2, name: "Februari", short: "Feb" },
  { num: 3, name: "Maret", short: "Mar" },
  { num: 4, name: "April", short: "Apr" },
  { num: 5, name: "Mei", short: "Mei" },
  { num: 6, name: "Juni", short: "Jun" },
  { num: 7, name: "Juli", short: "Jul" },
  { num: 8, name: "Agustus", short: "Agu" },
  { num: 9, name: "September", short: "Sep" },
  { num: 10, name: "Oktober", short: "Okt" },
  { num: 11, name: "November", short: "Nov" },
  { num: 12, name: "Desember", short: "Des" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "lpj" | "starlite" | "reports">("overview");
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | "ALL">("ALL");
  const [requests, setRequests] = useState<BudgetRequest[]>(INITIAL_REQUESTS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalItem[]>(INITIAL_PENDING_APPROVALS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  // Period Filter State (Monthly vs Yearly)
  const [filterPeriodType, setFilterPeriodType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November

  // Approval Shortcut Filter
  const [approvalFilter, setApprovalFilter] = useState<"ALL" | "BUDGET_REQUEST" | "LPJ_REALIZATION">("ALL");
  const [approvalNotification, setApprovalNotification] = useState<string | null>(null);

  // Transaction Feed Filter & Search
  const [txTypeFilter, setTxTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [txSearch, setTxSearch] = useState<string>("");

  // Chart View Mode
  const [chartMode, setChartMode] = useState<"FLOW" | "DIVISION">("FLOW");

  // Accurate Widgets State (Synchronized dynamically with Bulanan & Tahunan filter)
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  const [hoveredCashIdx, setHoveredCashIdx] = useState<number | null>(null);
  const [widgetRefreshAnim, setWidgetRefreshAnim] = useState<boolean>(false);
  const handleRefreshWidgets = () => {
    setWidgetRefreshAnim(true);
    setTimeout(() => setWidgetRefreshAnim(false), 600);
  };

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Workflow Subtab in Tab "requests" (Alur 4 Tahap)
  const [requestWorkflowSubTab, setRequestWorkflowSubTab] = useState<"PROPOSAL" | "DISBURSEMENT" | "REALIZATION" | "GOODS_RECEIPT">("PROPOSAL");

  // Printable Document Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<"REQUEST" | "DISBURSEMENT" | "REALIZATION" | "GOODS_RECEIPT" | "SALES_INVOICE" | "OFFICIAL_RECEIPT" | "PROGRESS_REPORT">("REQUEST");
  const [selectedPrintRequest, setSelectedPrintRequest] = useState<BudgetRequest | null>(null);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState<SalesInvoice | null>(null);
  const [selectedPrintReceipt, setSelectedPrintReceipt] = useState<OfficialReceiptBKM | null>(null);

  const handleOpenPrintModal = (req: BudgetRequest, type: "REQUEST" | "DISBURSEMENT" | "REALIZATION" | "GOODS_RECEIPT") => {
    setSelectedPrintRequest(req);
    setSelectedPrintInvoice(null);
    setSelectedPrintReceipt(null);
    setPrintDocType(type);
    setIsPrintModalOpen(true);
  };

  const handleOpenPrintInvoice = (inv: SalesInvoice, type: "SALES_INVOICE" | "PROGRESS_REPORT" | "OFFICIAL_RECEIPT") => {
    setSelectedPrintInvoice(inv);
    setSelectedPrintRequest(null);
    setSelectedPrintReceipt(null);
    setPrintDocType(type);
    setIsPrintModalOpen(true);
  };

  const handleOpenPrintReceipt = (rec: OfficialReceiptBKM) => {
    setSelectedPrintReceipt(rec);
    setSelectedPrintInvoice(null);
    setSelectedPrintRequest(null);
    setPrintDocType("OFFICIAL_RECEIPT");
    setIsPrintModalOpen(true);
  };

  // Revenue & Accounts Receivable (AR) State
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(INITIAL_SALES_INVOICES);
  const [officialReceipts, setOfficialReceipts] = useState<OfficialReceiptBKM[]>(INITIAL_RECEIPTS_BKM);
  const [revenueSubTab, setRevenueSubTab] = useState<"INVOICES" | "AR_AGING" | "RECEIPTS">("INVOICES");

  // New Invoice Modal Form State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newInvClient, setNewInvClient] = useState("");
  const [newInvAddress, setNewInvAddress] = useState("");
  const [newInvNPWP, setNewInvNPWP] = useState("");
  const [newInvContract, setNewInvContract] = useState("");
  const [newInvUnit, setNewInvUnit] = useState<BusinessUnit>("ME_CORE");
  const [newInvTitle, setNewInvTitle] = useState("");
  const [newInvDpp, setNewInvDpp] = useState("");
  const [newInvDueDate, setNewInvDueDate] = useState("2026-11-30");
  const [newInvProgress, setNewInvProgress] = useState("30");
  const [newInvIncludePph23, setNewInvIncludePph23] = useState(true);
  
  // New request form state
  const [newTitle, setNewTitle] = useState("");
  const [newUnit, setNewUnit] = useState<string>("Rajeg & Pasar Kemis");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("Akomodasi");
  const [newType, setNewType] = useState<RequestType>("CASH_ADVANCE");
  const [newAmount, setNewAmount] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [requesterName, setRequesterName] = useState("Tim Lapangan");
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split("T")[0]);

  // Item table for request form (Accurate style)
  type RequestLineItem = { id: string; description: string; quantity: number; unit: string; unitPrice: number; discount: number };
  const [requestItems, setRequestItems] = useState<RequestLineItem[]>([
    { id: "ri-1", description: "", quantity: 1, unit: "Pcs", unitPrice: 0, discount: 0 }
  ]);
  const addRequestItem = () => setRequestItems(prev => [...prev, { id: `ri-${Date.now()}`, description: "", quantity: 1, unit: "Pcs", unitPrice: 0, discount: 0 }]);
  const removeRequestItem = (id: string) => setRequestItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  const updateRequestItem = (id: string, field: keyof RequestLineItem, value: string | number) =>
    setRequestItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  const requestItemsSubTotal = requestItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice * (1 - i.discount / 100)), 0);

  // Procurement Vendor Info (Accurate style)
  const [vendorName, setVendorName] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("Gudang Utama Jayahana, Sentul City");

  // New Income form state
  const [incomeTitle, setIncomeTitle] = useState("");
  const [incomeUnit, setIncomeUnit] = useState<BusinessUnit>("ME_CORE");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("Termin Kontrak Jasa ME");
  const [incomePayer, setIncomePayer] = useState("");

  // Filtered Financial Calculation based on Period
  const periodData = useMemo(() => {
    if (filterPeriodType === "YEARLY") {
      const yearRows = HISTORICAL_FINANCIAL_DATA.filter((d) => d.year === selectedYear);
      const totalIncome = yearRows.reduce((acc, row) => acc + row.income, 0);
      const totalExpense = yearRows.reduce((acc, row) => acc + row.expense, 0);
      const meExpense = yearRows.reduce((acc, row) => acc + row.meExpense, 0);
      const ftthExpense = yearRows.reduce((acc, row) => acc + row.ftthExpense, 0);
      const overheadExpense = yearRows.reduce((acc, row) => acc + row.overheadExpense, 0);
      const netCashFlow = totalIncome - totalExpense;
      const profitMargin = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;

      return {
        totalIncome,
        totalExpense,
        meExpense,
        ftthExpense,
        overheadExpense,
        netCashFlow,
        profitMargin,
        monthlySeries: yearRows,
        periodLabel: `Tahun ${selectedYear}`,
      };
    } else {
      // Monthly
      const monthRow = HISTORICAL_FINANCIAL_DATA.find(
        (d) => d.year === selectedYear && d.monthNum === selectedMonth
      ) || {
        month: MONTH_NAMES[selectedMonth - 1]?.short || "Nov",
        monthNum: selectedMonth,
        year: selectedYear,
        income: 285000000,
        expense: 195000000,
        meExpense: 118000000,
        ftthExpense: 61000000,
        overheadExpense: 16000000,
      };

      const totalIncome = monthRow.income;
      const totalExpense = monthRow.expense;
      const netCashFlow = totalIncome - totalExpense;
      const profitMargin = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0;
      const monthName = MONTH_NAMES.find((m) => m.num === selectedMonth)?.name || "November";

      return {
        totalIncome,
        totalExpense,
        meExpense: monthRow.meExpense,
        ftthExpense: monthRow.ftthExpense,
        overheadExpense: monthRow.overheadExpense,
        netCashFlow,
        profitMargin,
        monthlySeries: [monthRow],
        periodLabel: `${monthName} ${selectedYear}`,
      };
    }
  }, [filterPeriodType, selectedYear, selectedMonth]);

  // Days in selected month & month name
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const selectedMonthName = useMemo(() => {
    return MONTH_NAMES.find(m => m.num === selectedMonth)?.name || "November";
  }, [selectedMonth]);

  // Synchronized Monthly Series for Selected Year (12 Bulan Jan - Des)
  const yearlySeries = useMemo(() => {
    return HISTORICAL_FINANCIAL_DATA.filter((d) => d.year === selectedYear);
  }, [selectedYear]);

  // Daily Series for Selected Month (Checkpoints across the month)
  const dailySeries = useMemo(() => {
    const checkDays = [1, 4, 7, 10, 13, 16, 18, 21, 24, 27, daysInMonth];
    const uniqueDays = Array.from(new Set(checkDays)).sort((a, b) => a - b);
    const mIncome = periodData.totalIncome;
    const mExpense = periodData.totalExpense;
    const weights = [0.06, 0.07, 0.08, 0.14, 0.08, 0.09, 0.16, 0.09, 0.08, 0.08, 0.07];

    return uniqueDays.map((day, idx) => {
      const weight = weights[idx % weights.length] || 0.09;
      const dayIncome = Math.round(mIncome * weight);
      const dayExpense = Math.round(mExpense * weight);
      const net = dayIncome - dayExpense;

      return {
        key: `day-${day}`,
        shortLabel: day < 10 ? `0${day}` : `${day}`,
        fullLabel: `Tgl ${day} ${selectedMonthName} ${selectedYear}`,
        income: dayIncome,
        expense: dayExpense,
        net,
        idx
      };
    });
  }, [selectedYear, selectedMonth, periodData.totalIncome, periodData.totalExpense, daysInMonth, selectedMonthName]);

  // Unified Active Series for Charts (Switches dynamically between Monthly (Daily dates) and Yearly (12 Months))
  const chartSeries = useMemo(() => {
    if (filterPeriodType === "MONTHLY") {
      return dailySeries;
    } else {
      return yearlySeries.map((item, idx) => ({
        key: item.month,
        shortLabel: item.month,
        fullLabel: `Bulan ${item.month} ${selectedYear}`,
        income: item.income,
        expense: item.expense,
        net: item.income - item.expense,
        idx
      }));
    }
  }, [filterPeriodType, dailySeries, yearlySeries, selectedYear]);

  const maxChartIncome = useMemo(() => Math.max(...chartSeries.map(m => m.income), 1), [chartSeries]);
  const minChartIncome = useMemo(() => Math.min(...chartSeries.map(m => m.income), 0), [chartSeries]);

  const maxChartNet = useMemo(() => Math.max(...chartSeries.map(m => m.net), 1), [chartSeries]);
  const minChartNet = useMemo(() => Math.min(...chartSeries.map(m => m.net), 0), [chartSeries]);

  const chartTrendPoints = useMemo(() => {
    const count = chartSeries.length;
    const step = (330 - 28) / (count - 1 || 1);
    return chartSeries.map((item, i) => {
      const cx = 14 + i * step;
      const cy = 68 - Math.round(((item.income - minChartIncome) / (maxChartIncome - minChartIncome || 1)) * 48);
      return { ...item, cx, cy };
    });
  }, [chartSeries, minChartIncome, maxChartIncome]);

  const chartCashPoints = useMemo(() => {
    const count = chartSeries.length;
    const step = (330 - 28) / (count - 1 || 1);
    return chartSeries.map((item, i) => {
      const cx = 14 + i * step;
      const cy = 68 - Math.round(((item.net - minChartNet) / (maxChartNet - minChartNet || 1)) * 48);
      return { ...item, cx, cy };
    });
  }, [chartSeries, minChartNet, maxChartNet]);

  // Active display points for widgets
  const defaultIdx = filterPeriodType === "MONTHLY" ? 6 : Math.max(0, Math.min(11, selectedMonth - 1));
  const activeTrendIdx = hoveredTrendIdx !== null ? hoveredTrendIdx : defaultIdx;
  const currentTrendPoint = chartTrendPoints[activeTrendIdx] || chartTrendPoints[0];

  const activeCashIdx = hoveredCashIdx !== null ? hoveredCashIdx : defaultIdx;
  const currentCashPoint = chartCashPoints[activeCashIdx] || chartCashPoints[0];

  // Dynamic Accurate Widget Subtitles & Numbers
  const accuratePeriodSubtitle = filterPeriodType === "MONTHLY" 
    ? `1 ${selectedMonthName.slice(0,3)} - ${daysInMonth} ${selectedMonthName.slice(0,3)} ${selectedYear}`
    : `1 Jan - 31 Des ${selectedYear}`;


  // Division Budgets for the selected year
  const divisionBudgets = useMemo(() => {
    const list = (DIVISION_BUDGET_YEARS as any)[selectedYear] || DIVISION_BUDGET_YEARS[2026];
    return list;
  }, [selectedYear]);

  // Multi-Level Approval Handlers (Audit -> Finance -> Direktur)
  const handleAuditApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "PENDING_FINANCE" } : r));
    setApprovalNotification("Audit Internal telah memverifikasi kesesuaian SOP & pagu anggaran.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleFinanceApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "PENDING_DIRECTOR" } : r));
    setApprovalNotification("Finance Manager memverifikasi ketersediaan dana kas & rekening penerima.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleDirectorApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "APPROVED_READY_PAY" } : r));
    setApprovalNotification("Direktur Utama memberikan otorisasi final pengeluaran (Siap Dicairkan).");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Pencairan Dana oleh Tim Finance
  const handleDisbursePayment = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const vNum = `BKK-2026-11-${Math.floor(100 + Math.random() * 900)}`;
      return {
        ...r,
        status: "DISBURSED",
        disbursedAt: new Date().toISOString().split("T")[0],
        disbursement: {
          disbursedAt: new Date().toISOString().split("T")[0],
          disbursedBy: "Dewi Anggraeni (Finance Head)",
          voucherNumber: vNum,
          sourceAccount: r.requestType === "CASH_ADVANCE" ? "Kas Kecil Lapangan (Petty Cash)" : "Bank BCA Operasional (A/C: 731-0982-11)",
          paymentMethod: r.requestType === "CASH_ADVANCE" ? "CASH_KAS_KECIL" : "TRANSFER_BANK",
          transferReference: `TRF-${Date.now().toString().slice(-6)}`,
          amountPaid: r.totalAmount,
        }
      };
    }));
    setApprovalNotification("Dana berhasil dicairkan oleh Finance. Formulir bukti pencairan siap dicetak.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Penerimaan Barang Fisik oleh Tim Audit (BAST Gudang)
  const handleAuditGoodsReceipt = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const bastNum = `BAST-2026-11-${Math.floor(100 + Math.random() * 900)}`;
      return {
        ...r,
        status: "COMPLETED",
        goodsReceipt: {
          id: `gr-${Date.now()}`,
          receiptNumber: bastNum,
          poNumber: r.requestNumber,
          requestId: r.id,
          receivedDate: new Date().toISOString().split("T")[0],
          vendorName: r.vendorInfo?.vendorName || "Pemasok Terverifikasi",
          vendorDeliveryNoteNumber: `SJ-VND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          auditedBy: "Budi Santoso (Tim Audit Internal)",
          warehouseStaff: "Logistik Jayahana",
          overallStatus: "VERIFIED_GOOD",
          inspectionLocation: "Gudang Utama Sentul / Site Proyek",
          items: (r.procurementItems || r.items).map((it: any) => ({
            itemId: it.id,
            itemCode: it.itemCode || "BRG-GEN",
            itemName: it.itemName || it.description,
            qtyOrdered: it.quantity,
            qtyReceived: it.quantity,
            unit: it.unit,
            condition: "GOOD",
            physicalAuditNotes: "Pemeriksaan fisik sesuai pesanan dan kondisi baik tanpa cacat."
          })),
          notes: "Pemeriksaan fisik oleh Tim Audit menyatakan barang diterima dalam keadaan lengkap dan baik."
        }
      };
    }));
    setApprovalNotification("Pemeriksaan fisik oleh Tim Audit selesai. Form BAST Penerimaan Barang siap dicetak.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // 3-Pintu Approval Handlers for Invoices
  const handleAuditProgressApprove = (invId: string) => {
    setSalesInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: "PENDING_FINANCE_TAX" } : inv));
    setApprovalNotification("Audit Progres Fisik Lapangan telah memvalidasi pencapaian termin & mutu fisik.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleFinanceTaxApprove = (invId: string) => {
    setSalesInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: "PENDING_DIRECTOR" } : inv));
    setApprovalNotification("Finance & Tax telah memverifikasi DPP, PPN 11%, dan PPh 23.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleDirectorInvoiceApprove = (invId: string) => {
    setSalesInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: "APPROVED_ISSUED", directorApprovalDate: new Date().toISOString().split("T")[0] } : inv));
    setApprovalNotification("Direktur Utama telah menandatangani Faktur Tagihan resmi. Dokumen siap ditagihkan ke klien.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Settlement / Pelunasan Piutang & Terbitkan Kuitansi BKM
  const handleSettleInvoicePayment = (invId: string) => {
    const targetInv = salesInvoices.find(i => i.id === invId);
    if (!targetInv) return;

    const bkmNum = `BKM-2026-11-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split("T")[0];

    const paymentRecord: InvoicePaymentRecord = {
      paymentId: `pay-${Date.now()}`,
      paymentDate: today,
      amountPaid: targetInv.totalAmount,
      voucherNumber: bkmNum,
      bankAccount: targetInv.targetBankAccount || "Bank Mandiri Operasional (A/C: 133-00-981240-8)",
      paymentMethod: "TRANSFER_BANK",
      referenceNote: `Pelunasan ${targetInv.invoiceNumber} - ${targetInv.clientName}`,
      receivedBy: "Dewi Anggraeni (Finance Head)"
    };

    setSalesInvoices(prev => prev.map(inv => inv.id === invId ? {
      ...inv,
      status: "PAID_FULL",
      paidAmount: inv.totalAmount,
      payments: [paymentRecord]
    } : inv));

    const newReceipt: OfficialReceiptBKM = {
      id: `rcpt-${Date.now()}`,
      receiptNumber: bkmNum,
      invoiceNumber: targetInv.invoiceNumber,
      clientName: targetInv.clientName,
      amountReceived: targetInv.totalAmount,
      receivedDate: today,
      paymentMethod: "Transfer Bank",
      bankTarget: targetInv.targetBankAccount || "Bank BCA / Mandiri Operasional",
      forPaymentOf: `Pelunasan ${targetInv.title} (${targetInv.contractNumber})`,
      cashierName: "Siti Rahmawati (Kasir)",
      authorizedBy: "Dewi Anggraeni, SE (Finance Head)"
    };
    setOfficialReceipts([newReceipt, ...officialReceipts]);

    const newIncomeTx: FinancialTransaction = {
      id: `tx-in-${Date.now()}`,
      transactionNumber: `TX-IN-${Date.now().toString().slice(-6)}`,
      date: today,
      description: `Pelunasan ${targetInv.invoiceNumber} - ${targetInv.clientName}`,
      unit: targetInv.unit,
      type: "INCOME",
      category: targetInv.unit === "ME_CORE" ? "Termin Kontrak Jasa ME" : "Pendapatan Langganan FTTH",
      amount: targetInv.totalAmount,
      status: "COMPLETED",
      paymentMethod: "Transfer Bank",
      recipientOrPayer: targetInv.clientName
    };
    setTransactions([newIncomeTx, ...transactions]);

    setApprovalNotification(`Pembayaran ${targetInv.invoiceNumber} sebesar ${formatRupiah(targetInv.totalAmount)} berhasil diterima & Kuitansi BKM telah terbit.`);
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  const handleCreateSalesInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvClient || !newInvDpp || !newInvTitle) return;

    const parsedDpp = parseFloat(newInvDpp);
    const ppn = Math.round(parsedDpp * 0.11);
    const pph23 = newInvIncludePph23 ? Math.round(parsedDpp * 0.02) : 0;
    const total = parsedDpp + ppn - pph23;

    const invNum = `INV-2026-${newInvUnit === "ME_CORE" ? "ME" : "STAR"}-${Math.floor(100 + Math.random() * 900)}`;

    const newInvoice: SalesInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      clientName: newInvClient,
      clientAddress: newInvAddress || "Alamat Klien Terdaftar",
      clientNPWP: newInvNPWP || "01.xxx.xxx.x-xxx.000",
      contractNumber: newInvContract || `SPK-2026-${Math.floor(10 + Math.random() * 90)}`,
      unit: newInvUnit,
      title: newInvTitle,
      description: `Penagihan termin/layanan untuk ${newInvClient}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: newInvDueDate || "2026-11-30",
      progressPercent: parseInt(newInvProgress) || 30,
      dppAmount: parsedDpp,
      ppnPercent: 11,
      ppnAmount: ppn,
      pph23Percent: newInvIncludePph23 ? 2 : undefined,
      pph23Amount: pph23 || undefined,
      totalAmount: total,
      paidAmount: 0,
      status: newInvUnit === "ME_CORE" ? "PENDING_AUDIT_PROGRESS" : "PENDING_FINANCE_TAX",
      targetBankAccount: "Bank Mandiri (A/C: 133-00-981240-8 a.n. PT Jayahana Manaura Mekanika Selaras)",
      auditProgressNote: "Menunggu verifikasi lapangan tim audit.",
      financeTaxNote: "Perhitungan PPN 11% dan PPh 23 terverifikasi sistem."
    };

    setSalesInvoices([newInvoice, ...salesInvoices]);
    setIsInvoiceModalOpen(false);
    setNewInvClient("");
    setNewInvAddress("");
    setNewInvNPWP("");
    setNewInvContract("");
    setNewInvTitle("");
    setNewInvDpp("");
    setApprovalNotification(`Faktur Penjualan ${invNum} berhasil dibuat dan masuk antrean review.`);
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Pending Approvals Handler
  const handleApprove = (id: string, docNumber: string) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    setApprovalNotification(`Dokumen ${docNumber} berhasil disetujui & diproses.`);
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Use items table total if items have values, otherwise fall back to newAmount
    const parsedAmount = requestItemsSubTotal > 0 ? requestItemsSubTotal : parseFloat(newAmount || "0");
    if (parsedAmount <= 0) return;
    const newDocNum = `${newType === "CASH_ADVANCE" ? "CA" : "PR"}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReq: BudgetRequest = {
      id: `req-${Date.now()}`,
      requestNumber: newDocNum,
      title: newTitle,
      unit: newUnit,
      category: newCategory,
      costCenterId: newUnit.startsWith("HO") ? "cc-ho-01" : "cc-site-01",
      requesterName: requesterName,
      requesterRole: newType === "CASH_ADVANCE" ? "FIELD_TECH" : "SITE_SPV",
      requestType: newType,
      totalAmount: parsedAmount,
      status: "PENDING_AUDIT",
      purpose: newPurpose,
      createdAt: requestDate,
      items: requestItems.filter(i => i.description).map(i => ({
        id: `item-${Date.now()}-${i.id}`,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit,
        estimatedPrice: i.unitPrice,
        totalPrice: i.quantity * i.unitPrice * (1 - i.discount / 100),
      })),
      procurementItems: newType === "PURCHASE_REQUISITION" ? requestItems.filter(i => i.description).map(i => ({
        id: `pi-${Date.now()}-${i.id}`,
        itemCode: `MAT-${Math.floor(100 + Math.random() * 900)}`,
        itemName: i.description,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.unitPrice,
        totalPrice: i.quantity * i.unitPrice * (1 - i.discount / 100),
      })) : undefined,
      vendorInfo: newType === "PURCHASE_REQUISITION" && vendorName ? {
        vendorName: vendorName,
        paymentTerms: paymentTerms,
        bankName: bankName,
        bankAccountNumber: bankAccountNumber || "Rekening Vendor",
        bankAccountName: bankAccountName || vendorName,
        shippingAddress: shippingAddress,
        remarks: newPurpose
      } : undefined
    };

    // Add to requests
    setRequests([newReq, ...requests]);

    // Also add to Pending Approvals queue
    const newApproval: PendingApprovalItem = {
      id: `appr-${Date.now()}`,
      type: "BUDGET_REQUEST",
      docNumber: newDocNum,
      title: newTitle,
      unit: newUnit,
      requester: requesterName,
      amount: parsedAmount,
      submittedAt: new Date().toISOString().split("T")[0],
      level: "Audit Internal",
      urgent: parsedAmount > 10000000,
    };
    setPendingApprovals([newApproval, ...pendingApprovals]);

    setIsModalOpen(false);
    setNewTitle("");
    setNewAmount("");
    setNewPurpose("");
    setVendorName("");
    setBankAccountNumber("");
    setBankAccountName("");
    setRequestDate(new Date().toISOString().split("T")[0]);
    setNewUnit("Rajeg & Pasar Kemis");
    setNewCategory("Akomodasi");
    setRequestItems([{ id: "ri-1", description: "", quantity: 1, unit: "Pcs", unitPrice: 0, discount: 0 }]);
  };

  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeTitle || !incomeAmount) return;

    const parsedAmount = parseFloat(incomeAmount);
    const newTx: FinancialTransaction = {
      id: `tx-in-${Date.now()}`,
      transactionNumber: `TX-IN-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      description: incomeTitle,
      unit: incomeUnit,
      type: "INCOME",
      category: incomeCategory,
      amount: parsedAmount,
      status: "COMPLETED",
      paymentMethod: "Bank Mandiri / QRIS",
      recipientOrPayer: incomePayer || "Klien / Pelanggan"
    };

    setTransactions([newTx, ...transactions]);
    setIsIncomeModalOpen(false);
    setIncomeTitle("");
    setIncomeAmount("");
    setIncomePayer("");
  };

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchType = txTypeFilter === "ALL" || tx.type === txTypeFilter;
      const matchSearch = txSearch === "" || 
        tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.recipientOrPayer.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.transactionNumber.toLowerCase().includes(txSearch.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transactions, txTypeFilter, txSearch]);

  // Overall Metrics
  const totalSubscribers = INITIAL_SUBSCRIBERS.length;
  const totalMonthlyAR = INITIAL_SUBSCRIBERS.reduce((acc, s) => acc + s.monthlyFee, 0);
  const paidInvoicesCount = INITIAL_INVOICES.filter(i => i.paymentStatus === "PAID").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-xl">
              J
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {COMPANY_NAME}
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wider">
                  ERP & Billing
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sistem Keuangan, Pengadaan & Ekosistem Starlite FTTH
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+ Catat Pemasukan</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Pengajuan Dana</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-100 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Dashboard Utama
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Pengajuan Anggaran & Kas Bon
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {requests.filter(r => r.status.startsWith("PENDING")).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lpj")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "lpj"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Realisasi & LPJ Nota
          </button>

          <button
            onClick={() => setActiveTab("starlite")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "starlite"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Pendapatan, Billing & Piutang (AR)
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {salesInvoices.filter(i => i.status !== "PAID_FULL").length} Tagihan
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "reports"
                ? "border-blue-600 text-blue-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Laporan Keuangan & Laba Rugi
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ========================================================================= */}
        {/* TAB 1: REVAMPED EXECUTIVE DASHBOARD WITH PERIOD FILTER & WIDGETS           */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Notification Banner for Approval Action */}
            {approvalNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">{approvalNotification}</span>
                </div>
                <button onClick={() => setApprovalNotification(null)} className="text-emerald-600 hover:text-emerald-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Top Toolbar: Filter Periode & Header Title */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Dashboard Keuangan & Operasional</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Periode: {periodData.periodLabel}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau pemasukan, pengeluaran, serapan pagu anggaran per divisi, serta antrean persetujuan.
                </p>
              </div>

              {/* Filter Control Section */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
                {/* Switch Bulanan vs Tahunan */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                  <button
                    onClick={() => setFilterPeriodType("MONTHLY")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      filterPeriodType === "MONTHLY"
                        ? "bg-white text-blue-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Bulanan
                  </button>
                  <button
                    onClick={() => setFilterPeriodType("YEARLY")}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      filterPeriodType === "YEARLY"
                        ? "bg-white text-blue-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Tahunan
                  </button>
                </div>

                {/* Dropdown Bulan (Active when MONTHLY) */}
                {filterPeriodType === "MONTHLY" && (
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      {MONTH_NAMES.map((m) => (
                        <option key={m.num} value={m.num}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Dropdown Tahun (2026, 2025, 2024) */}
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-slate-400 font-mono">Thn:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value={2026}>2026 (Aktif)</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Overview Cards: Pemasukan, Pengeluaran, Net Cash Flow, AR Health */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Pemasukan */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total Pemasukan</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {formatRupiah(periodData.totalIncome)}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Termin ME & FTTH</span>
                  <span className="font-semibold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4% vs lalu
                  </span>
                </div>
              </div>

              {/* Card 2: Total Pengeluaran */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Total Pengeluaran</span>
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {formatRupiah(periodData.totalExpense)}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Realisasi Kas & PO</span>
                  <span className="font-semibold text-slate-700">
                    {Math.round((periodData.totalExpense / periodData.totalIncome) * 100)}% Rasio Biaya
                  </span>
                </div>
              </div>

              {/* Card 3: Arus Kas Bersih (Net Cash Flow) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Arus Kas Bersih</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-xl font-extrabold tracking-tight ${periodData.netCashFlow >= 0 ? "text-blue-700" : "text-rose-600"}`}>
                  {formatRupiah(periodData.netCashFlow)}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Margin Bersih</span>
                  <span className="font-bold text-blue-600">
                    {periodData.profitMargin.toFixed(1)}% (Surplus)
                  </span>
                </div>
              </div>

              {/* Card 4: Starlite FTTH Collection & Piutang */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-800">Tagihan FTTH</span>
                  <div className="w-7 h-7 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-extrabold text-fuchsia-700 tracking-tight">
                  {formatRupiah(totalMonthlyAR)}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Penagihan Berjalan</span>
                  <span className="font-bold text-emerald-600">
                    {paidInvoicesCount} / {INITIAL_INVOICES.length} Lunas
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: ACCURATE ERP WIDGETS (TREN PENJUALAN, LABA/RUGI, BEBAN, DLL)   */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              {/* Header Widget Bar */}
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Panel Finansial & Operasional (Standard Accurate ERP)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    Live Data
                  </span>
                </div>
                <button
                  onClick={handleRefreshWidgets}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition"
                  title="Refresh Widgets"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${widgetRefreshAnim ? "animate-spin text-blue-600" : ""}`} />
                  <span>Refresh Widget</span>
                </button>
              </div>

              {/* ROW 1: Aktifitas Terakhir, Kegiatan Mendatang, Tren Penjualan */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Widget 1: Aktifitas Terakhir Anda */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">Aktifitas Terakhir Anda ({USER_ACTIVITY_ACCURATE.userName})</h3>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="py-4 flex items-center gap-4">
                    <div className="text-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-2xl font-black text-slate-900 leading-tight">18</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Nov</div>
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Hari ini &bull; {USER_ACTIVITY_ACCURATE.lastActivityTime}</span>
                      </div>
                      <div className="font-bold text-slate-800 mt-1 text-xs">
                        {USER_ACTIVITY_ACCURATE.lastActivityDesc}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Preferensi Akun Tersimpan
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                    <span>Sesi: Administrator Utama</span>
                    <span>IP: 192.168.1.31</span>
                  </div>
                </div>

                {/* Widget 2: Kegiatan Mendatang */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">Kegiatan Mendatang</h3>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="py-2 space-y-2">
                    {USER_ACTIVITY_ACCURATE.upcomingEvents.map((ev) => (
                      <div key={ev.id} className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-start justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">{ev.title}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" /> {ev.date}
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-xs ${
                          ev.division === "STARLITE_FTTH" ? "bg-fuchsia-100 text-fuchsia-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {ev.division === "STARLITE_FTTH" ? "Starlite" : "ME Core"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-blue-600 font-semibold text-right cursor-pointer hover:underline">
                    Lihat Semua Jadwal &rarr;
                  </div>
                </div>

                {/* Widget 3: Tren Penjualan (Dinamis: Harian saat Bulanan, Per Bulan saat Tahunan) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Tren Penjualan</h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({filterPeriodType === "MONTHLY" ? `Harian &bull; ${selectedMonthName} ${selectedYear}` : `Per Bulan &bull; Thn ${selectedYear}`})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* SVG Line Chart for Tren Penjualan */}
                  <div className="py-2">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-500">
                        {filterPeriodType === "MONTHLY" ? "Tanggal:" : "Bulan:"} <strong className="text-blue-700">{currentTrendPoint?.fullLabel}</strong>
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatRupiah(currentTrendPoint?.income || 0)}
                      </span>
                    </div>
                    <div className="h-28 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 330 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesDynamicGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <polygon
                          fill="url(#salesDynamicGrad)"
                          points={`14,78 ${chartTrendPoints.map(p => `${p.cx},${p.cy}`).join(" ")} 316,78`}
                        />
                        {/* Grid Line 0 */}
                        <line x1="0" y1="78" x2="330" y2="78" stroke="#e2e8f0" strokeWidth="1" />
                        {/* Line Path */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={chartTrendPoints.map(p => `${p.cx},${p.cy}`).join(" ")}
                        />
                        {/* Data Points */}
                        {chartTrendPoints.map((pt) => {
                          const isActive = activeTrendIdx === pt.idx;
                          return (
                            <circle
                              key={pt.key}
                              cx={pt.cx}
                              cy={pt.cy}
                              r={isActive ? "5.5" : "3.5"}
                              className="cursor-pointer transition-all"
                              fill={isActive ? "#1d4ed8" : "#3b82f6"}
                              stroke="#ffffff"
                              strokeWidth={isActive ? "2.5" : "1.5"}
                              onMouseEnter={() => setHoveredTrendIdx(pt.idx)}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Dynamic Labels (Dates in Monthly, Months in Yearly) */}
                    <div className="flex justify-between text-[9px] text-slate-500 font-medium px-0.5 mt-1.5">
                      {chartSeries.map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setHoveredTrendIdx(item.idx)}
                          onMouseEnter={() => setHoveredTrendIdx(item.idx)}
                          className={`px-1 py-0.5 rounded-xs transition ${
                            activeTrendIdx === item.idx 
                              ? "font-bold text-blue-700 bg-blue-100/70" 
                              : "hover:text-slate-900"
                          }`}
                        >
                          {item.shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Min: {formatRupiah(minChartIncome)}</span>
                    <span className="text-emerald-600 font-semibold">Maks: {formatRupiah(maxChartIncome)}</span>
                  </div>
                </div>
              </div>

              {/* ROW 2: Laba/Rugi Tahun ini, Beban Perusahaan, Arus Kas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Widget 4: Laba/Rugi (Dinamis Sesuai Filter) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900">
                        {filterPeriodType === "MONTHLY" ? "Laba/Rugi Bulan ini" : "Laba/Rugi Tahun ini"}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400">
                        <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <div className="py-1 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
                      <span className="cursor-pointer hover:text-slate-800">&lt;</span>
                      <span>{accuratePeriodSubtitle}</span>
                      <span className="cursor-pointer hover:text-slate-800">&gt;</span>
                    </div>

                    {/* Gauge / Donut + Legend */}
                    <div className="flex items-center gap-3 py-3">
                      {/* Circular Gauge */}
                      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3.5"
                            strokeDasharray="97.4"
                            strokeDashoffset={Math.max(0, 97.4 - (97.4 * Math.max(0, Math.min(100, periodData.profitMargin))) / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xs font-black text-slate-900">{periodData.profitMargin.toFixed(1)}%</span>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold">Margin</span>
                        </div>
                      </div>

                      {/* Legend Items */}
                      <div className="flex-1 space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Pendapatan
                          </span>
                          <span className="font-bold text-slate-900">{formatRupiah(periodData.totalIncome)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Nilai HPP
                          </span>
                          <span className="font-semibold text-slate-700">{formatRupiah(Math.round(periodData.totalExpense * 0.65))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Pengeluaran
                          </span>
                          <span className="font-semibold text-slate-700">{formatRupiah(periodData.totalExpense)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">
                      Dibanding tahun lalu: <strong className="text-slate-600">{formatRupiah(Math.round(periodData.totalIncome * 0.88))}</strong>
                    </span>
                    <span className="font-bold text-emerald-600 text-xs">
                      Laba: {formatRupiah(periodData.netCashFlow)}
                    </span>
                  </div>
                </div>

                {/* Widget 5: Beban Perusahaan (Dinamis Sesuai Filter) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900">Beban Perusahaan</h3>
                      <div className="flex items-center gap-1 text-slate-400">
                        <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <div className="py-1 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
                      <span className="cursor-pointer hover:text-slate-800">&lt;</span>
                      <span>{accuratePeriodSubtitle}</span>
                      <span className="cursor-pointer hover:text-slate-800">&gt;</span>
                    </div>

                    <div className="flex items-center gap-3 py-3">
                      {/* Donut Beban */}
                      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeDasharray="97.4"
                            strokeDashoffset={Math.round(97.4 - (97.4 * (periodData.meExpense / (periodData.totalExpense || 1))))}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xs font-black text-slate-900">
                            {Math.round((periodData.meExpense / (periodData.totalExpense || 1)) * 100)}%
                          </span>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold">ME Mat</span>
                        </div>
                      </div>

                      {/* Beban Total & Breakdown */}
                      <div className="flex-1 space-y-1 text-[11px]">
                        <div className="text-xs font-bold text-slate-900 mb-1">
                          Beban: {formatRupiah(periodData.totalExpense)}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-600">
                          <span className="truncate max-w-[110px]">Material & Kabel ME</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round((periodData.meExpense / (periodData.totalExpense || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-600">
                          <span className="truncate max-w-[110px]">Bandwidth & OLT FTTH</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round((periodData.ftthExpense / (periodData.totalExpense || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-600">
                          <span className="truncate max-w-[110px]">Operasional & Umum</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round((periodData.overheadExpense / (periodData.totalExpense || 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">
                      Realisasi Kas: <strong className="text-slate-600">{formatRupiah(periodData.totalExpense)}</strong>
                    </span>
                    <span className="text-emerald-600 font-semibold">-5.4% Efisien</span>
                  </div>
                </div>

                {/* Widget 6: Arus Kas (Dinamis: Harian saat Bulanan, Per Bulan saat Tahunan) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Arus Kas</h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({filterPeriodType === "MONTHLY" ? `Harian &bull; ${selectedMonthName} ${selectedYear}` : `Per Bulan &bull; Thn ${selectedYear}`})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="py-2">
                    {/* Tooltip Badge */}
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-500">
                        {filterPeriodType === "MONTHLY" ? "Tanggal:" : "Bulan:"} <strong className="text-sky-700">{currentCashPoint?.fullLabel}</strong>
                      </span>
                      <span className={`font-bold ${(currentCashPoint?.net || 0) >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        Net: {formatRupiah(currentCashPoint?.net || 0)}
                      </span>
                    </div>

                    <div className="h-28 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 330 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cashDynamicGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <polygon
                          fill="url(#cashDynamicGrad)"
                          points={`14,78 ${chartCashPoints.map(p => `${p.cx},${p.cy}`).join(" ")} 316,78`}
                        />
                        <line x1="0" y1="78" x2="330" y2="78" stroke="#cbd5e1" strokeWidth="1" />
                        <polyline
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={chartCashPoints.map(p => `${p.cx},${p.cy}`).join(" ")}
                        />
                        {chartCashPoints.map((pt) => {
                          const isActive = activeCashIdx === pt.idx;
                          return (
                            <circle
                              key={pt.key}
                              cx={pt.cx}
                              cy={pt.cy}
                              r={isActive ? "5.5" : "3.5"}
                              className="cursor-pointer transition-all"
                              fill={isActive ? "#0369a1" : "#0284c7"}
                              stroke="#ffffff"
                              strokeWidth={isActive ? "2.5" : "1.5"}
                              onMouseEnter={() => setHoveredCashIdx(pt.idx)}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Dynamic Labels (Dates in Monthly, Months in Yearly) */}
                    <div className="flex justify-between text-[9px] text-slate-500 font-medium px-0.5 mt-1.5">
                      {chartSeries.map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setHoveredCashIdx(item.idx)}
                          onMouseEnter={() => setHoveredCashIdx(item.idx)}
                          className={`px-1 py-0.5 rounded-xs transition ${
                            activeCashIdx === item.idx 
                              ? "font-bold text-sky-700 bg-sky-100/70" 
                              : "hover:text-slate-900"
                          }`}
                        >
                          {item.shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Min Net: {formatRupiah(minChartNet)}</span>
                    <span className="text-sky-700 font-semibold">Maks Net: {formatRupiah(maxChartNet)}</span>
                  </div>
                </div>
              </div>

              {/* ROW 3: Penjualan & Pembelian (Status Faktur - Dinamis Sesuai Filter) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Widget 7: Penjualan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Penjualan</h3>
                      <span className="text-[10px] text-slate-400 font-mono">&lt; {accuratePeriodSubtitle} &gt;</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Pendapatan</span>
                      <div className="text-base font-extrabold text-slate-900">{formatRupiah(periodData.totalIncome)}</div>
                      <span className="text-[10px] text-slate-400">Hari ini: {formatRupiah(SALES_SUMMARY_ACCURATE.hariIni)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Belum Lunas (Piutang AR)</span>
                      <div className="text-base font-extrabold text-amber-600">{formatRupiah(Math.round(periodData.totalIncome * 0.228))}</div>
                      <span className="text-[10px] text-slate-400">Kolektibilitas: 77.2%</span>
                    </div>
                  </div>

                  {/* 4 Box Breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 font-semibold block">Faktur Lunas</span>
                      <span className="font-bold text-emerald-700 text-[11px]">{formatRupiah(Math.round(periodData.totalIncome * 0.772))}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-600 font-semibold block">Belum Lunas</span>
                      <span className="font-bold text-slate-800 text-[11px]">{formatRupiah(Math.round(periodData.totalIncome * 0.228))}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-amber-800 font-semibold block">Belum Jth Tempo</span>
                      <span className="font-bold text-amber-700 text-[11px]">{formatRupiah(Math.round(periodData.totalIncome * 0.185))}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                      <span className="text-[10px] text-rose-800 font-semibold block">Lewat Tempo</span>
                      <span className="font-bold text-rose-700 text-[11px]">{formatRupiah(Math.round(periodData.totalIncome * 0.043))}</span>
                    </div>
                  </div>
                </div>

                {/* Widget 8: Pembelian */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Pembelian</h3>
                      <span className="text-[10px] text-slate-400 font-mono">&lt; {accuratePeriodSubtitle} &gt;</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Pembelian</span>
                      <div className="text-base font-extrabold text-slate-900">{formatRupiah(periodData.totalExpense)}</div>
                      <span className="text-[10px] text-slate-400">Hari ini: {formatRupiah(PURCHASE_SUMMARY_ACCURATE.hariIni)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Belum Lunas (Hutang AP)</span>
                      <div className="text-base font-extrabold text-slate-700">{formatRupiah(Math.round(periodData.totalExpense * 0.14))}</div>
                      <span className="text-[10px] text-slate-400">PO Aktif: 4 Dokumen</span>
                    </div>
                  </div>

                  {/* 4 Box Breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 font-semibold block">Faktur Lunas</span>
                      <span className="font-bold text-emerald-700 text-[11px]">{formatRupiah(Math.round(periodData.totalExpense * 0.86))}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-600 font-semibold block">Belum Lunas</span>
                      <span className="font-bold text-slate-800 text-[11px]">{formatRupiah(Math.round(periodData.totalExpense * 0.14))}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-amber-800 font-semibold block">Belum Jth Tempo</span>
                      <span className="font-bold text-amber-700 text-[11px]">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.belumJatuhTempo)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                      <span className="text-[10px] text-rose-800 font-semibold block">Lewat Tempo</span>
                      <span className="font-bold text-rose-700 text-[11px]">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.lewatJatuhTempo)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: VISUAL BAR CHART (PEMASUKAN & PENGELUARAN) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Grafik Komparasi Pemasukan vs Pengeluaran ({periodData.periodLabel})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Visualisasi dinamika arus dana dan proporsi serapan biaya operasional.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Pemasukan
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-blue-600"></span> Pengeluaran
                    </span>
                  </div>

                  <div className="bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold flex">
                    <button
                      onClick={() => setChartMode("FLOW")}
                      className={`px-2.5 py-1 rounded-md transition ${chartMode === "FLOW" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                    >
                      Tren Arus Kas
                    </button>
                    <button
                      onClick={() => setChartMode("DIVISION")}
                      className={`px-2.5 py-1 rounded-md transition ${chartMode === "DIVISION" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                    >
                      Breakdown Divisi
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Render */}
              {chartMode === "FLOW" ? (
                <div>
                  {filterPeriodType === "YEARLY" ? (
                    // 12 Months Bar Chart for Selected Year
                    <div className="space-y-3">
                      <div className="h-56 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 border-b border-slate-200">
                        {periodData.monthlySeries.map((item) => {
                          const maxVal = Math.max(...periodData.monthlySeries.map(m => Math.max(m.income, m.expense)));
                          const incHeight = Math.round((item.income / maxVal) * 100);
                          const expHeight = Math.round((item.expense / maxVal) * 100);

                          return (
                            <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                              <div className="w-full flex justify-center items-end gap-1 sm:gap-1.5 h-full">
                                {/* Income Bar */}
                                <div
                                  style={{ height: `${incHeight}%` }}
                                  className="w-1/2 max-w-[18px] bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600 relative group/bar"
                                >
                                  <div className="opacity-0 group-hover/bar:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-20 pointer-events-none">
                                    Masuk: {formatRupiah(item.income)}
                                  </div>
                                </div>
                                {/* Expense Bar */}
                                <div
                                  style={{ height: `${expHeight}%` }}
                                  className="w-1/2 max-w-[18px] bg-blue-600 rounded-t-sm transition-all hover:bg-blue-700 relative group/bar"
                                >
                                  <div className="opacity-0 group-hover/bar:opacity-100 transition absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-xs whitespace-nowrap z-20 pointer-events-none">
                                    Keluar: {formatRupiah(item.expense)}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500 mt-2">
                                {item.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1">
                        <span>Skala Min: Rp 0</span>
                        <span className="font-medium text-slate-600">
                          Rata-rata Pengeluaran/Bln: {formatRupiah(Math.round(periodData.totalExpense / 12))}
                        </span>
                        <span>Maks: {formatRupiah(Math.max(...periodData.monthlySeries.map(m => Math.max(m.income, m.expense))))}</span>
                      </div>
                    </div>
                  ) : (
                    // Single Month Detailed Visual Gauge & Breakdown
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 items-center">
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-emerald-700 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Total Pemasukan
                            </span>
                            <span className="text-slate-900 font-bold">{formatRupiah(periodData.totalIncome)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "100%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-blue-700 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Total Pengeluaran
                            </span>
                            <span className="text-slate-900 font-bold">{formatRupiah(periodData.totalExpense)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (periodData.totalExpense / periodData.totalIncome) * 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                          <span>Efisiensi Anggaran: Biaya operasional menyerap <strong>{Math.round((periodData.totalExpense / periodData.totalIncome) * 100)}%</strong> dari total penerimaan kas.</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Sehat (Surplus)
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Net Surplus Kas</div>
                          <div className="text-2xl font-bold mt-1 text-white">{formatRupiah(periodData.netCashFlow)}</div>
                          <p className="text-xs text-blue-200 mt-2">
                            Penerimaan bulan {periodData.periodLabel} mencatat surplus margin operasional sebesar {periodData.profitMargin.toFixed(1)}%.
                          </p>
                        </div>
                        <div className="pt-3 border-t border-blue-800/80 mt-4 flex justify-between items-center text-xs">
                          <span className="text-blue-300">Rasio Margin</span>
                          <span className="font-bold text-emerald-300">+{periodData.profitMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Division Breakdown View
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-900">Jasa ME Core</span>
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatRupiah(periodData.meExpense)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Porsi: {Math.round((periodData.meExpense / periodData.totalExpense) * 100)}% dari total beban
                    </div>
                    <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.round((periodData.meExpense / periodData.totalExpense) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-fuchsia-900">Starlite FTTH (Capex & Opex)</span>
                      <Wifi className="w-4 h-4 text-fuchsia-600" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatRupiah(periodData.ftthExpense)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Porsi: {Math.round((periodData.ftthExpense / periodData.totalExpense) * 100)}% dari total beban
                    </div>
                    <div className="w-full bg-fuchsia-200 h-1.5 rounded-full mt-2">
                      <div className="bg-fuchsia-600 h-1.5 rounded-full" style={{ width: `${Math.round((periodData.ftthExpense / periodData.totalExpense) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">Overhead & Umum</span>
                      <ShieldCheck className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">{formatRupiah(periodData.overheadExpense)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Porsi: {Math.round((periodData.overheadExpense / periodData.totalExpense) * 100)}% dari total beban
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                      <div className="bg-slate-600 h-1.5 rounded-full" style={{ width: `${Math.round((periodData.overheadExpense / periodData.totalExpense) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: PAGU ANGGARAN PER DIVISI (TRACK CAPAIAN ANGGARAN & PREVIEW) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Pagu Anggaran per Divisi (Track Capaian Tahun {selectedYear})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Monitoring batas pagu, realisasi serapan anggaran, dan sisa alokasi dana per unit operasional.
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Tahun Buku: {selectedYear}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {divisionBudgets.map((div: any) => {
                  const percentage = Math.round((div.terpakai / div.pagu) * 100);
                  const sisa = div.pagu - div.terpakai;
                  const isWarning = percentage >= 80 && percentage < 92;
                  const isDanger = percentage >= 92;

                  return (
                    <div key={div.code} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
                      <div>
                        {/* Header Divisi */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                              div.unit === "ME_CORE" 
                                ? "bg-blue-100 text-blue-700" 
                                : div.unit === "STARLITE_FTTH" 
                                ? "bg-fuchsia-100 text-fuchsia-700" 
                                : "bg-slate-100 text-slate-700"
                            }`}>
                              {div.unit === "ME_CORE" ? <Building2 className="w-4 h-4" /> : div.unit === "STARLITE_FTTH" ? <Wifi className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-xs">{div.name}</h3>
                              <span className="text-[10px] font-mono text-slate-400">{div.code}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isDanger 
                              ? "bg-rose-100 text-rose-800" 
                              : isWarning 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {isDanger ? "Mendekati Batas" : isWarning ? "Perhatian" : "Terkendali"}
                          </span>
                        </div>

                        {/* Angka Pagu & Realisasi */}
                        <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl">
                          <div>
                            <span className="text-[10px] text-slate-500 font-medium uppercase">Pagu Total</span>
                            <div className="text-xs font-bold text-slate-900">{formatRupiah(div.pagu)}</div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-medium uppercase">Terserap ({percentage}%)</span>
                            <div className="text-xs font-bold text-blue-700">{formatRupiah(div.terpakai)}</div>
                          </div>
                        </div>

                        {/* Progress Bar Capaian */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Sisa Pagu Anggaran:</span>
                            <span className="font-bold text-slate-900">{formatRupiah(sisa)}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-blue-600"
                              }`}
                              style={{ width: `${Math.min(100, percentage)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Preview Info */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                        <span>Komitmen PO Berjalan:</span>
                        <span className="font-mono font-medium text-slate-700">{formatRupiah(div.terencana)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: SHORTCUT ANTREAN PERSETUJUAN (PENDING APPROVALS) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Antrean Persetujuan (Pending Approvals)
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                        {pendingApprovals.length} Dokumen Menunggu
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Shortcut cepat untuk meninjau pengajuan kas bon, PR material, dan LPJ nota yang membutuhkan persetujuan.
                    </p>
                  </div>
                </div>

                {/* Filter Sub-Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setApprovalFilter("ALL")}
                    className={`px-2.5 py-1 rounded-lg transition ${approvalFilter === "ALL" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                  >
                    Semua ({pendingApprovals.length})
                  </button>
                  <button
                    onClick={() => setApprovalFilter("BUDGET_REQUEST")}
                    className={`px-2.5 py-1 rounded-lg transition ${approvalFilter === "BUDGET_REQUEST" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                  >
                    Pengajuan Dana ({pendingApprovals.filter(p => p.type === "BUDGET_REQUEST").length})
                  </button>
                  <button
                    onClick={() => setApprovalFilter("LPJ_REALIZATION")}
                    className={`px-2.5 py-1 rounded-lg transition ${approvalFilter === "LPJ_REALIZATION" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                  >
                    Realisasi LPJ ({pendingApprovals.filter(p => p.type === "LPJ_REALIZATION").length})
                  </button>
                </div>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Semua dokumen telah disetujui!</p>
                  <p className="text-[11px] text-slate-400">Tidak ada pengajuan atau LPJ yang tertunda saat ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingApprovals
                    .filter(item => approvalFilter === "ALL" || item.type === approvalFilter)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                item.type === "BUDGET_REQUEST" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-purple-100 text-purple-800"
                              }`}>
                                {item.type === "BUDGET_REQUEST" ? "Pengajuan Dana" : "LPJ Nota Realisasi"}
                              </span>
                              <span className="font-mono text-[11px] font-bold text-slate-900">{item.docNumber}</span>
                            </div>

                            {item.urgent && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-100 text-rose-700 animate-pulse">
                                Urgent
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>

                          <div className="flex justify-between items-center text-[11px] text-slate-500">
                            <span>Pemohon: <strong className="text-slate-700">{item.requester}</strong></span>
                            <span className="text-slate-400 font-mono">{formatDateIndo(item.submittedAt)}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Nominal Diajukan</span>
                            <span className="text-xs font-extrabold text-slate-900">{formatRupiah(item.amount)}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                if (item.type === "BUDGET_REQUEST") setActiveTab("requests");
                                else setActiveTab("lpj");
                              }}
                              className="px-2.5 py-1 text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium transition"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleApprove(item.id, item.docNumber)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Setujui
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* SECTION 4: TRANSAKSI TERBARU (PEMASUKAN & PENGELUARAN) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    Transaksi Kas Terbaru (Arus Masuk & Keluar)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pencatatan real-time penerimaan termin proyek, tagihan internet, dan pengeluaran belanja.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari transaksi, klien, nomor..."
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setTxTypeFilter("ALL")}
                      className={`px-2.5 py-1 rounded-lg transition ${txTypeFilter === "ALL" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"}`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setTxTypeFilter("INCOME")}
                      className={`px-2.5 py-1 rounded-lg transition ${txTypeFilter === "INCOME" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"}`}
                    >
                      Pemasukan (+)
                    </button>
                    <button
                      onClick={() => setTxTypeFilter("EXPENSE")}
                      className={`px-2.5 py-1 rounded-lg transition ${txTypeFilter === "EXPENSE" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600"}`}
                    >
                      Pengeluaran (-)
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5">No. Transaksi / Tgl</th>
                      <th className="px-4 py-2.5">Uraian Transaksi</th>
                      <th className="px-4 py-2.5">Divisi / Unit</th>
                      <th className="px-4 py-2.5">Pihak Terkait</th>
                      <th className="px-4 py-2.5">Metode Bayar</th>
                      <th className="px-4 py-2.5 text-right">Nominal</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredTransactions.slice(0, 7).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-slate-900">{tx.transactionNumber}</div>
                          <div className="text-[10px] text-slate-400">{formatDateIndo(tx.date)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{tx.description}</div>
                          <div className="text-[10px] text-slate-500">{tx.category}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.unit === "ME_CORE" 
                              ? "bg-blue-100 text-blue-700" 
                              : tx.unit === "STARLITE_FTTH" 
                              ? "bg-fuchsia-100 text-fuchsia-700" 
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {tx.unit === "ME_CORE" ? "ME Core" : tx.unit === "STARLITE_FTTH" ? "Starlite FTTH" : "Overhead"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{tx.recipientOrPayer}</td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">{tx.paymentMethod}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-mono font-bold text-xs ${
                            tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                          }`}>
                            {tx.type === "INCOME" ? "+" : "-"}{formatRupiah(tx.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Berhasil
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Menampilkan <strong>{filteredTransactions.length}</strong> transaksi terbaru</span>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  Lihat Buku Kas & Rekapitulasi Lengkap &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGAJUAN ANGGARAN & PENGADAAN (SIKLUS 4 TAHAP LENGKAP) */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            
            {/* Header Tab & Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Alur Pengajuan Anggaran, Pencairan & Pengadaan Barang</h2>
                <p className="text-xs text-slate-500">
                  Siklus terintegrasi: Pengajuan (Approval Audit, Finance, Direktur) &bull; Pencairan Kas &bull; Laporan Realisasi LPJ &bull; Penerimaan Barang Fisik (Audit).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <option value="ALL">Semua Site / Divisi</option>
                  <optgroup label="Site Operasional">
                    {SITE_DIVISIONS.filter(s => !s.startsWith("HO")).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Head Office (HO)">
                    {SITE_DIVISIONS.filter(s => s.startsWith("HO")).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Unit Bisnis Legacy">
                    <option value="ME_CORE">Jasa ME Core</option>
                    <option value="STARLITE_FTTH">Starlite FTTH</option>
                    <option value="OVERHEAD_OPERASIONAL">Overhead / Umum</option>
                  </optgroup>
                </select>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Pengajuan / PO Baru</span>
                </button>
              </div>
            </div>

            {/* SUB-TAB NAVIGASI 4 TAHAPAN ALUR */}
            <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-white p-2 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setRequestWorkflowSubTab("PROPOSAL")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  requestWorkflowSubTab === "PROPOSAL" 
                    ? "bg-blue-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Pengajuan & PO (Approval 3-Pintu)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  requestWorkflowSubTab === "PROPOSAL" ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {requests.filter(r => ["PENDING_AUDIT", "PENDING_FINANCE", "PENDING_DIRECTOR", "APPROVED_READY_PAY"].includes(r.status)).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestWorkflowSubTab("DISBURSEMENT")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  requestWorkflowSubTab === "DISBURSEMENT" 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>2. Pencairan Kas (Finance Gate)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  requestWorkflowSubTab === "DISBURSEMENT" ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {requests.filter(r => r.status === "APPROVED_READY_PAY" || r.disbursement).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestWorkflowSubTab("REALIZATION")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  requestWorkflowSubTab === "REALIZATION" 
                    ? "bg-purple-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>3. Laporan Realisasi & LPJ</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  requestWorkflowSubTab === "REALIZATION" ? "bg-purple-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {requests.filter(r => r.requestType === "CASH_ADVANCE" && r.disbursement).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRequestWorkflowSubTab("GOODS_RECEIPT")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  requestWorkflowSubTab === "GOODS_RECEIPT" 
                    ? "bg-amber-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>4. Penerimaan Barang Fisik (Audit BAST)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  requestWorkflowSubTab === "GOODS_RECEIPT" ? "bg-amber-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {requests.filter(r => r.requestType === "PURCHASE_REQUISITION").length}
                </span>
              </button>
            </div>

            {/* KONTEN TAHAP 1: PENGAJUAN & PO (APPROVAL 3 PINTU) */}
            {requestWorkflowSubTab === "PROPOSAL" && (
              <div className="space-y-4">
                {/* Stats Alert Box */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Menunggu Audit</span>
                    <strong className="text-base text-amber-700 font-extrabold">
                      {requests.filter(r => r.status === "PENDING_AUDIT").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Uji kepatuhan SOP & pagu</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Menunggu Finance</span>
                    <strong className="text-base text-blue-700 font-extrabold">
                      {requests.filter(r => r.status === "PENDING_FINANCE").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Cek saldo kas & bank</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Menunggu Direktur</span>
                    <strong className="text-base text-indigo-700 font-extrabold">
                      {requests.filter(r => r.status === "PENDING_DIRECTOR").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Otorisasi final direksi</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 bg-emerald-50/50">
                    <span className="text-emerald-800 block">Siap Dicairkan (Approved)</span>
                    <strong className="text-base text-emerald-800 font-extrabold">
                      {requests.filter(r => r.status === "APPROVED_READY_PAY").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Siap bayar di Tab 2</span>
                  </div>
                </div>

                {/* Tabel Pengajuan */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Daftar Pengajuan Anggaran & Pesanan Pembelian (PO)</span>
                    <span className="text-slate-400 font-mono text-[11px]">Memerlukan Approval 3-Pintu: Audit &rarr; Finance &rarr; Direktur</span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">No. Dokumen</th>
                        <th className="px-4 py-3">Judul & Peruntukan</th>
                        <th className="px-4 py-3">Site / Divisi</th>
                        <th className="px-4 py-3">Pemohon</th>
                        <th className="px-4 py-3">Nominal Diajukan</th>
                        <th className="px-4 py-3 text-center">Status Approval 3-Pintu</th>
                        <th className="px-4 py-3 text-right">Aksi & Cetak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {requests
                        .filter(r => selectedUnit === "ALL" || r.unit === selectedUnit)
                        .map((req) => {
                          const isAuditPassed = !["PENDING_AUDIT", "DRAFT"].includes(req.status);
                          const isFinancePassed = !["PENDING_AUDIT", "PENDING_FINANCE", "DRAFT"].includes(req.status);
                          const isDirectorPassed = ["APPROVED_READY_PAY", "DISBURSED", "COMPLETED"].includes(req.status);

                          return (
                            <tr key={req.id} className="hover:bg-slate-50/70 transition">
                              <td className="px-4 py-3 font-mono">
                                <span className="font-bold text-slate-900 block">{req.requestNumber}</span>
                                <span className="text-[10px] text-slate-400 block">{req.createdAt}</span>
                              </td>
                              <td className="px-4 py-3 max-w-[260px]">
                                <div className="font-bold text-slate-900 truncate">{req.title}</div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">{req.purpose}</div>
                                <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  req.category === "Perlengkapan & Peralatan" || req.requestType === "PURCHASE_REQUISITION" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : req.category === "Kasbon" || req.requestType === "CASH_ADVANCE"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-teal-100 text-teal-800"
                                }`}>
                                  {req.category || (req.requestType === "CASH_ADVANCE" ? "Kas Bon Operasional" : "Pengadaan PO Barang")}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  req.unit === "ME_CORE" 
                                    ? "bg-blue-100 text-blue-700" 
                                    : req.unit === "STARLITE_FTTH" 
                                    ? "bg-fuchsia-100 text-fuchsia-700" 
                                    : String(req.unit).startsWith("HO")
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {req.unit === "ME_CORE" ? "ME Core" : req.unit === "STARLITE_FTTH" ? "Starlite FTTH" : req.unit}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-900">{req.requesterName}</div>
                                <div className="text-[10px] text-slate-400">{req.requesterRole}</div>
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900 text-xs font-mono">
                                {formatRupiah(req.totalAmount)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {/* 3 Pintu Stepper Badges */}
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Step 1: Audit */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isAuditPassed 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : req.status === "PENDING_AUDIT"
                                      ? "bg-amber-100 text-amber-800 animate-pulse border border-amber-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isAuditPassed ? "✓ Audit" : "Audit"}
                                  </span>
                                  <span className="text-slate-300">&rarr;</span>
                                  {/* Step 2: Finance */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isFinancePassed 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : req.status === "PENDING_FINANCE"
                                      ? "bg-blue-100 text-blue-800 animate-pulse border border-blue-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isFinancePassed ? "✓ Finance" : "Finance"}
                                  </span>
                                  <span className="text-slate-300">&rarr;</span>
                                  {/* Step 3: Direktur */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isDirectorPassed 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : req.status === "PENDING_DIRECTOR"
                                      ? "bg-indigo-100 text-indigo-800 animate-pulse border border-indigo-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isDirectorPassed ? "✓ Direktur" : "Direktur"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Tombol Cetak Form Pengajuan */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintModal(req, "REQUEST")}
                                    className="flex items-center gap-1 px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                    title="Cetak Formulir Pengajuan Resmi A4"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Cetak Form</span>
                                  </button>

                                  {/* Action Approve Sesuai Tahapan */}
                                  {req.status === "PENDING_AUDIT" && (
                                    <button
                                      type="button"
                                      onClick={() => handleAuditApprove(req.id)}
                                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Audit
                                    </button>
                                  )}
                                  {req.status === "PENDING_FINANCE" && (
                                    <button
                                      type="button"
                                      onClick={() => handleFinanceApprove(req.id)}
                                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Finance
                                    </button>
                                  )}
                                  {req.status === "PENDING_DIRECTOR" && (
                                    <button
                                      type="button"
                                      onClick={() => handleDirectorApprove(req.id)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Direktur
                                    </button>
                                  )}
                                  {req.status === "APPROVED_READY_PAY" && (
                                    <button
                                      type="button"
                                      onClick={() => setRequestWorkflowSubTab("DISBURSEMENT")}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      Siap Cair &rarr;
                                    </button>
                                  )}
                                  {["DISBURSED", "COMPLETED"].includes(req.status) && (
                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      Sudah Cair
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KONTEN TAHAP 2: PENCAIRAN KAS (FINANCE GATE) */}
            {requestWorkflowSubTab === "DISBURSEMENT" && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-xs text-emerald-900">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-700" />
                      Pencairan Dana Kas & Bank oleh Tim Finance
                    </h3>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Pengajuan yang telah mendapat otorisasi Direktur Utama siap diproses pembayarannya (Transfer Bank / Kas Kecil) dan dicetak Form Bukti Pencairannya.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Total Siap Dicairkan:</span>
                    <strong className="text-sm font-extrabold text-emerald-950">
                      {formatRupiah(
                        requests.filter(r => r.status === "APPROVED_READY_PAY").reduce((acc, r) => acc + r.totalAmount, 0)
                      )}
                    </strong>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">No. Pengajuan</th>
                        <th className="px-4 py-3">Keperluan Dana</th>
                        <th className="px-4 py-3">Divisi & Penerima</th>
                        <th className="px-4 py-3">Nominal Pencairan</th>
                        <th className="px-4 py-3">Status Pencairan</th>
                        <th className="px-4 py-3">Info Voucher Kas</th>
                        <th className="px-4 py-3 text-right">Aksi Finance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {requests
                        .filter(r => r.status === "APPROVED_READY_PAY" || r.disbursement)
                        .map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">{req.requestNumber}</td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">{req.title}</div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Tipe: {req.requestType === "CASH_ADVANCE" ? "Kas Bon Lapangan" : "Pengadaan PO"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800">{req.requesterName}</div>
                              <div className="text-[10px] text-slate-500">{req.unit}</div>
                            </td>
                            <td className="px-4 py-3 font-bold text-emerald-700 font-mono text-xs">
                              {formatRupiah(req.totalAmount)}
                            </td>
                            <td className="px-4 py-3">
                              {req.disbursement ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" /> Telah Dicairkan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                                  <Clock className="w-3 h-3" /> Siap Dicairkan
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-[11px]">
                              {req.disbursement ? (
                                <div>
                                  <span className="font-mono font-bold text-slate-900 block">{req.disbursement.voucherNumber}</span>
                                  <span className="text-[10px] text-slate-500 block">{req.disbursement.sourceAccount}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Menunggu eksekusi kasir</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {req.disbursement ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintModal(req, "DISBURSEMENT")}
                                    className="flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Cetak Form Pencairan</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDisbursePayment(req.id)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                                  >
                                    Proses Bayar / Cairkan
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KONTEN TAHAP 3: LAPORAN REALISASI & LPJ */}
            {requestWorkflowSubTab === "REALIZATION" && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex justify-between items-center text-xs text-purple-900">
                  <div>
                    <h3 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-purple-700" />
                      Laporan Pertanggungjawaban (LPJ) & Rekonsiliasi Kas Bon
                    </h3>
                    <p className="text-[11px] text-purple-800 mt-0.5">
                      Pencocokan nota fisik/struk transaksi lapangan terhadap uang muka kas bon. Memerlukan approval Audit &rarr; Finance &rarr; Direktur, dan dapat dicetak Form Realisasi LPJ.
                    </p>
                  </div>
                </div>

                {/* Grid Kas Bon Realisasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests
                    .filter(r => r.requestType === "CASH_ADVANCE" && r.disbursement)
                    .map((req) => {
                      const advance = req.realization?.initialAdvanceAmount || req.totalAmount;
                      const actual = req.realization?.totalRealizedAmount || (advance - 150000);
                      const diff = advance - actual;

                      return (
                        <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div>
                              <span className="font-mono font-bold text-xs text-slate-900">{req.requestNumber}</span>
                              <h4 className="text-xs font-bold text-slate-900">{req.title}</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              {req.realization ? req.realization.status : "Belum LPJ"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600">
                            Pemohon: <strong>{req.requesterName}</strong> &bull; Site / Divisi: <strong>{req.unit === "ME_CORE" ? "ME Core" : req.unit === "STARLITE_FTTH" ? "Starlite FTTH" : req.unit}</strong>
                          </div>

                          {/* Box Komparasi Saldo */}
                          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">Kasbon Awal</span>
                              <strong className="text-slate-900 font-mono text-xs">{formatRupiah(advance)}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">Total Realisasi</span>
                              <strong className="text-slate-900 font-mono text-xs">{formatRupiah(actual)}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase">
                                {diff >= 0 ? "Sisa Disetor" : "Klaim Kurang"}
                              </span>
                              <strong className={`font-mono text-xs ${diff >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                {formatRupiah(Math.abs(diff))}
                              </strong>
                            </div>
                          </div>

                          {/* Tombol Cetak & Aksi */}
                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-[11px] text-slate-400">
                              {req.realization ? `${req.realization.items?.length || 3} Nota Fisik Terlampir` : "Menunggu upload nota"}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenPrintModal(req, "REALIZATION")}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg font-bold text-xs transition cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Cetak Form Realisasi</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* KONTEN TAHAP 4: PENERIMAAN BARANG FISIK (TIM AUDIT BAST GUDANG) */}
            {requestWorkflowSubTab === "GOODS_RECEIPT" && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs text-amber-900">
                  <div>
                    <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-amber-700" />
                      Penerimaan Barang Fisik (Goods Receipt / BAST oleh Tim Audit)
                    </h3>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Pengecekan fisik material proyek (ME & Starlite FTTH) oleh Tim Audit Internal saat barang tiba dari vendor pemasok. Hasil inspeksi disahkan dalam Form Penerimaan Barang.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {requests
                    .filter(r => r.requestType === "PURCHASE_REQUISITION")
                    .map((req) => (
                      <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 text-xs">{req.requestNumber}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                req.goodsReceipt ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {req.goodsReceipt ? "BAST Terbit & Terverifikasi" : "Menunggu Pemeriksaan Fisik"}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mt-0.5">{req.title}</h4>
                            <span className="text-[11px] text-slate-500">
                              Pemasok: <strong>{req.goodsReceipt?.vendorName || req.vendorInfo?.vendorName || "PT. Schneider / Distributor"}</strong> &bull; Lokasi: {req.goodsReceipt?.inspectionLocation || "Gudang Utama Sentul"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {req.goodsReceipt ? (
                              <button
                                type="button"
                                onClick={() => handleOpenPrintModal(req, "GOODS_RECEIPT")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                              >
                                <Printer className="w-3.5 h-3.5 text-amber-700" />
                                <span>Cetak Form Penerimaan Barang (BAST)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAuditGoodsReceipt(req.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5" />
                                <span>Lakukan Audit Fisik & Terbitkan BAST</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Detail Checklist Fisik */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs text-left border border-slate-200">
                            <thead className="bg-slate-50 text-slate-600">
                              <tr>
                                <th className="px-3 py-2 border-b border-slate-200">Rincian Barang / Material</th>
                                <th className="px-3 py-2 border-b border-slate-200 text-center">Qty Dipesan</th>
                                <th className="px-3 py-2 border-b border-slate-200 text-center">Qty Fisik Tiba</th>
                                <th className="px-3 py-2 border-b border-slate-200 text-center">Kondisi Fisik</th>
                                <th className="px-3 py-2 border-b border-slate-200">Catatan Pengecekan Audit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(req.goodsReceipt?.items || (req.procurementItems || req.items).map((it: any) => ({
                                itemId: it.id,
                                itemName: it.itemName || it.description,
                                qtyOrdered: it.quantity,
                                qtyReceived: it.quantity,
                                unit: it.unit,
                                condition: "GOOD",
                                physicalAuditNotes: "Kondisi fisik segel lengkap sesuai PO."
                              }))).map((item: any, idx: number) => (
                                <tr key={item.itemId || idx} className="hover:bg-slate-50/50">
                                  <td className="px-3 py-2 font-medium text-slate-900">{item.itemName}</td>
                                  <td className="px-3 py-2 text-center">{item.qtyOrdered} {item.unit}</td>
                                  <td className="px-3 py-2 text-center font-bold text-blue-700">{item.qtyReceived} {item.unit}</td>
                                  <td className="px-3 py-2 text-center">
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                      {item.condition === "GOOD" ? "BAIK / LENGKAP" : item.condition}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-slate-600 text-[11px]">{item.physicalAuditNotes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: LPJ REALISASI (TERINTEGRASI DENGAN TAHAP 3 ALUR) */}
        {activeTab === "lpj" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Realisasi & Pertanggungjawaban (LPJ Kas Bon)</h2>
                <p className="text-xs text-slate-500">
                  Pencocokan nota fisik/struk transaksi lapangan terhadap dana kas bon yang telah dicairkan oleh kasir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("requests");
                  setRequestWorkflowSubTab("REALIZATION");
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Buka Tab Realisasi &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests
                .filter(r => r.requestType === "CASH_ADVANCE" && r.disbursement)
                .map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{req.requestNumber} ({req.title})</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-full">
                        {req.realization ? req.realization.status : "Belum LPJ"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <div>
                          <div className="font-semibold text-slate-800">Pemohon: {req.requesterName}</div>
                          <div className="text-[11px] text-slate-500">{req.purpose}</div>
                        </div>
                        <div className="font-bold text-blue-600 font-mono">{formatRupiah(req.totalAmount)}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenPrintModal(req, "REALIZATION")}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Form Realisasi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: PENDAPATAN, BILLING & PIUTANG USAHA (REVENUE & AR CYCLE LENGKAP) */}
        {activeTab === "starlite" && (
          <div className="space-y-4">
            
            {/* Header Tab & Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Alur Pendapatan & Piutang Usaha (Revenue & Accounts Receivable)
                </h2>
                <p className="text-xs text-slate-500">
                  Pengelolaan terintegrasi: Jasa ME Core (Termin Kontrak Proyek B2B) & Starlite FTTH (Langganan Internet & Pasang Baru).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <option value="ALL">Semua Unit Bisnis</option>
                  <option value="ME_CORE">Jasa ME Core (Termin Proyek)</option>
                  <option value="STARLITE_FTTH">Starlite FTTH (Internet & PSB)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Buat Faktur Tagihan (Invoice)</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block">Total Omset Tagihan</span>
                <strong className="text-base text-slate-900 font-extrabold font-mono block">
                  {formatRupiah(salesInvoices.reduce((acc, i) => acc + i.totalAmount, 0))}
                </strong>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{salesInvoices.length} Faktur Diterbitkan</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
                <span className="text-amber-800 block">Piutang Usaha (AR) Belum Lunas</span>
                <strong className="text-base text-amber-900 font-extrabold font-mono block">
                  {formatRupiah(
                    salesInvoices.filter(i => i.status !== "PAID_FULL").reduce((acc, i) => acc + i.totalAmount, 0)
                  )}
                </strong>
                <span className="text-[10px] text-amber-700 mt-0.5 block">
                  {salesInvoices.filter(i => i.status !== "PAID_FULL").length} Faktur Dalam Penagihan
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
                <span className="text-emerald-800 block">Kas Masuk Diterima (Lunas)</span>
                <strong className="text-base text-emerald-900 font-extrabold font-mono block">
                  {formatRupiah(
                    salesInvoices.filter(i => i.status === "PAID_FULL").reduce((acc, i) => acc + i.totalAmount, 0)
                  )}
                </strong>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">Kuitansi BKM Terbit</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs">
                <span className="text-rose-800 block">Piutang Lewat Tempo (Overdue)</span>
                <strong className="text-base text-rose-900 font-extrabold font-mono block">
                  {formatRupiah(
                    salesInvoices.filter(i => i.status === "OVERDUE").reduce((acc, i) => acc + i.totalAmount, 0)
                  )}
                </strong>
                <span className="text-[10px] text-rose-700 mt-0.5 block">Perlu Follow-up Intensif</span>
              </div>
            </div>

            {/* SUB-TAB NAVIGASI 3 TAHAP PENDAPATAN & AR */}
            <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-white p-2 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setRevenueSubTab("INVOICES")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  revenueSubTab === "INVOICES" 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Faktur Tagihan & Invoicing (Approval 3-Pintu)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  revenueSubTab === "INVOICES" ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {salesInvoices.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRevenueSubTab("AR_AGING")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  revenueSubTab === "AR_AGING" 
                    ? "bg-amber-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>2. Kartu Piutang & Aging AR (Monitoring)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  revenueSubTab === "AR_AGING" ? "bg-amber-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {salesInvoices.filter(i => i.status !== "PAID_FULL").length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRevenueSubTab("RECEIPTS")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  revenueSubTab === "RECEIPTS" 
                    ? "bg-blue-600 text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>3. Penerimaan Kas & Kuitansi (Pelunasan BKM)</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  revenueSubTab === "RECEIPTS" ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {officialReceipts.length}
                </span>
              </button>
            </div>

            {/* KONTEN SUB-TAB 1: FAKTUR TAGIHAN & INVOICING (APPROVAL 3 PINTU) */}
            {revenueSubTab === "INVOICES" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Daftar Faktur Penjualan (Sales Invoice B2B & B2C)</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Otorisasi Berjenjang: Audit Progres &rarr; Finance & Tax &rarr; Direktur Utama
                    </span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">No. Invoice & SPK</th>
                        <th className="px-4 py-3">Klien & Uraian Pekerjaan</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">DPP & Pajak</th>
                        <th className="px-4 py-3">Total Tagihan</th>
                        <th className="px-4 py-3 text-center">Status Approval 3-Pintu</th>
                        <th className="px-4 py-3 text-right">Aksi & Dokumen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {salesInvoices
                        .filter(i => selectedUnit === "ALL" || i.unit === selectedUnit)
                        .map((inv) => {
                          const isProgressAuditPassed = !["PENDING_AUDIT_PROGRESS"].includes(inv.status);
                          const isTaxPassed = !["PENDING_AUDIT_PROGRESS", "PENDING_FINANCE_TAX"].includes(inv.status);
                          const isDirectorSigned = ["APPROVED_ISSUED", "PAID_FULL", "OVERDUE"].includes(inv.status);

                          return (
                            <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                              <td className="px-4 py-3 font-mono">
                                <span className="font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                                <span className="text-[10px] text-slate-400 block">{inv.contractNumber}</span>
                                <span className="text-[10px] text-rose-600 block font-semibold">Tempo: {inv.dueDate}</span>
                              </td>
                              <td className="px-4 py-3 max-w-[260px]">
                                <div className="font-bold text-slate-900 truncate">{inv.clientName}</div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">{inv.title}</div>
                                {inv.progressPercent && (
                                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                                    Opname Fisik: {inv.progressPercent}%
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  inv.unit === "ME_CORE" ? "bg-blue-100 text-blue-700" : "bg-fuchsia-100 text-fuchsia-700"
                                }`}>
                                  {inv.unit === "ME_CORE" ? "ME Core" : "Starlite FTTH"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[11px]">
                                <div className="text-slate-600">DPP: {formatRupiah(inv.dppAmount)}</div>
                                <div className="text-emerald-700 font-semibold">+PPN 11%: {formatRupiah(inv.ppnAmount)}</div>
                                {inv.pph23Amount ? (
                                  <div className="text-slate-400">-PPh 23: {formatRupiah(inv.pph23Amount)}</div>
                                ) : null}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900 font-mono text-xs">
                                {formatRupiah(inv.totalAmount)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {/* Stepper 3 Pintu */}
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Pintu 1: Audit */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isProgressAuditPassed 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : inv.status === "PENDING_AUDIT_PROGRESS"
                                      ? "bg-amber-100 text-amber-800 animate-pulse border border-amber-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isProgressAuditPassed ? "✓ Audit" : "Audit"}
                                  </span>
                                  <span className="text-slate-300">&rarr;</span>
                                  {/* Pintu 2: Finance Tax */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isTaxPassed 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : inv.status === "PENDING_FINANCE_TAX"
                                      ? "bg-blue-100 text-blue-800 animate-pulse border border-blue-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isTaxPassed ? "✓ Pajak" : "Pajak"}
                                  </span>
                                  <span className="text-slate-300">&rarr;</span>
                                  {/* Pintu 3: Direktur */}
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    isDirectorSigned 
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                                      : inv.status === "PENDING_DIRECTOR"
                                      ? "bg-indigo-100 text-indigo-800 animate-pulse border border-indigo-300"
                                      : "bg-slate-100 text-slate-400"
                                  }`}>
                                    {isDirectorSigned ? "✓ Direktur" : "Direktur"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Cetak Faktur Penjualan */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintInvoice(inv, "SALES_INVOICE")}
                                    className="flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                    title="Cetak Faktur Penjualan Resmi A4"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Faktur</span>
                                  </button>

                                  {/* Cetak BAKP jika ME Proyek */}
                                  {inv.unit === "ME_CORE" && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPrintInvoice(inv, "PROGRESS_REPORT")}
                                      className="flex items-center gap-1 px-2 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Cetak Berita Acara Kemajuan Pekerjaan (BAKP)"
                                    >
                                      <span>BAKP</span>
                                    </button>
                                  )}

                                  {/* Approval Action Buttons */}
                                  {inv.status === "PENDING_AUDIT_PROGRESS" && (
                                    <button
                                      type="button"
                                      onClick={() => handleAuditProgressApprove(inv.id)}
                                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Audit
                                    </button>
                                  )}
                                  {inv.status === "PENDING_FINANCE_TAX" && (
                                    <button
                                      type="button"
                                      onClick={() => handleFinanceTaxApprove(inv.id)}
                                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Pajak
                                    </button>
                                  )}
                                  {inv.status === "PENDING_DIRECTOR" && (
                                    <button
                                      type="button"
                                      onClick={() => handleDirectorInvoiceApprove(inv.id)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Direktur
                                    </button>
                                  )}
                                  {inv.status === "APPROVED_ISSUED" && (
                                    <button
                                      type="button"
                                      onClick={() => handleSettleInvoicePayment(inv.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      Terima Bayar
                                    </button>
                                  )}
                                  {inv.status === "PAID_FULL" && (
                                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                                      Lunas
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KONTEN SUB-TAB 2: KARTU PIUTANG & AGING AR (MONITORING JATUH TEMPO) */}
            {revenueSubTab === "AR_AGING" && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs text-amber-900">
                  <div>
                    <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      Monitoring Umur Piutang Usaha (Aging Accounts Receivable)
                    </h3>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Pengawasan jatuh tempo pembayaran termin proyek dan iuran langganan FTTH untuk menjaga perputaran kas operasional.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current (0-30 Hari) */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-800">Lancar (0 - 30 Hari)</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Normal</span>
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 font-mono">
                      {formatRupiah(
                        salesInvoices
                          .filter(i => i.status === "APPROVED_ISSUED")
                          .reduce((acc, i) => acc + i.totalAmount, 0)
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">Jatuh tempo dalam waktu aman</span>
                  </div>

                  {/* Perhatian (31-60 Hari) */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-amber-100">
                      <span className="font-bold text-xs text-amber-900">Perhatian (31 - 60 Hari)</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Follow-up</span>
                    </div>
                    <div className="text-lg font-extrabold text-amber-800 font-mono">
                      {formatRupiah(0)}
                    </div>
                    <span className="text-[11px] text-amber-700 block">Belum ada piutang di rentang ini</span>
                  </div>

                  {/* Overdue (>60 Hari) */}
                  <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-rose-100">
                      <span className="font-bold text-xs text-rose-900">Lewat Tempo (&gt; 60 Hari / Overdue)</span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">Kritis</span>
                    </div>
                    <div className="text-lg font-extrabold text-rose-800 font-mono">
                      {formatRupiah(
                        salesInvoices
                          .filter(i => i.status === "OVERDUE")
                          .reduce((acc, i) => acc + i.totalAmount, 0)
                      )}
                    </div>
                    <span className="text-[11px] text-rose-700 block">Segera kirimkan surat tegangan resmi</span>
                  </div>
                </div>

                {/* Tabel Piutang Belum Lunas */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 text-xs font-bold text-slate-900">
                    Kartu Rincian Piutang Klien yang Belum Terbayar
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">No. Invoice & Klien</th>
                        <th className="px-4 py-3">No. Kontrak / SPK</th>
                        <th className="px-4 py-3">Tgl Jatuh Tempo</th>
                        <th className="px-4 py-3">Nominal Piutang</th>
                        <th className="px-4 py-3">Status Aging</th>
                        <th className="px-4 py-3 text-right">Tindakan Penagihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {salesInvoices
                        .filter(i => i.status !== "PAID_FULL")
                        .map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                              <strong className="text-slate-800 block text-[11px]">{inv.clientName}</strong>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px]">{inv.contractNumber}</td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-rose-700 block">{inv.dueDate}</span>
                              <span className="text-[10px] text-slate-400">Terbit: {inv.invoiceDate}</span>
                            </td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-900 text-xs">
                              {formatRupiah(inv.totalAmount)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.status === "OVERDUE" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {inv.status === "OVERDUE" ? "Lewat Jatuh Tempo" : "Dalam Batas Waktu"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSettleInvoicePayment(inv.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs cursor-pointer"
                                >
                                  Terima Bayar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPrintInvoice(inv, "SALES_INVOICE")}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-medium text-slate-700 cursor-pointer"
                                >
                                  Kirim Ulang
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KONTEN SUB-TAB 3: PENERIMAAN KAS & KUITANSI (PELUNASAN BKM) */}
            {revenueSubTab === "RECEIPTS" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center text-xs text-blue-900">
                  <div>
                    <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-blue-700" />
                      Kuitansi Resmi & Bukti Kas Masuk (Official Receipt / BKM)
                    </h3>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      Pencatatan tanda terima pembayaran sah yang telah masuk ke rekening bank perusahaan, ditandatangani Kasir dan Finance Manager.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">No. Kuitansi BKM</th>
                        <th className="px-4 py-3">Tgl Diterima</th>
                        <th className="px-4 py-3">Diterima Dari (Klien)</th>
                        <th className="px-4 py-3">Untuk Pembayaran</th>
                        <th className="px-4 py-3">Jumlah Uang</th>
                        <th className="px-4 py-3">Rekening Penampung</th>
                        <th className="px-4 py-3 text-right">Aksi Cetak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {officialReceipts.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{rec.receiptNumber}</td>
                          <td className="px-4 py-3 text-slate-600">{rec.receivedDate}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{rec.clientName}</td>
                          <td className="px-4 py-3 max-w-[240px] text-slate-600 truncate">{rec.forPaymentOf}</td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-700 text-xs">
                            {formatRupiah(rec.amountReceived)}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-500 font-mono">{rec.bankTarget}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenPrintReceipt(rec)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold text-xs transition cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak Kuitansi</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 5: REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base">Laporan Keuangan & Laba Rugi Komprehensif</h2>
              <p className="text-xs text-slate-500">
                Penyajian performa finansial per unit usaha (Jasa Mekanik & Elektronik vs Starlite FTTH).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Laba Rugi Proyek ME */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Unit Jasa Mekanik & Elektronik</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Periode 2026 YTD</span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Pendapatan Termin Kontrak ME</span>
                    <span className="text-emerald-600 font-bold">Rp 380.000.000</span>
                  </div>
                  <div className="pl-3 space-y-1.5 text-slate-600 border-l-2 border-slate-100">
                    <div className="flex justify-between">
                      <span>Beban Material & Kabel</span>
                      <span>(Rp 145.000.000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beban Teknisi & Subkon Lapangan</span>
                      <span>(Rp 72.500.000)</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Laba Kotor Operasional ME</span>
                    <span className="text-blue-700">Rp 162.500.000</span>
                  </div>
                </div>
              </div>

              {/* Laba Rugi Starlite FTTH */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-fuchsia-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Unit Ekspansi Starlite FTTH</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Periode 2026 YTD</span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Pendapatan Langganan Internet & PSB</span>
                    <span className="text-emerald-600 font-bold">Rp 34.800.000</span>
                  </div>
                  <div className="pl-3 space-y-1.5 text-slate-600 border-l-2 border-slate-100">
                    <div className="flex justify-between">
                      <span>Beban Bandwidth Upstream</span>
                      <span>(Rp 8.500.000)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operasional Pemeliharaan Jaringan</span>
                      <span>(Rp 4.200.000)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Investasi Rollout OLT/ODP (Aset Capex)</span>
                      <span>Rp 285.000.000 (Aset Neraca)</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Laba Bersih Operasional Starlite</span>
                    <span className="text-fuchsia-700">Rp 22.100.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal 1: Buat Pengajuan Baru (Kas Bon / Pesanan Pembelian PO Accurate Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Form Pengajuan
                </h3>
                <p className="text-xs text-slate-500">
                  Pengajuan dana kas bon operasional, reimbursement, maupun pengadaan barang untuk Site &amp; Divisi HO.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              {/* Row 1: Unit & Jenis Dokumen */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site / Divisi</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <optgroup label="Site Operasional">
                      <option value="Rajeg & Pasar Kemis">Rajeg &amp; Pasar Kemis</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Tagogapu">Tagogapu</option>
                      <option value="Padalarang">Padalarang</option>
                      <option value="Gadobangkong">Gadobangkong</option>
                      <option value="Cicalengka">Cicalengka</option>
                      <option value="Cimahi">Cimahi</option>
                      <option value="Ciledug">Ciledug</option>
                      <option value="Songgom">Songgom</option>
                      <option value="Nganjuk">Nganjuk</option>
                      <option value="Kediri">Kediri</option>
                      <option value="Tulungagung">Tulungagung</option>
                      <option value="Rejotangan">Rejotangan</option>
                      <option value="Blitar">Blitar</option>
                    </optgroup>
                    <optgroup label="Head Office (HO)">
                      <option value="HO - Purchasing & Logistics">HO - Purchasing &amp; Logistics</option>
                      <option value="HO - Permit">HO - Permit</option>
                      <option value="HO - Survey and Design">HO - Survey and Design</option>
                      <option value="HO - Document Control">HO - Document Control</option>
                      <option value="HO - Sales">HO - Sales</option>
                      <option value="HO - HR-GA">HO - HR-GA</option>
                      <option value="HO - IT">HO - IT</option>
                      <option value="HO - Finance">HO - Finance</option>
                      <option value="HO - General Manager">HO - General Manager</option>
                      <option value="HO - Direktur">HO - Direktur</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Pengajuan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const val = e.target.value as ExpenseCategory;
                      setNewCategory(val);
                      if (val === "Perlengkapan & Peralatan") {
                        setNewType("PURCHASE_REQUISITION");
                      } else {
                        setNewType("CASH_ADVANCE");
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Pemohon & Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Pemohon (Requester)</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Misal: Rudi (Teknisi) / Agus (SPV)"
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pengajuan</label>
                  <input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Judul Dokumen */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen / Keperluan</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Biaya Operasional / Pengadaan Material / Kas Bon Lapangan"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* TABEL RINCIAN BARANG / ITEM — Accurate Style */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">Rincian Barang / Jasa</label>
                  <button
                    type="button"
                    onClick={addRequestItem}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 rounded-lg px-2 py-1 hover:bg-blue-50 transition cursor-pointer"
                  >
                    <span className="text-base leading-none">+</span> Tambah Baris
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="text-left px-2 py-2 font-semibold w-[32%]">Nama Barang / Jasa</th>
                        <th className="text-center px-2 py-2 font-semibold w-[9%]">Qty</th>
                        <th className="text-center px-2 py-2 font-semibold w-[12%]">Satuan</th>
                        <th className="text-right px-2 py-2 font-semibold w-[20%]">@Harga (Rp)</th>
                        <th className="text-center px-2 py-2 font-semibold w-[9%]">Diskon%</th>
                        <th className="text-right px-2 py-2 font-semibold w-[14%]">Total</th>
                        <th className="w-[4%]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {requestItems.map((item, idx) => {
                        const lineTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                        return (
                          <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="px-1.5 py-1">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateRequestItem(item.id, "description", e.target.value)}
                                placeholder="Nama barang/jasa..."
                                className="w-full border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-blue-400"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => updateRequestItem(item.id, "quantity", parseFloat(e.target.value) || 1)}
                                className="w-full border border-slate-200 rounded px-1 py-1 text-center focus:outline-none focus:border-blue-400"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <select
                                value={item.unit}
                                onChange={(e) => updateRequestItem(item.id, "unit", e.target.value)}
                                className="w-full border border-slate-200 rounded px-1 py-1 bg-white focus:outline-none focus:border-blue-400"
                              >
                                <option>Pcs</option>
                                <option>Unit</option>
                                <option>Paket</option>
                                <option>Meter</option>
                                <option>Roll</option>
                                <option>Box</option>
                                <option>Set</option>
                                <option>Liter</option>
                                <option>Kg</option>
                                <option>Jasa</option>
                              </select>
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                min={0}
                                value={item.unitPrice || ""}
                                onChange={(e) => updateRequestItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full border border-slate-200 rounded px-1 py-1 text-right font-mono focus:outline-none focus:border-blue-400"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={item.discount || ""}
                                onChange={(e) => updateRequestItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full border border-slate-200 rounded px-1 py-1 text-center focus:outline-none focus:border-blue-400"
                              />
                            </td>
                            <td className="px-1.5 py-1 text-right font-mono font-semibold text-slate-800">
                              {lineTotal > 0 ? lineTotal.toLocaleString("id-ID") : "-"}
                            </td>
                            <td className="px-1 py-1 text-center">
                              <button
                                type="button"
                                onClick={() => removeRequestItem(item.id)}
                                className="text-red-400 hover:text-red-600 transition cursor-pointer"
                                title="Hapus baris"
                              >✕</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Sub Total Row */}
                  <div className="flex justify-between items-center px-3 py-2 bg-blue-50 border-t border-blue-100">
                    <span className="text-slate-500 font-medium">Sub Total</span>
                    <span className="font-bold text-blue-700 font-mono text-sm">
                      Rp {requestItemsSubTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* KHUSUS PO: INFO VENDOR & PENGIRIMAN */}
              {newType === "PURCHASE_REQUISITION" && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Truck className="w-3.5 h-3.5" /> Info Pemasok &amp; Pengiriman
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-slate-600 mb-0.5">Nama Pemasok / Vendor *</label>
                      <input
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="Misal: PT. Fiber Solusindo"
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 mb-0.5">Syarat Pembayaran</label>
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                      >
                        <option value="COD">Cash On Delivery (COD)</option>
                        <option value="Net 14">Net 14 Hari</option>
                        <option value="Net 30">Net 30 Hari</option>
                        <option value="Tunai">Tunai / Transfer di Muka</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-slate-600 mb-0.5">Bank &amp; No. Rekening Tujuan</label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="Contoh: BCA 123-456-7890"
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 mb-0.5">Alamat Pengiriman Fisik</label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Gudang Sentul / Site Proyek"
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Keperluan Lengkap</label>
                <textarea
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Jelaskan kebutuhan pengeluaran atau detail barang yang dipesan..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Total Pengajuan: <span className="font-bold text-slate-800 font-mono">Rp {requestItemsSubTotal.toLocaleString("id-ID")}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer shadow-xs"
                  >
                    Kirim ke Tim Audit (Step 1)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Catat Pemasukan / Termin Baru */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Catat Pemasukan Kas / Termin Proyek</h3>
            <p className="text-xs text-slate-500 mb-4">
              Rekam penerimaan pembayaran termin kontrak proyek ME atau penerimaan tagihan internet Starlite.
            </p>

            <form onSubmit={handleCreateIncome} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Usaha Penerima</label>
                <select
                  value={incomeUnit}
                  onChange={(e) => setIncomeUnit(e.target.value as BusinessUnit)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="ME_CORE">Jasa ME Core (Termin Kontrak / SPK)</option>
                  <option value="STARLITE_FTTH">Starlite FTTH (Langganan Internet / PSB)</option>
                  <option value="OVERHEAD_OPERASIONAL">Overhead / Pendapatan Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Pemasukan</label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="Termin Kontrak Jasa ME">Termin Kontrak Jasa ME</option>
                  <option value="Pendapatan Langganan FTTH">Pendapatan Langganan FTTH</option>
                  <option value="Biaya Pasang Baru (PSB)">Biaya Pasang Baru (PSB)</option>
                  <option value="Jasa Maintenance Khusus">Jasa Maintenance Khusus</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Klien / Pembayar</label>
                <input
                  type="text"
                  value={incomePayer}
                  onChange={(e) => setIncomePayer(e.target.value)}
                  placeholder="Misal: PT. Astra Otoparts / Pelanggan Sentul"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Pemasukan</label>
                <input
                  type="text"
                  value={incomeTitle}
                  onChange={(e) => setIncomeTitle(e.target.value)}
                  placeholder="Misal: Pembayaran Termin 1 Proyek Instalasi Listrik"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal Penerimaan (Rp)</label>
                <input
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="Contoh: 50000000"
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRATINJAU CETAK DOKUMEN RESMI A4 (ISO-FIN-2026 STANDAR PERUSAHAAN) */}
      {(selectedPrintRequest || selectedPrintInvoice || selectedPrintReceipt) && (
        <PrintableDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          request={selectedPrintRequest || undefined}
          invoice={selectedPrintInvoice || undefined}
          receipt={selectedPrintReceipt || undefined}
          docType={printDocType}
        />
      )}

      {/* MODAL 4: BUAT FAKTUR TAGIHAN / SALES INVOICE BARU (B2B & B2C) */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Buat Faktur Penjualan Resmi (Sales Invoice)
                </h3>
                <p className="text-xs text-slate-500">
                  Tagihan resmi B2B Termin Proyek ME atau Tagihan Pelanggan Starlite FTTH lengkap dengan pajak PPN 11% & PPh 23.
                </p>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSalesInvoice} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Usaha Penghasil</label>
                  <select
                    value={newInvUnit}
                    onChange={(e) => setNewInvUnit(e.target.value as BusinessUnit)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="ME_CORE">Jasa ME Core (Termin Kontrak Proyek)</option>
                    <option value="STARLITE_FTTH">Starlite FTTH (Langganan Internet & PSB)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Kontrak / SPK / ID Pelanggan</label>
                  <input
                    type="text"
                    value={newInvContract}
                    onChange={(e) => setNewInvContract(e.target.value)}
                    placeholder="Misal: SPK-2026-ME-02 / STL-004"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Klien / Perusahaan Pembayar</label>
                  <input
                    type="text"
                    value={newInvClient}
                    onChange={(e) => setNewInvClient(e.target.value)}
                    placeholder="Contoh: PT. Astra Otoparts Tbk"
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPWP Klien (Opsional)</label>
                  <input
                    type="text"
                    value={newInvNPWP}
                    onChange={(e) => setNewInvNPWP(e.target.value)}
                    placeholder="Contoh: 01.342.891.4-054.000"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Klien / Lokasi Proyek</label>
                <input
                  type="text"
                  value={newInvAddress}
                  onChange={(e) => setNewInvAddress(e.target.value)}
                  placeholder="Misal: Kawasan Industri KIIC Karawang Barat Lot B-02"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul / Uraian Termin Tagihan</label>
                <input
                  type="text"
                  value={newInvTitle}
                  onChange={(e) => setNewInvTitle(e.target.value)}
                  placeholder="Contoh: Termin I (30%) - Pekerjaan Instalasi Panel Listrik & Kabel Feeder"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai DPP / Pokok (Rp)</label>
                  <input
                    type="number"
                    value={newInvDpp}
                    onChange={(e) => setNewInvDpp(e.target.value)}
                    placeholder="Contoh: 50000000"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Progres Fisik (%)</label>
                  <input
                    type="number"
                    value={newInvProgress}
                    onChange={(e) => setNewInvProgress(e.target.value)}
                    placeholder="30"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tgl Jatuh Tempo</label>
                  <input
                    type="date"
                    value={newInvDueDate}
                    onChange={(e) => setNewInvDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              {/* Kalkulasi Pajak Otomatis */}
              {newInvDpp && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>DPP (Dasar Pengenaan Pajak):</span>
                    <strong className="font-mono">{formatRupiah(parseFloat(newInvDpp) || 0)}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>+ PPN 11% (Pajak Pertambahan Nilai):</span>
                    <strong className="font-mono">{formatRupiah((parseFloat(newInvDpp) || 0) * 0.11)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInvIncludePph23}
                        onChange={(e) => setNewInvIncludePph23(e.target.checked)}
                        className="rounded"
                      />
                      <span>Potong PPh 23 (2% Jasa Teknik)</span>
                    </label>
                    <span className="font-mono text-slate-500">
                      -{formatRupiah(newInvIncludePph23 ? (parseFloat(newInvDpp) || 0) * 0.02 : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-blue-900 pt-1.5 border-t border-slate-300">
                    <span>Total Tagihan Bersih:</span>
                    <span className="font-mono font-black text-base">
                      {formatRupiah(
                        (parseFloat(newInvDpp) || 0) * 1.11 - (newInvIncludePph23 ? (parseFloat(newInvDpp) || 0) * 0.02 : 0)
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition cursor-pointer shadow-xs"
                >
                  Kirim ke Tim Audit Progres (Step 1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
