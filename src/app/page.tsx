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
  Activity
} from "lucide-react";
import { 
  COMPANY_NAME, 
  BUSINESS_UNITS, 
  INITIAL_COST_CENTERS, 
  INITIAL_REQUESTS, 
  INITIAL_SUBSCRIBERS, 
  INITIAL_INVOICES,
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
import { BusinessUnit, BudgetRequest, RequestType, UserRole, FinancialTransaction } from "@/types";

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

  // Accurate Widgets State (Synchronized per month with active filter)
  const [activeTrendMonth, setActiveTrendMonth] = useState<number | null>(null);
  const [activeCashMonth, setActiveCashMonth] = useState<number | null>(null);
  const [widgetRefreshAnim, setWidgetRefreshAnim] = useState<boolean>(false);
  const handleRefreshWidgets = () => {
    setWidgetRefreshAnim(true);
    setTimeout(() => setWidgetRefreshAnim(false), 600);
  };

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  
  // New request form state
  const [newTitle, setNewTitle] = useState("");
  const [newUnit, setNewUnit] = useState<BusinessUnit>("STARLITE_FTTH");
  const [newType, setNewType] = useState<RequestType>("CASH_ADVANCE");
  const [newAmount, setNewAmount] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [requesterName, setRequesterName] = useState("Tim Lapangan");

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

  // Synchronized Monthly Series for Selected Year (12 Bulan Jan - Des)
  const yearlySeries = useMemo(() => {
    return HISTORICAL_FINANCIAL_DATA.filter((d) => d.year === selectedYear);
  }, [selectedYear]);

  const maxIncome = useMemo(() => Math.max(...yearlySeries.map(m => m.income), 1), [yearlySeries]);
  const minIncome = useMemo(() => Math.min(...yearlySeries.map(m => m.income), 0), [yearlySeries]);

  const maxNet = useMemo(() => Math.max(...yearlySeries.map(m => m.income - m.expense), 1), [yearlySeries]);
  const minNet = useMemo(() => Math.min(...yearlySeries.map(m => m.income - m.expense), 0), [yearlySeries]);

  const trendPoints = useMemo(() => {
    return yearlySeries.map((item, i) => {
      const cx = 14 + i * 27.27;
      const cy = 68 - Math.round(((item.income - minIncome) / (maxIncome - minIncome || 1)) * 48);
      return { ...item, cx, cy };
    });
  }, [yearlySeries, minIncome, maxIncome]);

  const cashPoints = useMemo(() => {
    return yearlySeries.map((item, i) => {
      const cx = 14 + i * 27.27;
      const net = item.income - item.expense;
      const cy = 68 - Math.round(((net - minNet) / (maxNet - minNet || 1)) * 48);
      return { ...item, net, cx, cy };
    });
  }, [yearlySeries, minNet, maxNet]);

  // Active display items for widgets
  const displayTrendMonth = activeTrendMonth || selectedMonth;
  const currentTrendItem = yearlySeries.find(m => m.monthNum === displayTrendMonth) || yearlySeries[0];

  const displayCashMonth = activeCashMonth || selectedMonth;
  const currentCashItem = yearlySeries.find(m => m.monthNum === displayCashMonth) || yearlySeries[0];
  const currentCashNet = currentCashItem ? currentCashItem.income - currentCashItem.expense : 0;

  // Division Budgets for the selected year
  const divisionBudgets = useMemo(() => {
    const list = (DIVISION_BUDGET_YEARS as any)[selectedYear] || DIVISION_BUDGET_YEARS[2026];
    return list;
  }, [selectedYear]);

  // Pending Approvals Handler
  const handleApprove = (id: string, docNumber: string) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    setApprovalNotification(`Dokumen ${docNumber} berhasil disetujui & diproses.`);
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const parsedAmount = parseFloat(newAmount);
    const newDocNum = `${newType === "CASH_ADVANCE" ? "CA" : "PR"}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newReq: BudgetRequest = {
      id: `req-${Date.now()}`,
      requestNumber: newDocNum,
      title: newTitle,
      unit: newUnit,
      costCenterId: newUnit === "STARLITE_FTTH" ? "cc-star-01" : "cc-me-01",
      requesterName: requesterName,
      requesterRole: newType === "CASH_ADVANCE" ? "FIELD_TECH" : "SITE_SPV",
      requestType: newType,
      totalAmount: parsedAmount,
      status: "PENDING_SPV",
      purpose: newPurpose,
      createdAt: new Date().toISOString().split("T")[0],
      items: [
        {
          id: `item-${Date.now()}`,
          description: newTitle,
          quantity: 1,
          unit: "Paket",
          estimatedPrice: parsedAmount,
          totalPrice: parsedAmount,
        }
      ]
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
      level: "SPV / Kasir",
      urgent: parsedAmount > 10000000,
    };
    setPendingApprovals([newApproval, ...pendingApprovals]);

    setIsModalOpen(false);
    setNewTitle("");
    setNewAmount("");
    setNewPurpose("");
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
                ? "border-fuchsia-600 text-fuchsia-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wifi className="w-4 h-4 text-fuchsia-600" />
            Starlite FTTH (Billing & AR)
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-fuchsia-100 text-fuchsia-800 font-bold">
              {totalSubscribers} Klien
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

                {/* Widget 3: Tren Penjualan (Per Bulan - Sinkron Filter) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Tren Penjualan</h3>
                      <span className="text-[10px] text-slate-400 font-mono">(Per Bulan &bull; Thn {selectedYear})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* SVG Line Chart for Tren Penjualan (12 Bulan) */}
                  <div className="py-2">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-500">
                        Bulan: <strong className="text-blue-700">{MONTH_NAMES[displayTrendMonth - 1]?.name} {selectedYear}</strong>
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatRupiah(currentTrendItem?.income || 0)}
                      </span>
                    </div>
                    <div className="h-28 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 330 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesMonthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <polygon
                          fill="url(#salesMonthGrad)"
                          points={`14,78 ${trendPoints.map(p => `${p.cx},${p.cy}`).join(" ")} 314,78`}
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
                          points={trendPoints.map(p => `${p.cx},${p.cy}`).join(" ")}
                        />
                        {/* Data Points */}
                        {trendPoints.map((pt) => {
                          const isActive = displayTrendMonth === pt.monthNum;
                          return (
                            <circle
                              key={pt.month}
                              cx={pt.cx}
                              cy={pt.cy}
                              r={isActive ? "5.5" : "3.5"}
                              className="cursor-pointer transition-all"
                              fill={isActive ? "#1d4ed8" : "#3b82f6"}
                              stroke="#ffffff"
                              strokeWidth={isActive ? "2.5" : "1.5"}
                              onMouseEnter={() => setActiveTrendMonth(pt.monthNum)}
                              onClick={() => setSelectedMonth(pt.monthNum)}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* 12 Month Labels (Clickable to sync filter!) */}
                    <div className="flex justify-between text-[9px] text-slate-500 font-medium px-0.5 mt-1.5">
                      {yearlySeries.map(item => (
                        <button
                          key={item.month}
                          type="button"
                          onClick={() => setSelectedMonth(item.monthNum)}
                          onMouseEnter={() => setActiveTrendMonth(item.monthNum)}
                          onMouseLeave={() => setActiveTrendMonth(null)}
                          className={`px-1 py-0.5 rounded-xs transition ${
                            displayTrendMonth === item.monthNum 
                              ? "font-bold text-blue-700 bg-blue-100/70" 
                              : "hover:text-slate-900"
                          }`}
                        >
                          {item.month}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Min: {formatRupiah(minIncome)}</span>
                    <span className="text-emerald-600 font-semibold">Maks: {formatRupiah(maxIncome)}</span>
                  </div>
                </div>
              </div>

              {/* ROW 2: Laba/Rugi Tahun ini, Beban Perusahaan, Arus Kas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Widget 4: Laba/Rugi Tahun ini */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                      <h3 className="text-xs font-bold text-slate-900">Laba/Rugi Tahun ini</h3>
                      <div className="flex items-center gap-1 text-slate-400">
                        <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <div className="py-1 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
                      <span className="cursor-pointer hover:text-slate-800">&lt;</span>
                      <span>{ANNUAL_PROFIT_LOSS_ACCURATE.periodLabel}</span>
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
                            strokeDashoffset={97.4 - (97.4 * ANNUAL_PROFIT_LOSS_ACCURATE.profitMarginPercent) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xs font-black text-slate-900">{ANNUAL_PROFIT_LOSS_ACCURATE.profitMarginPercent}%</span>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold">Margin</span>
                        </div>
                      </div>

                      {/* Legend Items */}
                      <div className="flex-1 space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Pendapatan
                          </span>
                          <span className="font-bold text-slate-900">{formatRupiah(ANNUAL_PROFIT_LOSS_ACCURATE.pendapatan)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Nilai HPP
                          </span>
                          <span className="font-semibold text-slate-700">{formatRupiah(ANNUAL_PROFIT_LOSS_ACCURATE.hpp)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Pengeluaran
                          </span>
                          <span className="font-semibold text-slate-700">{formatRupiah(ANNUAL_PROFIT_LOSS_ACCURATE.pengeluaran)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">
                      Dibanding 1 Jan - 18 Nov 2025: <strong className="text-slate-600">{formatRupiah(ANNUAL_PROFIT_LOSS_ACCURATE.bandingTahunLalu)}</strong>
                    </span>
                    <span className="font-bold text-emerald-600 text-xs">
                      Laba: {formatRupiah(ANNUAL_PROFIT_LOSS_ACCURATE.labaBersih)}
                    </span>
                  </div>
                </div>

                {/* Widget 5: Beban Perusahaan */}
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
                      <span>{COMPANY_EXPENSE_ACCURATE.periodLabel}</span>
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
                            strokeDashoffset="56"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xs font-black text-slate-900">42%</span>
                          <span className="block text-[8px] text-slate-400 uppercase font-bold">ME Mat</span>
                        </div>
                      </div>

                      {/* Beban Total & Breakdown */}
                      <div className="flex-1 space-y-1 text-[11px]">
                        <div className="text-xs font-bold text-slate-900 mb-1">
                          Beban: {formatRupiah(COMPANY_EXPENSE_ACCURATE.totalBeban)}
                        </div>
                        {COMPANY_EXPENSE_ACCURATE.breakdown.map((b) => (
                          <div key={b.name} className="flex justify-between items-center text-[10px] text-slate-600">
                            <span className="truncate max-w-[110px]">{b.name}</span>
                            <span className="font-semibold text-slate-800">{b.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">
                      Dibanding 1 Okt - 31 Okt 2026: <strong className="text-slate-600">{formatRupiah(COMPANY_EXPENSE_ACCURATE.bandingBulanLalu)}</strong>
                    </span>
                    <span className="text-emerald-600 font-semibold">-{COMPANY_EXPENSE_ACCURATE.efisiensiPercent}% Efisien</span>
                  </div>
                </div>

                {/* Widget 6: Arus Kas (Per Bulan - Sinkron Filter) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Arus Kas</h3>
                      <span className="text-[10px] text-slate-400 font-mono">(Per Bulan &bull; Thn {selectedYear})</span>
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
                        Bulan: <strong className="text-sky-700">{MONTH_NAMES[displayCashMonth - 1]?.name} {selectedYear}</strong>
                      </span>
                      <span className={`font-bold ${currentCashNet >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        Net: {formatRupiah(currentCashNet)}
                      </span>
                    </div>

                    <div className="h-28 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 330 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cashMonthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <polygon
                          fill="url(#cashMonthGrad)"
                          points={`14,78 ${cashPoints.map(p => `${p.cx},${p.cy}`).join(" ")} 314,78`}
                        />
                        <line x1="0" y1="78" x2="330" y2="78" stroke="#cbd5e1" strokeWidth="1" />
                        <polyline
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={cashPoints.map(p => `${p.cx},${p.cy}`).join(" ")}
                        />
                        {cashPoints.map((pt) => {
                          const isActive = displayCashMonth === pt.monthNum;
                          return (
                            <circle
                              key={pt.month}
                              cx={pt.cx}
                              cy={pt.cy}
                              r={isActive ? "5.5" : "3.5"}
                              className="cursor-pointer transition-all"
                              fill={isActive ? "#0369a1" : "#0284c7"}
                              stroke="#ffffff"
                              strokeWidth={isActive ? "2.5" : "1.5"}
                              onMouseEnter={() => setActiveCashMonth(pt.monthNum)}
                              onClick={() => setSelectedMonth(pt.monthNum)}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* 12 Month Labels (Clickable to sync filter!) */}
                    <div className="flex justify-between text-[9px] text-slate-500 font-medium px-0.5 mt-1.5">
                      {yearlySeries.map(item => (
                        <button
                          key={item.month}
                          type="button"
                          onClick={() => setSelectedMonth(item.monthNum)}
                          onMouseEnter={() => setActiveCashMonth(item.monthNum)}
                          onMouseLeave={() => setActiveCashMonth(null)}
                          className={`px-1 py-0.5 rounded-xs transition ${
                            displayCashMonth === item.monthNum 
                              ? "font-bold text-sky-700 bg-sky-100/70" 
                              : "hover:text-slate-900"
                          }`}
                        >
                          {item.month}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Min Net: {formatRupiah(minNet)}</span>
                    <span className="text-sky-700 font-semibold">Maks Net: {formatRupiah(maxNet)}</span>
                  </div>
                </div>
              </div>

              {/* ROW 3: Penjualan & Pembelian (Status Faktur) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Widget 7: Penjualan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Penjualan</h3>
                      <span className="text-[10px] text-slate-400 font-mono">&lt; {SALES_SUMMARY_ACCURATE.periodLabel} &gt;</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Pendapatan</span>
                      <div className="text-base font-extrabold text-slate-900">{formatRupiah(SALES_SUMMARY_ACCURATE.pendapatan)}</div>
                      <span className="text-[10px] text-slate-400">Hari ini: {formatRupiah(SALES_SUMMARY_ACCURATE.hariIni)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Belum Lunas (Piutang AR)</span>
                      <div className="text-base font-extrabold text-amber-600">{formatRupiah(SALES_SUMMARY_ACCURATE.belumLunas)}</div>
                      <span className="text-[10px] text-slate-400">Kolektibilitas: 77.2%</span>
                    </div>
                  </div>

                  {/* 4 Box Breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 font-semibold block">Faktur Lunas</span>
                      <span className="font-bold text-emerald-700 text-[11px]">{formatRupiah(SALES_SUMMARY_ACCURATE.fakturLunas)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-600 font-semibold block">Belum Lunas</span>
                      <span className="font-bold text-slate-800 text-[11px]">{formatRupiah(SALES_SUMMARY_ACCURATE.belumLunas)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-amber-800 font-semibold block">Belum Jth Tempo</span>
                      <span className="font-bold text-amber-700 text-[11px]">{formatRupiah(SALES_SUMMARY_ACCURATE.belumJatuhTempo)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                      <span className="text-[10px] text-rose-800 font-semibold block">Lewat Tempo</span>
                      <span className="font-bold text-rose-700 text-[11px]">{formatRupiah(SALES_SUMMARY_ACCURATE.lewatJatuhTempo)}</span>
                    </div>
                  </div>
                </div>

                {/* Widget 8: Pembelian */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Pembelian</h3>
                      <span className="text-[10px] text-slate-400 font-mono">&lt; {PURCHASE_SUMMARY_ACCURATE.periodLabel} &gt;</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button onClick={handleRefreshWidgets} className="hover:text-slate-600 p-0.5"><RotateCw className="w-3.5 h-3.5" /></button>
                      <button className="hover:text-slate-600 p-0.5"><MoreVertical className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Pembelian</span>
                      <div className="text-base font-extrabold text-slate-900">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.pembelian)}</div>
                      <span className="text-[10px] text-slate-400">Hari ini: {formatRupiah(PURCHASE_SUMMARY_ACCURATE.hariIni)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Belum Lunas (Hutang AP)</span>
                      <div className="text-base font-extrabold text-slate-700">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.belumLunas)}</div>
                      <span className="text-[10px] text-slate-400">PO Aktif: 4 Dokumen</span>
                    </div>
                  </div>

                  {/* 4 Box Breakdown */}
                  <div className="grid grid-cols-4 gap-2 pt-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <span className="text-[10px] text-emerald-800 font-semibold block">Faktur Lunas</span>
                      <span className="font-bold text-emerald-700 text-[11px]">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.fakturLunas)}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-600 font-semibold block">Belum Lunas</span>
                      <span className="font-bold text-slate-800 text-[11px]">{formatRupiah(PURCHASE_SUMMARY_ACCURATE.belumLunas)}</span>
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

        {/* TAB 2: REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Pengajuan Anggaran & Kas Bon Lapangan</h2>
                <p className="text-xs text-slate-500">
                  Daftar pengajuan operasional teknisi dan pengadaan material yang membutuhkan persetujuan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <option value="ALL">Semua Divisi / Unit</option>
                  <option value="ME_CORE">Jasa ME Core</option>
                  <option value="STARLITE_FTTH">Starlite FTTH</option>
                </select>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Buat Pengajuan</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">No. Pengajuan</th>
                    <th className="px-4 py-3">Judul Pengajuan</th>
                    <th className="px-4 py-3">Unit / Proyek</th>
                    <th className="px-4 py-3">Pemohon</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {requests
                    .filter(r => selectedUnit === "ALL" || r.unit === selectedUnit)
                    .map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{req.requestNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{req.title}</div>
                          <div className="text-[11px] text-slate-400">{req.purpose}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.unit === "ME_CORE" ? "bg-blue-100 text-blue-700" : "bg-fuchsia-100 text-fuchsia-700"
                          }`}>
                            {req.unit === "ME_CORE" ? "ME Core" : "Starlite FTTH"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{req.requesterName}</div>
                          <div className="text-[10px] text-slate-400">{req.requesterRole}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{formatRupiah(req.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            req.status === "DISBURSED" 
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status.startsWith("PENDING")
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}>
                            {req.status === "DISBURSED" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                            Detail &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LPJ REALISASI */}
        {activeTab === "lpj" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base">Realisasi & Pertanggungjawaban (LPJ Kas Bon)</h2>
              <p className="text-xs text-slate-500">
                Pencocokan nota fisik/struk transaksi lapangan terhadap dana kas bon yang telah dicairkan oleh kasir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Kas Bon Belum LPJ</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full">
                    Perlu Tindak Lanjut
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-900">CA-2026-STAR-042 (Sentul Cluster)</div>
                      <div className="text-[11px] text-slate-500">Pemohon: Rudi Haryanto (Teknisi FTTH)</div>
                    </div>
                    <div className="text-xs font-bold text-blue-600">Rp 3.500.000</div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Keperluan: BBM operasional mobil tangga & klem tiang darurat.
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                      Upload Struk / Bukti Nota
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">LPJ Telah Terverifikasi (Auto-Journal)</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                    Selesai
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-900">PR-2026-ME-019 (Proyek KIIC)</div>
                      <div className="text-[11px] text-slate-500">Vendor: PT. Schneider Elektrik Indonesia</div>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rp 18.500.000</div>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-1">
                    Terjurnal: [D] Beban Material Proyek ME / [K] Kas Bank Mandiri
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STARLITE FTTH */}
        {activeTab === "starlite" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-fuchsia-900 to-purple-900 text-white p-6 rounded-2xl shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-fuchsia-500/30 text-fuchsia-200 text-xs font-semibold mb-2">
                    <Wifi className="w-3.5 h-3.5" /> Unit Bisnis Starlite FTTH
                  </div>
                  <h2 className="text-xl font-bold">Billing, Pelanggan & Pendapatan Internet</h2>
                  <p className="text-xs text-fuchsia-200 mt-1">
                    Pengelolaan tagihan bulanan pelanggan fiber optik dan monitoring arus kas piutang (AR).
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-xl border border-white/20">
                    <div className="text-[10px] uppercase tracking-wider text-fuchsia-200">Pelanggan Aktif</div>
                    <div className="text-lg font-bold">{INITIAL_SUBSCRIBERS.length} Titik Sambung</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-xl border border-white/20">
                    <div className="text-[10px] uppercase tracking-wider text-fuchsia-200">Estimasi Pendapatan</div>
                    <div className="text-lg font-bold">{formatRupiah(totalMonthlyAR)} / bln</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Status Tagihan Periode Berjalan (November 2026)</h3>
                <span className="text-xs text-slate-500 font-mono">Periode: 2026-11</span>
              </div>
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">No. Invoice</th>
                    <th className="px-4 py-3">Nama Pelanggan</th>
                    <th className="px-4 py-3">Paket Layanan</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Jatuh Tempo</th>
                    <th className="px-4 py-3">Status Bayar</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {INITIAL_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{inv.subscriberName}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {INITIAL_SUBSCRIBERS.find(s => s.id === inv.subscriberId)?.packagePlan || "-"}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{formatRupiah(inv.amount)}</td>
                      <td className="px-4 py-3">{formatDateIndo(inv.dueDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {inv.paymentStatus === "PAID" ? "Lunas" : "Belum Bayar"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inv.paymentStatus !== "PAID" ? (
                          <button className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700">
                            Konfirmasi Bayar
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Kuitansi #{inv.id}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Modal 1: Buat Pengajuan Baru (Kas Bon / PR) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Form Pengajuan Anggaran / Kas Bon</h3>
            <p className="text-xs text-slate-500 mb-4">
              Isi formulir berikut dengan jelas untuk ditinjau oleh SPV dan Divisi Keuangan.
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Bisnis / Divisi</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as BusinessUnit)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="STARLITE_FTTH">Starlite FTTH (Jaringan Internet)</option>
                  <option value="ME_CORE">Jasa ME Core (Mekanik & Elektronik)</option>
                  <option value="OVERHEAD_OPERASIONAL">Overhead / Operasional Kantor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Pengajuan</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as RequestType)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="CASH_ADVANCE">Kas Bon Operasional (Cash Advance)</option>
                  <option value="PURCHASE_REQUISITION">Pengadaan Barang / PO (Purchase Requisition)</option>
                  <option value="REIMBURSEMENT">Reimbursement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pemohon</label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="Misal: Rudi (Teknisi Lapangan)"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Pengajuan</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Pembelian Patchcord & BBM Operasional"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal yang Diajukan (Rp)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Contoh: 1500000"
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Keperluan Lapangan</label>
                <textarea
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Jelaskan kebutuhan pengeluaran secara ringkas..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Kirim Pengajuan
                </button>
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
    </div>
  );
}
