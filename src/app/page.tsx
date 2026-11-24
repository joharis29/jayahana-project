"use client";

import React, { useState, useMemo, useRef } from "react";
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
  Send,
  Paperclip,
  Camera,
  Image as ImageIcon,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Edit3,
  RotateCcw,
  ZoomIn,
  Plus,
  Upload,
  ChevronDown,
  ChevronUp
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
import { BusinessUnit, BudgetRequest, RequestType, UserRole, FinancialTransaction, ProcurementItem, SalesInvoice, OfficialReceiptBKM, InvoicePaymentRecord, SITE_DIVISIONS, EXPENSE_CATEGORIES, ExpenseCategory, RequestAttachment, DisbursementRecord, ApprovalStatus, LPJApprovalStatus, RealizationRecord, RealizationItem } from "@/types";

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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>("");
  const [requests, setRequests] = useState<BudgetRequest[]>(INITIAL_REQUESTS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalItem[]>(INITIAL_PENDING_APPROVALS);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);

  // Request Sorting State
  type RequestSortField = "docNumber" | "category" | "unit" | "requester" | "amount" | "dueDate" | "status";
  type SortOrder = "ASC" | "DESC" | null;

  const [requestSortField, setRequestSortField] = useState<RequestSortField | null>(null);
  const [requestSortOrder, setRequestSortOrder] = useState<SortOrder>(null);

  const handleToggleRequestSort = (field: RequestSortField) => {
    if (requestSortField !== field) {
      setRequestSortField(field);
      setRequestSortOrder("ASC");
    } else if (requestSortOrder === "ASC") {
      setRequestSortOrder("DESC");
    } else {
      setRequestSortField(null);
      setRequestSortOrder(null);
    }
  };

  // Request Filter Logic
  const isRequestFilterActive =
    selectedUnit !== "ALL" ||
    selectedCategoryFilter !== "ALL" ||
    selectedStatusFilter !== "ALL" ||
    requestSearchQuery.trim() !== "" ||
    requestSortField !== null;

  const handleResetRequestFilters = () => {
    setSelectedUnit("ALL");
    setSelectedCategoryFilter("ALL");
    setSelectedStatusFilter("ALL");
    setRequestSearchQuery("");
    setRequestSortField(null);
    setRequestSortOrder(null);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // 1. Site / Divisi filter
      if (selectedUnit !== "ALL" && r.unit !== selectedUnit) return false;

      // 2. Kategori filter
      if (selectedCategoryFilter !== "ALL") {
        const cat = r.category || (r.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
        if (cat !== selectedCategoryFilter) return false;
      }

      // 3. Status filter
      if (selectedStatusFilter !== "ALL") {
        if (selectedStatusFilter === "PENDING_AUDIT" && r.status !== "PENDING_AUDIT") return false;
        if (selectedStatusFilter === "PENDING_PM" && r.status !== "PENDING_PM") return false;
        if (selectedStatusFilter === "PENDING_GM" && r.status !== "PENDING_GM") return false;
        if (selectedStatusFilter === "PENDING_FINANCE" && r.status !== "PENDING_FINANCE") return false;
        if (selectedStatusFilter === "PENDING_DIRECTOR" && r.status !== "PENDING_DIRECTOR") return false;
        if (selectedStatusFilter === "APPROVED_READY_PAY" && r.status !== "APPROVED_READY_PAY") return false;
        if (selectedStatusFilter === "DISBURSED" && !["DISBURSED", "COMPLETED"].includes(r.status)) return false;
        if (selectedStatusFilter === "NEED_REVISION" && r.status !== "NEED_REVISION") return false;
        if (selectedStatusFilter === "REJECTED" && r.status !== "REJECTED") return false;
      }

      // 4. Search query
      if (requestSearchQuery.trim()) {
        const q = requestSearchQuery.toLowerCase();
        const matchDoc = (r.requestNumber || "").toLowerCase().includes(q);
        const matchCat = (r.category || "").toLowerCase().includes(q);
        const matchTitle = (r.title || "").toLowerCase().includes(q);
        const matchPurpose = (r.purpose || "").toLowerCase().includes(q);
        const matchRequester = (r.requesterName || "").toLowerCase().includes(q);
        const matchUnit = String(r.unit || "").toLowerCase().includes(q);
        if (!matchDoc && !matchCat && !matchTitle && !matchPurpose && !matchRequester && !matchUnit) {
          return false;
        }
      }

      return true;
    });
  }, [requests, selectedUnit, selectedCategoryFilter, selectedStatusFilter, requestSearchQuery]);

  const sortedRequests = useMemo(() => {
    const list = [...filteredRequests];
    if (!requestSortField || !requestSortOrder) return list;

    return list.sort((a, b) => {
      let comp = 0;
      switch (requestSortField) {
        case "docNumber":
          comp = (a.requestNumber || "").localeCompare(b.requestNumber || "");
          break;
        case "category": {
          const catA = a.category || (a.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
          const catB = b.category || (b.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
          comp = catA.localeCompare(catB);
          break;
        }
        case "unit":
          comp = String(a.unit || "").localeCompare(String(b.unit || ""));
          break;
        case "requester":
          comp = (a.requesterName || "").localeCompare(b.requesterName || "");
          break;
        case "amount":
          comp = a.totalAmount - b.totalAmount;
          break;
        case "dueDate":
          comp = (a.dueDate || "").localeCompare(b.dueDate || "");
          break;
        case "status":
          comp = a.status.localeCompare(b.status);
          break;
      }
      return requestSortOrder === "ASC" ? comp : -comp;
    });
  }, [filteredRequests, requestSortField, requestSortOrder]);

  // ==========================================
  // 2. DISBURSEMENT (PENCAIRAN KAS) FILTER & SORT STATE
  // ==========================================
  type DisburseSortField = "docNumber" | "title" | "category" | "unit" | "requester" | "amount" | "dueDate" | "status" | "voucher";
  const [disburseSearchQuery, setDisburseSearchQuery] = useState<string>("");
  const [disburseUnit, setDisburseUnit] = useState<string>("ALL");
  const [disburseCategoryFilter, setDisburseCategoryFilter] = useState<string>("ALL");
  const [disburseStatusFilter, setDisburseStatusFilter] = useState<string>("ALL");
  const [disburseSortField, setDisburseSortField] = useState<DisburseSortField | null>(null);
  const [disburseSortOrder, setDisburseSortOrder] = useState<SortOrder>(null);

  const handleToggleDisburseSort = (field: DisburseSortField) => {
    if (disburseSortField !== field) {
      setDisburseSortField(field);
      setDisburseSortOrder("ASC");
    } else if (disburseSortOrder === "ASC") {
      setDisburseSortOrder("DESC");
    } else {
      setDisburseSortField(null);
      setDisburseSortOrder(null);
    }
  };

  const isDisburseFilterActive =
    disburseUnit !== "ALL" ||
    disburseCategoryFilter !== "ALL" ||
    disburseStatusFilter !== "ALL" ||
    disburseSearchQuery.trim() !== "" ||
    disburseSortField !== null;

  const handleResetDisburseFilters = () => {
    setDisburseUnit("ALL");
    setDisburseCategoryFilter("ALL");
    setDisburseStatusFilter("ALL");
    setDisburseSearchQuery("");
    setDisburseSortField(null);
    setDisburseSortOrder(null);
  };

  const filteredDisburseRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === "APPROVED_READY_PAY" || r.disbursement)
      .filter((r) => {
        if (disburseUnit !== "ALL" && r.unit !== disburseUnit) return false;
        if (disburseCategoryFilter !== "ALL") {
          const cat = r.category || (r.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
          if (cat !== disburseCategoryFilter) return false;
        }
        if (disburseStatusFilter !== "ALL") {
          if (disburseStatusFilter === "READY" && r.disbursement) return false;
          if (disburseStatusFilter === "DISBURSED" && !r.disbursement) return false;
          if (disburseStatusFilter === "CASH_ADVANCE" && r.requestType !== "CASH_ADVANCE") return false;
          if (disburseStatusFilter === "PURCHASE_REQUISITION" && r.requestType !== "PURCHASE_REQUISITION") return false;
        }
        if (disburseSearchQuery.trim()) {
          const q = disburseSearchQuery.toLowerCase();
          const matchDoc = (r.requestNumber || "").toLowerCase().includes(q);
          const matchVoucher = (r.disbursement?.voucherNumber || "").toLowerCase().includes(q);
          const matchTitle = (r.title || "").toLowerCase().includes(q);
          const matchRequester = (r.requesterName || "").toLowerCase().includes(q);
          const matchCat = (r.category || "").toLowerCase().includes(q);
          const matchUnit = String(r.unit || "").toLowerCase().includes(q);
          if (!matchDoc && !matchVoucher && !matchTitle && !matchRequester && !matchCat && !matchUnit) {
            return false;
          }
        }
        return true;
      });
  }, [requests, disburseUnit, disburseCategoryFilter, disburseStatusFilter, disburseSearchQuery]);

  const sortedDisburseRequests = useMemo(() => {
    const list = [...filteredDisburseRequests];
    if (!disburseSortField || !disburseSortOrder) return list;

    return list.sort((a, b) => {
      let comp = 0;
      switch (disburseSortField) {
        case "docNumber":
          comp = (a.requestNumber || "").localeCompare(b.requestNumber || "");
          break;
        case "title":
          comp = (a.title || "").localeCompare(b.title || "");
          break;
        case "category": {
          const catA = a.category || (a.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
          const catB = b.category || (b.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan");
          comp = catA.localeCompare(catB);
          break;
        }
        case "unit":
          comp = String(a.unit || "").localeCompare(String(b.unit || ""));
          break;
        case "requester":
          comp = (a.requesterName || "").localeCompare(b.requesterName || "");
          break;
        case "amount":
          comp = a.totalAmount - b.totalAmount;
          break;
        case "dueDate":
          comp = (a.dueDate || "").localeCompare(b.dueDate || "");
          break;
        case "status": {
          const statA = a.disbursement ? "DISBURSED" : "READY";
          const statB = b.disbursement ? "DISBURSED" : "READY";
          comp = statA.localeCompare(statB);
          break;
        }
        case "voucher": {
          const vA = a.disbursement?.voucherNumber || "";
          const vB = b.disbursement?.voucherNumber || "";
          comp = vA.localeCompare(vB);
          break;
        }
      }
      return disburseSortOrder === "ASC" ? comp : -comp;
    });
  }, [filteredDisburseRequests, disburseSortField, disburseSortOrder]);

  // ==========================================
  // 3. LPJ REALIZATION (REALISASI & LPJ) FILTER & SORT STATE
  // ==========================================
  type LpjSortField = "docNumber" | "title" | "unit" | "requester" | "advance" | "actual" | "diff" | "status";
  const [lpjSearchQuery, setLpjSearchQuery] = useState<string>("");
  const [lpjUnit, setLpjUnit] = useState<string>("ALL");
  const [lpjReconciliationFilter, setLpjReconciliationFilter] = useState<string>("ALL");
  const [lpjStatusFilter, setLpjStatusFilter] = useState<string>("ALL");
  const [lpjSortField, setLpjSortField] = useState<LpjSortField | null>(null);
  const [lpjSortOrder, setLpjSortOrder] = useState<SortOrder>(null);

  const handleToggleLpjSort = (field: LpjSortField) => {
    if (lpjSortField !== field) {
      setLpjSortField(field);
      setLpjSortOrder("ASC");
    } else if (lpjSortOrder === "ASC") {
      setLpjSortOrder("DESC");
    } else {
      setLpjSortField(null);
      setLpjSortOrder(null);
    }
  };

  const isLpjFilterActive =
    lpjUnit !== "ALL" ||
    lpjReconciliationFilter !== "ALL" ||
    lpjStatusFilter !== "ALL" ||
    lpjSearchQuery.trim() !== "" ||
    lpjSortField !== null;

  const handleResetLpjFilters = () => {
    setLpjUnit("ALL");
    setLpjReconciliationFilter("ALL");
    setLpjStatusFilter("ALL");
    setLpjSearchQuery("");
    setLpjSortField(null);
    setLpjSortOrder(null);
  };

  const filteredLpjRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === "DISBURSED" || r.disbursement || r.realization)
      .filter((r) => {
        if (lpjUnit !== "ALL" && r.unit !== lpjUnit) return false;
        
        // Status Approval LPJ
        if (lpjStatusFilter !== "ALL") {
          if (lpjStatusFilter === "NO_LPJ" && r.realization) return false;
          if (lpjStatusFilter === "IN_REVIEW" && (!r.realization || ["COMPLETED", "REJECTED"].includes(r.realization.status))) return false;
          if (lpjStatusFilter === "SETTLEMENT" && r.realization?.status !== "PENDING_FINANCE_SETTLEMENT") return false;
          if (lpjStatusFilter === "COMPLETED" && r.realization?.status !== "COMPLETED") return false;
          if (lpjStatusFilter === "PENDING_AUDIT" && r.realization?.status !== "PENDING_AUDIT") return false;
          if (lpjStatusFilter === "PENDING_PM" && r.realization?.status !== "PENDING_PM") return false;
          if (lpjStatusFilter === "PENDING_GM" && r.realization?.status !== "PENDING_GM") return false;
          if (lpjStatusFilter === "PENDING_DIRECTOR" && r.realization?.status !== "PENDING_DIRECTOR") return false;
          if (lpjStatusFilter === "WAITING_REIMBURSEMENT" && r.realization?.status !== "WAITING_REIMBURSEMENT") return false;
        }

        // Status Rekonsiliasi Saldo (Pas, Sisa Kasir, Nombok/Reimburse)
        if (lpjReconciliationFilter !== "ALL") {
          if (!r.realization) return false;
          const diff = r.realization.balanceDifference;
          if (lpjReconciliationFilter === "EXACT" && diff !== 0) return false;
          if (lpjReconciliationFilter === "SURPLUS" && diff <= 0) return false;
          if (lpjReconciliationFilter === "DEFICIT" && diff >= 0) return false;
        }

        // Search query
        if (lpjSearchQuery.trim()) {
          const q = lpjSearchQuery.toLowerCase();
          const matchDoc = (r.requestNumber || "").toLowerCase().includes(q);
          const matchLPJ = (r.realization?.lpjNumber || "").toLowerCase().includes(q);
          const matchTitle = (r.title || "").toLowerCase().includes(q);
          const matchRequester = (r.requesterName || "").toLowerCase().includes(q);
          const matchUnit = String(r.unit || "").toLowerCase().includes(q);
          if (!matchDoc && !matchLPJ && !matchTitle && !matchRequester && !matchUnit) {
            return false;
          }
        }
        return true;
      });
  }, [requests, lpjUnit, lpjStatusFilter, lpjReconciliationFilter, lpjSearchQuery]);

  const sortedLpjRequests = useMemo(() => {
    const list = [...filteredLpjRequests];
    if (!lpjSortField || !lpjSortOrder) return list;

    return list.sort((a, b) => {
      let comp = 0;
      switch (lpjSortField) {
        case "docNumber": {
          const numA = a.realization?.lpjNumber || a.requestNumber || "";
          const numB = b.realization?.lpjNumber || b.requestNumber || "";
          comp = numA.localeCompare(numB);
          break;
        }
        case "title":
          comp = (a.title || "").localeCompare(b.title || "");
          break;
        case "unit":
          comp = String(a.unit || "").localeCompare(String(b.unit || ""));
          break;
        case "requester":
          comp = (a.requesterName || "").localeCompare(b.requesterName || "");
          break;
        case "advance": {
          const advA = a.disbursement?.amountPaid || a.totalAmount;
          const advB = b.disbursement?.amountPaid || b.totalAmount;
          comp = advA - advB;
          break;
        }
        case "actual": {
          const actA = a.realization?.totalRealizedAmount || 0;
          const actB = b.realization?.totalRealizedAmount || 0;
          comp = actA - actB;
          break;
        }
        case "diff": {
          const diffA = a.realization?.balanceDifference || 0;
          const diffB = b.realization?.balanceDifference || 0;
          comp = diffA - diffB;
          break;
        }
        case "status": {
          const statA = a.realization?.status || "NO_LPJ";
          const statB = b.realization?.status || "NO_LPJ";
          comp = statA.localeCompare(statB);
          break;
        }
      }
      return lpjSortOrder === "ASC" ? comp : -comp;
    });
  }, [filteredLpjRequests, lpjSortField, lpjSortOrder]);

  // ==========================================
  // 4. GOODS RECEIPT (PENERIMAAN BARANG FISIK - BAST) FILTER & SORT STATE
  // ==========================================
  type GrSortField = "docNumber" | "title" | "vendor" | "unit" | "amount" | "status" | "date";
  const [grSearchQuery, setGrSearchQuery] = useState<string>("");
  const [grUnit, setGrUnit] = useState<string>("ALL");
  const [grCategoryFilter, setGrCategoryFilter] = useState<string>("ALL");
  const [grStatusFilter, setGrStatusFilter] = useState<string>("ALL");
  const [grSortField, setGrSortField] = useState<GrSortField | null>(null);
  const [grSortOrder, setGrSortOrder] = useState<SortOrder>(null);
  const [expandedGrIds, setExpandedGrIds] = useState<string[]>([]);

  const toggleGrExpand = (id: string) => {
    setExpandedGrIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleGrSort = (field: GrSortField) => {
    if (grSortField !== field) {
      setGrSortField(field);
      setGrSortOrder("ASC");
    } else if (grSortOrder === "ASC") {
      setGrSortOrder("DESC");
    } else {
      setGrSortField(null);
      setGrSortOrder(null);
    }
  };

  const isGrFilterActive =
    grUnit !== "ALL" ||
    grCategoryFilter !== "ALL" ||
    grStatusFilter !== "ALL" ||
    grSearchQuery.trim() !== "" ||
    grSortField !== null;

  const handleResetGrFilters = () => {
    setGrUnit("ALL");
    setGrCategoryFilter("ALL");
    setGrStatusFilter("ALL");
    setGrSearchQuery("");
    setGrSortField(null);
    setGrSortOrder(null);
  };

  const filteredGrRequests = useMemo(() => {
    return requests
      .filter((r) => r.requestType === "PURCHASE_REQUISITION")
      .filter((r) => {
        if (grUnit !== "ALL" && r.unit !== grUnit) return false;
        if (grCategoryFilter !== "ALL") {
          const cat = r.category || "Perlengkapan & Peralatan";
          if (cat !== grCategoryFilter) return false;
        }
        if (grStatusFilter !== "ALL") {
          if (grStatusFilter === "PENDING" && r.goodsReceipt) return false;
          if (grStatusFilter === "COMPLETED" && !r.goodsReceipt) return false;
        }
        if (grSearchQuery.trim()) {
          const q = grSearchQuery.toLowerCase();
          const matchDoc = (r.requestNumber || "").toLowerCase().includes(q);
          const matchBAST = (r.goodsReceipt?.receiptNumber || "").toLowerCase().includes(q);
          const matchVendor = (r.goodsReceipt?.vendorName || r.vendorInfo?.vendorName || "").toLowerCase().includes(q);
          const matchTitle = (r.title || "").toLowerCase().includes(q);
          const matchUnit = String(r.unit || "").toLowerCase().includes(q);
          if (!matchDoc && !matchBAST && !matchVendor && !matchTitle && !matchUnit) {
            return false;
          }
        }
        return true;
      });
  }, [requests, grUnit, grCategoryFilter, grStatusFilter, grSearchQuery]);

  const sortedGrRequests = useMemo(() => {
    const list = [...filteredGrRequests];
    if (!grSortField || !grSortOrder) return list;

    return list.sort((a, b) => {
      let comp = 0;
      switch (grSortField) {
        case "docNumber":
          comp = (a.requestNumber || "").localeCompare(b.requestNumber || "");
          break;
        case "title":
          comp = (a.title || "").localeCompare(b.title || "");
          break;
        case "vendor": {
          const vA = a.goodsReceipt?.vendorName || a.vendorInfo?.vendorName || "";
          const vB = b.goodsReceipt?.vendorName || b.vendorInfo?.vendorName || "";
          comp = vA.localeCompare(vB);
          break;
        }
        case "unit":
          comp = String(a.unit || "").localeCompare(String(b.unit || ""));
          break;
        case "amount":
          comp = a.totalAmount - b.totalAmount;
          break;
        case "status": {
          const sA = a.goodsReceipt ? "COMPLETED" : "PENDING";
          const sB = b.goodsReceipt ? "COMPLETED" : "PENDING";
          comp = sA.localeCompare(sB);
          break;
        }
        case "date": {
          const dA = a.goodsReceipt?.receivedDate || a.createdAt || "";
          const dB = b.goodsReceipt?.receivedDate || b.createdAt || "";
          comp = dA.localeCompare(dB);
          break;
        }
      }
      return grSortOrder === "ASC" ? comp : -comp;
    });
  }, [filteredGrRequests, grSortField, grSortOrder]);

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
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

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

  // Attachment state for request form (PDF, Images, Camera)
  const [attachments, setAttachments] = useState<RequestAttachment[]>([]);
  const [selectedPreviewAttachment, setSelectedPreviewAttachment] = useState<RequestAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl,
            uploadedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input value so same file can be re-selected if needed
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Procurement Vendor Info (Accurate style)
  const [vendorName, setVendorName] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("Gudang Utama Jayahana, Sentul City");

  // Form Pengajuan Strict Validation Rules
  const isRequestItemsValid = useMemo(() => {
    return (
      requestItems.length > 0 &&
      requestItems.every(
        (item) => item.description.trim() !== "" && item.quantity > 0 && item.unitPrice > 0
      )
    );
  }, [requestItems]);

  const missingFields = useMemo(() => {
    const list: string[] = [];
    if (!newUnit) list.push("Site / Divisi");
    if (!newCategory) list.push("Kategori Pengajuan");
    if (!requesterName.trim()) list.push("Nama Pemohon");
    if (!requestDate.trim()) list.push("Tanggal Pengajuan");
    if (!dueDate.trim()) list.push("Tanggal Jatuh Tempo");
    if (!isRequestItemsValid || requestItemsSubTotal <= 0) list.push("Rincian Barang/Jasa (Nama & Harga)");
    if (!newPurpose.trim()) list.push("Catatan / Keterangan");
    if (newType === "PURCHASE_REQUISITION" && !vendorName.trim()) list.push("Nama Pemasok / Vendor");
    if (attachments.length === 0) list.push("Lampiran Dokumen/Foto");
    return list;
  }, [newUnit, newCategory, requesterName, requestDate, dueDate, isRequestItemsValid, requestItemsSubTotal, newPurpose, newType, vendorName, attachments]);

  const isFormValid = missingFields.length === 0;

  // Multi-tier Approval & Disbursement Custom State
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [disburseTargetReq, setDisburseTargetReq] = useState<BudgetRequest | null>(null);
  const [disburseSourceAccount, setDisburseSourceAccount] = useState("Bank BCA Operasional (A/C: 731-0982-11)");
  const [disbursePaymentMethod, setDisbursePaymentMethod] = useState<"TRANSFER_BANK" | "CASH_KAS_KECIL">("TRANSFER_BANK");
  const [disburseDate, setDisburseDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [disburseRefNumber, setDisburseRefNumber] = useState("");
  const [disburseNotes, setDisburseNotes] = useState("");
  const [disburseProofAttachment, setDisburseProofAttachment] = useState<RequestAttachment | null>(null);
  const disburseProofFileInputRef = useRef<HTMLInputElement>(null);
  const disburseProofCameraInputRef = useRef<HTMLInputElement>(null);

  // Revision & Rejection Modals State
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionTargetReq, setRevisionTargetReq] = useState<BudgetRequest | null>(null);
  const [revisionInputNote, setRevisionInputNote] = useState("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectTargetReq, setRejectTargetReq] = useState<BudgetRequest | null>(null);
  const [rejectInputReason, setRejectInputReason] = useState("");

  // Edit Returned Revision Request in Main Form
  const [editingRevisionRequestId, setEditingRevisionRequestId] = useState<string | null>(null);
  const [revisionBannerNote, setRevisionBannerNote] = useState<string | null>(null);

  // Bukti Transfer Zoom Preview Modal
  const [selectedProofPreview, setSelectedProofPreview] = useState<RequestAttachment | null>(null);

  // Pop-up Modal Detail Pengajuan Lengkap (Ketika No Dokumen / Judul diklik)
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<BudgetRequest | null>(null);

  // States untuk Alur Laporan Realisasi & LPJ Berjenjang
  const [isInputLPJModalOpen, setIsInputLPJModalOpen] = useState(false);
  const [lpjTargetReq, setLpjTargetReq] = useState<BudgetRequest | null>(null);
  const [lpjReceiptItems, setLpjReceiptItems] = useState<Array<{ id: string; receiptDate: string; description: string; vendor: string; receiptNumber: string; amount: number; }>>([
    { id: "rcp-1", receiptDate: new Date().toISOString().split("T")[0], description: "", vendor: "", receiptNumber: "", amount: 0 }
  ]);
  const [lpjGeneralNotes, setLpjGeneralNotes] = useState("");
  const [lpjAttachments, setLpjAttachments] = useState<RequestAttachment[]>([]);
  const lpjFileInputRef = useRef<HTMLInputElement>(null);
  const lpjCameraInputRef = useRef<HTMLInputElement>(null);

  // Modal Terima Setoran Sisa Kasir (Refund to Cashier)
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundTargetReq, setRefundTargetReq] = useState<BudgetRequest | null>(null);
  const [refundMethod, setRefundMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [refundReceiptNo, setRefundReceiptNo] = useState("");

  // Modal Detail Nota & Dokumen LPJ
  const [selectedDetailLPJ, setSelectedDetailLPJ] = useState<BudgetRequest | null>(null);

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

  // Multi-Level Approval Handlers (Audit -> PM -> GM -> Direktur (>5jt) -> Finance)
  const handleAuditApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "PENDING_PM" } : r));
    setApprovalNotification("Audit Internal telah memverifikasi SOP & pagu. Pengajuan diteruskan ke Project Manager (PM).");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handlePMApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "PENDING_GM" } : r));
    setApprovalNotification("Project Manager (PM) telah menyetujui pengajuan. Pengajuan diteruskan ke General Manager (GM).");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleGMApprove = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (!target) return;
    
    // Aturan threshold Rp 5.000.000:
    // > 5jt memerlukan otorisasi Direktur Utama
    // <= 5jt langsung siap dicairkan oleh Finance
    const needsDirector = target.totalAmount > 5000000;

    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      return {
        ...r,
        status: needsDirector ? "PENDING_DIRECTOR" : "APPROVED_READY_PAY"
      };
    }));

    if (needsDirector) {
      setApprovalNotification(`General Manager (GM) menyetujui. Karena nominal (${formatRupiah(target.totalAmount)}) > Rp 5.000.000, pengajuan diteruskan ke Direktur Utama.`);
    } else {
      setApprovalNotification(`General Manager (GM) menyetujui. Nominal (${formatRupiah(target.totalAmount)}) <= Rp 5.000.000, pengajuan langsung Siap Dicairkan oleh Finance.`);
    }
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  const handleDirectorApprove = (reqId: string) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "APPROVED_READY_PAY" } : r));
    setApprovalNotification("Direktur Utama memberikan otorisasi final pengeluaran (Siap Dicairkan oleh Finance).");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Handlers untuk Permintaan Revisi
  const handleOpenRevisionModal = (req: BudgetRequest) => {
    setRevisionTargetReq(req);
    setRevisionInputNote(req.revisionNote || "");
    setIsRevisionModalOpen(true);
  };

  const handleConfirmRevision = () => {
    if (!revisionTargetReq || !revisionInputNote.trim()) return;
    const today = new Date().toLocaleDateString("id-ID");
    
    setRequests(prev => prev.map(r => {
      if (r.id !== revisionTargetReq.id) return r;
      const history = r.revisionHistory || [];
      return {
        ...r,
        status: "NEED_REVISION",
        revisionNote: revisionInputNote.trim(),
        revisionHistory: [
          ...history,
          {
            role: "Reviewer / Approval",
            name: "Tim Review",
            note: revisionInputNote.trim(),
            date: today,
            action: "REVISION"
          }
        ]
      };
    }));

    setIsRevisionModalOpen(false);
    setApprovalNotification(`Pengajuan ${revisionTargetReq.requestNumber} telah dikembalikan ke pemohon untuk direvisi.`);
    setRevisionTargetReq(null);
    setRevisionInputNote("");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Handlers untuk Penolakan Pengajuan
  const handleOpenRejectModal = (req: BudgetRequest) => {
    setRejectTargetReq(req);
    setRejectInputReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectTargetReq || !rejectInputReason.trim()) return;
    const today = new Date().toLocaleDateString("id-ID");

    setRequests(prev => prev.map(r => {
      if (r.id !== rejectTargetReq.id) return r;
      const history = r.revisionHistory || [];
      return {
        ...r,
        status: "REJECTED",
        rejectedNote: rejectInputReason.trim(),
        revisionHistory: [
          ...history,
          {
            role: "Reviewer / Approval",
            name: "Tim Review",
            note: rejectInputReason.trim(),
            date: today,
            action: "REJECT"
          }
        ]
      };
    }));

    setIsRejectModalOpen(false);
    setApprovalNotification(`Pengajuan ${rejectTargetReq.requestNumber} resmi Ditolak.`);
    setRejectTargetReq(null);
    setRejectInputReason("");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Handler untuk Pemohon: Edit & Ajukan Ulang Pengajuan yang Perlu Revisi
  const handleEditForRevision = (req: BudgetRequest) => {
    setEditingRevisionRequestId(req.id);
    setRevisionBannerNote(req.revisionNote || "Mohon perbaiki data pengajuan sesuai instruksi catatan reviewer di bawah.");
    
    setNewTitle(req.title);
    setNewUnit(String(req.unit));
    setNewCategory(req.category as ExpenseCategory || "Akomodasi");
    setNewType(req.requestType);
    setNewAmount(String(req.totalAmount));
    setNewPurpose(req.purpose);
    setRequesterName(req.requesterName);
    setRequestDate(req.createdAt || new Date().toISOString().split("T")[0]);
    setDueDate(req.dueDate || new Date().toISOString().split("T")[0]);
    
    if (req.items && req.items.length > 0) {
      setRequestItems(req.items.map((it, idx) => ({
        id: `ri-${idx + 1}`,
        description: it.description,
        quantity: it.quantity,
        unit: it.unit,
        unitPrice: it.estimatedPrice,
        discount: 0
      })));
    }

    if (req.vendorInfo) {
      setVendorName(req.vendorInfo.vendorName || "");
      setPaymentTerms(req.vendorInfo.paymentTerms || "Net 30");
      setBankName(req.vendorInfo.bankName || "Bank Central Asia (BCA)");
      setBankAccountNumber(req.vendorInfo.bankAccountNumber || "");
      setBankAccountName(req.vendorInfo.bankAccountName || "");
      setShippingAddress(req.vendorInfo.shippingAddress || "Gudang Utama Jayahana, Sentul City");
    }

    if (req.attachments) {
      setAttachments(req.attachments);
    } else {
      setAttachments([]);
    }

    setIsModalOpen(true);
  };

  // Handlers untuk Pencairan Dana & Upload Bukti Transfer (Disbursement Modal)
  const handleOpenDisbursementModal = (req: BudgetRequest) => {
    setDisburseTargetReq(req);
    setDisburseSourceAccount(
      req.requestType === "CASH_ADVANCE" 
        ? "Kas Kecil Lapangan (Petty Cash Operasional)" 
        : "Bank BCA Operasional (A/C: 731-0982-11)"
    );
    setDisbursePaymentMethod(req.requestType === "CASH_ADVANCE" ? "CASH_KAS_KECIL" : "TRANSFER_BANK");
    setDisburseDate(new Date().toISOString().split("T")[0]);
    setDisburseRefNumber(`TRF-BCA-${Date.now().toString().slice(-6)}`);
    setDisburseNotes(`Pencairan dana ${req.requestNumber} - ${req.title}`);
    setDisburseProofAttachment(null);
    setIsDisburseModalOpen(true);
  };

  const handleDisburseProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setDisburseProofAttachment({
        id: `att-trf-${Date.now()}`,
        name: file.name,
        type: file.type || "image/png",
        size: file.size,
        dataUrl,
        uploadedAt: new Date().toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleConfirmDisbursement = () => {
    if (!disburseTargetReq) return;
    if (!disburseProofAttachment) {
      alert("Wajib melampirkan foto / bukti transfer bank sebelum mencairkan dana!");
      return;
    }

    const vNum = `BKK-2026-11-${Math.floor(100 + Math.random() * 900)}`;
    const disburseRecord: DisbursementRecord = {
      disbursedAt: disburseDate,
      disbursedBy: "Dewi Anggraeni (Finance Head)",
      voucherNumber: vNum,
      sourceAccount: disburseSourceAccount,
      paymentMethod: disbursePaymentMethod,
      transferReference: disburseRefNumber || `TRF-${Date.now().toString().slice(-6)}`,
      amountPaid: disburseTargetReq.totalAmount,
      proofAttachment: disburseProofAttachment,
      notes: disburseNotes
    };

    setRequests(prev => prev.map(r => {
      if (r.id === disburseTargetReq.id) {
        return {
          ...r,
          status: "DISBURSED",
          disbursedAt: disburseDate,
          disbursement: disburseRecord
        };
      }
      // Jika ada LPJ yang menunggu pencairan pengajuan reimbursement ini, otomatis selesaikan LPJ-nya!
      if (r.realization && r.realization.reimbursementRequestId === disburseTargetReq.id) {
        return {
          ...r,
          realization: {
            ...r.realization,
            status: "COMPLETED" as LPJApprovalStatus,
            financeNotes: `Reimbursement talangan sebesar ${formatRupiah(disburseRecord.amountPaid)} telah dicairkan oleh Finance via voucher ${vNum} (${disburseRecord.transferReference}). Seluruh pertanggungjawaban dana resmi LUNAS & SELESAI.`
          }
        };
      }
      return r;
    }));

    setIsDisburseModalOpen(false);

    // Auto open print modal for the newly disbursed BKK voucher!
    const updatedTargetReq = {
      ...disburseTargetReq,
      status: "DISBURSED" as ApprovalStatus,
      disbursedAt: disburseDate,
      disbursement: disburseRecord
    };

    setApprovalNotification(`Dana ${disburseTargetReq.requestNumber} berhasil dicairkan! Bukti transfer telah terlampir.`);
    setTimeout(() => {
      handleOpenPrintModal(updatedTargetReq, "DISBURSEMENT");
    }, 400);
  };

  // Fallback legacy handler
  const handleDisbursePayment = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (target) {
      handleOpenDisbursementModal(target);
    }
  };

  // ===================== ALUR LAPORAN REALISASI & LPJ BERJENJANG =====================
  const handleOpenInputLPJ = (req: BudgetRequest) => {
    setLpjTargetReq(req);
    const initialItems = req.items && req.items.length > 0 ? req.items.map((it, idx) => ({
      id: `rcp-${idx + 1}`,
      receiptDate: new Date().toISOString().split("T")[0],
      description: it.description,
      vendor: "Vendor Terverifikasi",
      receiptNumber: `STR-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: it.totalPrice
    })) : [
      { id: "rcp-1", receiptDate: new Date().toISOString().split("T")[0], description: "", vendor: "", receiptNumber: "", amount: 0 }
    ];
    setLpjReceiptItems(initialItems);
    setLpjGeneralNotes(`Pertanggungjawaban penggunaan kasbon ${req.requestNumber} untuk ${req.title}`);
    setLpjAttachments(req.attachments || []);
    setIsInputLPJModalOpen(true);
  };

  const handleAddLpjItem = () => {
    setLpjReceiptItems(prev => [
      ...prev,
      { id: `rcp-${Date.now()}`, receiptDate: new Date().toISOString().split("T")[0], description: "", vendor: "", receiptNumber: "", amount: 0 }
    ]);
  };

  const handleRemoveLpjItem = (id: string) => {
    setLpjReceiptItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  };

  const handleLpjItemChange = (id: string, field: string, value: any) => {
    setLpjReceiptItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleLpjFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLpjAttachments((prev) => [
          ...prev,
          {
            id: `att-lpj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: file.type || "image/png",
            size: file.size,
            dataUrl,
            uploadedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSubmitNewLPJ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpjTargetReq) return;

    const totalRealized = lpjReceiptItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    if (totalRealized <= 0) {
      alert("Total pengeluaran riil nota harus lebih dari Rp 0.");
      return;
    }

    const advance = lpjTargetReq.disbursement?.amountPaid || lpjTargetReq.totalAmount;
    const diff = advance - totalRealized; // >0: sisa kasir, <0: nombok/reimburse
    const action = diff > 0 ? "REFUND_TO_CASHIER" : diff < 0 ? "REIMBURSE_ADDITIONAL" : "EXACT";
    const lpjNum = `LPJ-2026-11-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: RealizationRecord = {
      id: `lpj-${Date.now()}`,
      requestId: lpjTargetReq.id,
      lpjNumber: lpjNum,
      submittedAt: new Date().toISOString().split("T")[0],
      submittedBy: lpjTargetReq.requesterName,
      initialAdvanceAmount: advance,
      totalRealizedAmount: totalRealized,
      balanceDifference: diff,
      settlementAction: action,
      status: "PENDING_AUDIT",
      items: lpjReceiptItems.map((it, idx) => ({
        id: it.id || `r-${idx + 1}`,
        receiptDate: it.receiptDate,
        description: it.description,
        amount: Number(it.amount) || 0,
        receiptNumber: it.receiptNumber || `NOTA-${idx + 1}`,
        vendor: it.vendor || "Toko Lapangan"
      })),
      receiptAttachments: lpjAttachments.length > 0 ? lpjAttachments : undefined,
      auditNotes: lpjGeneralNotes
    };

    setRequests(prev => prev.map(r => r.id === lpjTargetReq.id ? { ...r, realization: newRecord } : r));
    setIsInputLPJModalOpen(false);
    setApprovalNotification(`Laporan Realisasi & LPJ ${lpjNum} berhasil disubmit. Menunggu verifikasi fisik oleh Tim Audit.`);
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Alur Approval Berjenjang LPJ (Audit -> PM -> GM -> DU (>5jt) -> Finance)
  const handleAuditApproveLPJ = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: "PENDING_PM",
          auditNotes: "Fisik nota, struk toko, dan kelengkapan transaksi telah diverifikasi dan absah."
        }
      };
    }));
    setApprovalNotification("Audit Internal telah memverifikasi bukti fisik nota LPJ. Diteruskan ke Project Manager.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handlePMApproveLPJ = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: "PENDING_GM",
          pmNotes: "Pengeluaran lapangan sesuai progres fisik pekerjaan proyek."
        }
      };
    }));
    setApprovalNotification("Project Manager menyetujui realisasi LPJ. Diteruskan ke General Manager.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleGMApproveLPJ = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (!target || !target.realization) return;

    const totalRealized = target.realization.totalRealizedAmount;
    const isAbove5M = totalRealized > 5000000 || target.totalAmount > 5000000;
    const nextStatus: LPJApprovalStatus = isAbove5M ? "PENDING_DIRECTOR" : "PENDING_FINANCE_SETTLEMENT";

    setRequests(prev => prev.map(r => {
      if (r.id !== reqId || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: nextStatus,
          gmNotes: "General Manager menyetujui efisiensi biaya realisasi belanja."
        }
      };
    }));

    if (isAbove5M) {
      setApprovalNotification(`General Manager menyetujui LPJ. Karena nominal realisasi (${formatRupiah(totalRealized)}) > Rp 5 Juta, diteruskan ke Direktur Utama.`);
    } else {
      setApprovalNotification(`General Manager menyetujui LPJ. Siap direkonsiliasi dan diselesaikan saldonya oleh Finance.`);
    }
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  const handleDirectorApproveLPJ = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: "PENDING_FINANCE_SETTLEMENT",
          directorNotes: "Direktur Utama memberikan otorisasi final realisasi dana."
        }
      };
    }));
    setApprovalNotification("Direktur Utama mengesahkan LPJ. Berkas diteruskan ke Finance untuk rekonsiliasi saldo kas.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  // Penyelesaian Saldo di Finance
  const handleSettleExactLPJ = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: "COMPLETED",
          financeNotes: "Saldo kasbon dan realisasi nota belanja cocok 100% (Selisih Rp 0). Berkas LPJ selesai dan lunas."
        }
      };
    }));
    setApprovalNotification("LPJ resmi selesai & diselesaikan (Settle) tanpa selisih saldo.");
    setTimeout(() => setApprovalNotification(null), 3500);
  };

  const handleOpenRefundModal = (req: BudgetRequest) => {
    setRefundTargetReq(req);
    setRefundMethod("CASH");
    setRefundReceiptNo(`BKM-SETOR-${Date.now().toString().slice(-6)}`);
    setIsRefundModalOpen(true);
  };

  const handleConfirmRefund = () => {
    if (!refundTargetReq || !refundTargetReq.realization) return;
    const diffAmount = refundTargetReq.realization.balanceDifference;

    setRequests(prev => prev.map(r => {
      if (r.id !== refundTargetReq.id || !r.realization) return r;
      return {
        ...r,
        realization: {
          ...r.realization,
          status: "COMPLETED",
          refundReceiptNumber: refundReceiptNo,
          refundReceivedAt: new Date().toISOString().split("T")[0],
          financeNotes: `Sisa dana kasbon sebesar ${formatRupiah(diffAmount)} telah disetorkan kembali ke Kasir via ${refundMethod === "CASH" ? "Tunai" : "Transfer Bank"} (No. BKM: ${refundReceiptNo}).`
        }
      };
    }));

    setIsRefundModalOpen(false);
    setApprovalNotification(`Pengembalian sisa kasbon sebesar ${formatRupiah(diffAmount)} berhasil diverifikasi Kasir (No: ${refundReceiptNo}). LPJ Lunas!`);
    setTimeout(() => setApprovalNotification(null), 4000);
  };

  // FITUR KHUSUS: ⚡ Buat Pengajuan Reimbursement Baru Otomatis dari LPJ
  const handleCreateReimbursementFromLPJ = (req: BudgetRequest) => {
    if (!req.realization || req.realization.balanceDifference >= 0) return;

    const shortage = Math.abs(req.realization.balanceDifference);
    const unitCode = String(req.unit).startsWith("HO") ? "HO" : req.unit === "ME_CORE" ? "ME" : "STAR";
    const newDocNum = `REIM-2026-${unitCode}-${Math.floor(100 + Math.random() * 900)}`;

    const newReimReq: BudgetRequest = {
      id: `req-${Date.now()}`,
      requestNumber: newDocNum,
      title: `Reimbursement Kekurangan Dana LPJ: ${req.realization.lpjNumber} - ${req.title}`,
      category: "Reimbursement",
      requestType: "REIMBURSEMENT",
      unit: req.unit,
      costCenterId: req.costCenterId,
      requesterName: req.requesterName,
      requesterRole: req.requesterRole,
      totalAmount: shortage,
      status: "PENDING_AUDIT",
      purpose: `Klaim reimbursement atas dana talangan pribadi pemohon pada pengeluaran darurat lapangan sesuai ${req.realization.lpjNumber} (Kasbon awal: ${req.requestNumber}).`,
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      items: [
        {
          id: `reim-itm-${Date.now()}`,
          description: `Penggantian talangan belanja riil lapangan sesuai nota LPJ ${req.realization.lpjNumber}`,
          quantity: 1,
          unit: "Paket",
          estimatedPrice: shortage,
          totalPrice: shortage
        }
      ],
      attachments: req.attachments
    };

    // Update parent LPJ status to WAITING_REIMBURSEMENT with linked ID
    setRequests(prev => [
      newReimReq,
      ...prev.map(r => {
        if (r.id !== req.id || !r.realization) return r;
        return {
          ...r,
          realization: {
            ...r.realization,
            status: "WAITING_REIMBURSEMENT" as LPJApprovalStatus,
            reimbursementRequestId: newReimReq.id,
            reimbursementRequestNumber: newDocNum,
            financeNotes: `Menunggu pencairan dokumen reimbursement baru ${newDocNum} di Tab 2.`
          }
        };
      })
    ]);

    setApprovalNotification(`Pengajuan Reimbursement baru ${newDocNum} sebesar ${formatRupiah(shortage)} berhasil dibuat dan masuk antrean approval di Tab 1.`);
    setTimeout(() => setApprovalNotification(null), 4500);
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
    if (!isFormValid) {
      alert(`Mohon lengkapi semua data wajib sebelum mengirim:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    // Use items table total if items have values, otherwise fall back to newAmount
    const parsedAmount = requestItemsSubTotal > 0 ? requestItemsSubTotal : parseFloat(newAmount || "0");
    if (parsedAmount <= 0) return;
    const newDocNum = `${newType === "CASH_ADVANCE" ? "CA" : "PR"}-2026-${Math.floor(100 + Math.random() * 900)}`;

    const firstItemDesc = requestItems.find(i => i.description.trim())?.description;
    const autoTitle = firstItemDesc ? `${newCategory} - ${firstItemDesc}` : `${newCategory} (${newUnit})`;

    const newReq: BudgetRequest = {
      id: `req-${Date.now()}`,
      requestNumber: newDocNum,
      title: autoTitle,
      unit: newUnit,
      category: newCategory,
      costCenterId: newUnit.startsWith("HO") ? "cc-ho-01" : "cc-site-01",
      requesterName: requesterName,
      requesterRole: newType === "CASH_ADVANCE" ? "FIELD_TECH" : "SITE_SPV",
      requestType: newType,
      totalAmount: parsedAmount,
      status: "PENDING_AUDIT",
      purpose: newPurpose || autoTitle,
      createdAt: requestDate,
      dueDate: dueDate,
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
      } : undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    // Add to requests or update existing if editing for revision
    if (editingRevisionRequestId) {
      setRequests(prev => prev.map(r => {
        if (r.id !== editingRevisionRequestId) return r;
        return {
          ...r,
          title: autoTitle,
          unit: newUnit,
          category: newCategory,
          totalAmount: parsedAmount,
          status: "PENDING_AUDIT",
          purpose: newPurpose || autoTitle,
          createdAt: requestDate,
          dueDate: dueDate,
          items: newReq.items,
          procurementItems: newReq.procurementItems,
          vendorInfo: newReq.vendorInfo,
          attachments: attachments.length > 0 ? attachments : undefined,
          revisionNote: undefined,
        };
      }));

      setApprovalNotification(`Pengajuan ${newReq.title} berhasil diperbaiki dan dikirim ulang ke Tim Audit.`);
      setEditingRevisionRequestId(null);
      setRevisionBannerNote(null);
    } else {
      setRequests([newReq, ...requests]);

      // Also add to Pending Approvals queue
      const newApproval: PendingApprovalItem = {
        id: `appr-${Date.now()}`,
        type: "BUDGET_REQUEST",
        docNumber: newDocNum,
        title: autoTitle,
        unit: newUnit,
        requester: requesterName,
        amount: parsedAmount,
        submittedAt: new Date().toISOString().split("T")[0],
        level: "Audit Internal",
        urgent: parsedAmount > 10000000,
      };
      setPendingApprovals([newApproval, ...pendingApprovals]);
      setApprovalNotification(`Pengajuan baru ${newDocNum} berhasil dibuat dan dikirim ke Tim Audit.`);
    }
    setTimeout(() => setApprovalNotification(null), 3500);

    setIsModalOpen(false);
    setNewTitle("");
    setNewAmount("");
    setNewPurpose("");
    setVendorName("");
    setBankAccountNumber("");
    setBankAccountName("");
    setRequestDate(new Date().toISOString().split("T")[0]);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setDueDate(nextWeek.toISOString().split("T")[0]);
    setNewUnit("Rajeg & Pasar Kemis");
    setNewCategory("Akomodasi");
    setAttachments([]);
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
            Pengajuan Anggaran
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
                  Siklus terintegrasi: Pengajuan &bull; Pencairan Kas &bull; Laporan Realisasi LPJ &bull; Penerimaan Barang Fisik.
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
                <span>1. Pengajuan & PO</span>
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
                <span>2. Pencairan Kas</span>
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
                <span>4. Penerimaan Barang Fisik</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  requestWorkflowSubTab === "GOODS_RECEIPT" ? "bg-amber-700 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {requests.filter(r => r.requestType === "PURCHASE_REQUISITION").length}
                </span>
              </button>
            </div>

            {/* KONTEN TAHAP 1: PENGAJUAN & PO (APPROVAL BERJENJANG) */}
            {requestWorkflowSubTab === "PROPOSAL" && (
              <div className="space-y-4">
                {/* Stats Alert Box with Quick Filter Click */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setSelectedStatusFilter(prev => prev === "PENDING_AUDIT" ? "ALL" : "PENDING_AUDIT")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      selectedStatusFilter === "PENDING_AUDIT" ? "border-amber-400 bg-amber-50/50 ring-1 ring-amber-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Menunggu Audit</span>
                    <strong className="text-base text-amber-700 font-extrabold">
                      {requests.filter(r => r.status === "PENDING_AUDIT").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Uji kepatuhan SOP &amp; pagu</span>
                  </div>
                  <div
                    onClick={() => setSelectedStatusFilter(prev => ["PENDING_PM", "PENDING_GM"].includes(prev) ? "ALL" : "PENDING_PM")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      ["PENDING_PM", "PENDING_GM"].includes(selectedStatusFilter) ? "border-sky-400 bg-sky-50/50 ring-1 ring-sky-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Menunggu PM &amp; GM</span>
                    <strong className="text-base text-sky-700 font-extrabold">
                      {requests.filter(r => ["PENDING_PM", "PENDING_GM"].includes(r.status)).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      PM: {requests.filter(r => r.status === "PENDING_PM").length} &bull; GM: {requests.filter(r => r.status === "PENDING_GM").length}
                    </span>
                  </div>
                  <div
                    onClick={() => setSelectedStatusFilter(prev => prev === "PENDING_DIRECTOR" ? "ALL" : "PENDING_DIRECTOR")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      selectedStatusFilter === "PENDING_DIRECTOR" ? "border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Menunggu Dirut (&gt;5 Jt)</span>
                    <strong className="text-base text-indigo-700 font-extrabold">
                      {requests.filter(r => r.status === "PENDING_DIRECTOR").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Otorisasi nominal &gt; Rp 5 Juta</span>
                  </div>
                  <div
                    onClick={() => setSelectedStatusFilter(prev => prev === "APPROVED_READY_PAY" ? "ALL" : "APPROVED_READY_PAY")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      selectedStatusFilter === "APPROVED_READY_PAY" ? "border-emerald-400 bg-emerald-100/60 ring-1 ring-emerald-300" : "border-slate-200 bg-emerald-50/50"
                    }`}
                  >
                    <span className="text-emerald-800 block">Siap Dicairkan Finance</span>
                    <strong className="text-base text-emerald-800 font-extrabold">
                      {requests.filter(r => r.status === "APPROVED_READY_PAY").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Siap cair &amp; lampirkan bukti</span>
                  </div>
                </div>

                {/* Tabel Pengajuan */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Daftar Pengajuan Anggaran &amp; Pesanan Pembelian (PO)</span>
                    </div>
                  </div>

                  {/* BAR FILTER LENGKAP & PENCARIAN */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={requestSearchQuery}
                        onChange={(e) => setRequestSearchQuery(e.target.value)}
                        placeholder="Cari no. dokumen, catatan, pemohon..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 shadow-2xs"
                      />
                      {requestSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setRequestSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Site / Divisi */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Site:</span>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value as any)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400 shadow-2xs"
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
                    </div>

                    {/* Filter Kategori Pengajuan */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Kategori:</span>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400 shadow-2xs max-w-[170px]"
                      >
                        <option value="ALL">Semua Kategori</option>
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Status Approval */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Status:</span>
                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400 shadow-2xs"
                      >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING_AUDIT">Menunggu Audit</option>
                        <option value="PENDING_PM">Menunggu PM</option>
                        <option value="PENDING_GM">Menunggu GM</option>
                        <option value="PENDING_DIRECTOR">Menunggu Dirut (&gt;5 Jt)</option>
                        <option value="APPROVED_READY_PAY">Siap Dicairkan</option>
                        <option value="DISBURSED">Sudah Cair</option>
                        <option value="NEED_REVISION">Perlu Revisi</option>
                        <option value="REJECTED">Ditolak</option>
                      </select>
                    </div>

                    {/* Tombol Reset Filter */}
                    {isRequestFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetRequestFilters}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-xs transition cursor-pointer"
                        title="Reset semua filter"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {/* Status Sort Aktif Indicator */}
                    {requestSortField && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">
                        <span>
                          Sort: <strong>{
                            requestSortField === "docNumber" ? "No. Dokumen" :
                            requestSortField === "category" ? "Kategori" :
                            requestSortField === "unit" ? "Site" :
                            requestSortField === "requester" ? "Pemohon" :
                            requestSortField === "amount" ? "Nominal" :
                            requestSortField === "dueDate" ? "Jatuh Tempo" : "Status"
                          }</strong> ({requestSortOrder === "ASC" ? "A-Z / Naik" : "Z-A / Turun"})
                        </span>
                        <button
                          type="button"
                          onClick={() => { setRequestSortField(null); setRequestSortOrder(null); }}
                          className="ml-0.5 text-blue-500 hover:text-blue-800 cursor-pointer font-bold"
                          title="Hapus urutan"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-mono">
                      Menampilkan <strong className="text-slate-700">{sortedRequests.length}</strong> dari {requests.length} data
                    </span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("docNumber")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan No. Dokumen"
                          >
                            <span>No. Dokumen</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "docNumber" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "docNumber" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("category")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Kategori Pengajuan"
                          >
                            <span>Kategori Pengajuan</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "category" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "category" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("unit")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Site / Divisi"
                          >
                            <span>Site / Divisi</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "unit" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "unit" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("requester")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Pemohon"
                          >
                            <span>Pemohon</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "requester" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "requester" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("amount")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Nominal Diajukan"
                          >
                            <span>Nominal Diajukan</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "amount" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "amount" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("dueDate")}
                            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group w-full"
                            title="Urutkan berdasarkan Tanggal Jatuh Tempo"
                          >
                            <span>Tanggal Jatuh Tempo</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "dueDate" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "dueDate" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRequestSort("status")}
                            className="inline-flex items-center justify-center gap-1.5 font-semibold hover:text-blue-600 transition cursor-pointer select-none group w-full"
                            title="Urutkan berdasarkan Status Approval"
                          >
                            <span>Status Approval</span>
                            <span className={`p-0.5 rounded transition ${requestSortField === "status" ? "text-blue-600 bg-blue-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {requestSortField === "status" ? (
                                requestSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Aksi &amp; Cetak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sortedRequests.map((req) => {
                        return (
                          <tr key={req.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3 font-mono">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailRequest(req)}
                                className="font-bold text-slate-900 hover:text-blue-600 block text-left transition cursor-pointer group"
                                title="Klik untuk melihat detail lengkap pengajuan"
                              >
                                <span className="group-hover:underline">{req.requestNumber}</span>
                              </button>
                              <span className="text-[10px] text-slate-400 block">{req.createdAt}</span>
                            </td>
                            <td className="px-4 py-3 max-w-[280px]">
                              {/* Kategori Pengajuan (Tulisan yang di-bold) - Klik untuk buka modal detail */}
                              <div
                                onClick={() => setSelectedDetailRequest(req)}
                                className="font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer group transition"
                                title="Klik untuk melihat detail lengkap pengajuan"
                              >
                                <span className="group-hover:underline">
                                  {req.category || (req.requestType === "CASH_ADVANCE" ? "Kasbon" : "Perlengkapan & Peralatan")}
                                </span>
                                {req.attachments && req.attachments.length > 0 && (
                                  <span className="inline-flex items-center text-[10px] text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200 font-normal">
                                    <Paperclip className="w-2.5 h-2.5 mr-0.5" />
                                    {req.attachments.length}
                                  </span>
                                )}
                              </div>
                              {/* Catatan / Keterangan pada saat pengaju mengisi form (Tulisan yang tidak di-bold) */}
                              <div
                                onClick={() => setSelectedDetailRequest(req)}
                                className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug cursor-pointer hover:text-slate-700 transition"
                                title="Klik untuk melihat detail lengkap pengajuan"
                              >
                                {req.purpose || "-"}
                              </div>
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
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {req.dueDate ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {req.dueDate}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-mono text-[11px]">-</span>
                              )}
                            </td>

                            {/* Kolom Status Approval Berjenjang (Single Status Badge) */}
                            <td className="px-4 py-3 text-center">
                              {req.status === "PENDING_AUDIT" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                  <span>Menunggu Audit</span>
                                </span>
                              )}
                              {req.status === "PENDING_PM" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                                  <span>Menunggu PM</span>
                                </span>
                              )}
                              {req.status === "PENDING_GM" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                                  <span>Menunggu GM</span>
                                </span>
                              )}
                              {req.status === "PENDING_FINANCE" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                  <span>Menunggu Finance</span>
                                </span>
                              )}
                              {req.status === "PENDING_DIRECTOR" && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                                    <span>Menunggu Dirut</span>
                                  </span>
                                  <span className="text-[9px] text-indigo-600 font-mono mt-0.5 font-medium">&gt; Rp 5.000.000</span>
                                </div>
                              )}
                              {req.status === "APPROVED_READY_PAY" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-2xs">
                                  <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Siap Dicairkan</span>
                                </span>
                              )}
                              {["DISBURSED", "COMPLETED"].includes(req.status) && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Sudah Cair</span>
                                  </span>
                                  {req.disbursement?.voucherNumber && (
                                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">{req.disbursement.voucherNumber}</span>
                                  )}
                                </div>
                              )}
                              {req.status === "NEED_REVISION" && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-300 shadow-2xs">
                                    <RotateCcw className="w-3 h-3 text-orange-600" />
                                    <span>Perlu Revisi</span>
                                  </span>
                                  {req.revisionNote && (
                                    <span className="text-[9px] text-orange-700 italic max-w-[140px] truncate mt-0.5" title={req.revisionNote}>
                                      "{req.revisionNote}"
                                    </span>
                                  )}
                                </div>
                              )}
                              {req.status === "REJECTED" && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-300 shadow-2xs">
                                    <X className="w-3 h-3 text-red-600" />
                                    <span>Ditolak</span>
                                  </span>
                                  {req.rejectedNote && (
                                    <span className="text-[9px] text-red-600 italic max-w-[140px] truncate mt-0.5" title={req.rejectedNote}>
                                      "{req.rejectedNote}"
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Kolom Aksi Dinamis Sesuai Tahapan Alur */}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* Tombol Cetak Form Pengajuan Resmi (Selalu Tersedia) */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenPrintModal(req, "REQUEST")}
                                  className="flex items-center gap-1 px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                  title="Cetak Formulir Pengajuan Resmi A4"
                                >
                                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Cetak Form</span>
                                </button>

                                {/* Action Tahap 1: Verifikasi Audit */}
                                {req.status === "PENDING_AUDIT" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleAuditApprove(req.id)}
                                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Audit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRevisionModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Kembalikan ke pemohon untuk revisi"
                                    >
                                      Revisi
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRejectModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Tolak pengajuan ini"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}

                                {/* Action Tahap 2: Persetujuan Project Manager (PM) */}
                                {req.status === "PENDING_PM" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handlePMApprove(req.id)}
                                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC PM
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRevisionModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Minta pemohon revisi"
                                    >
                                      Revisi
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRejectModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Tolak pengajuan"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}

                                {/* Action Tahap 3: Persetujuan General Manager (GM) */}
                                {req.status === "PENDING_GM" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleGMApprove(req.id)}
                                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC GM
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRevisionModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Minta revisi"
                                    >
                                      Revisi
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRejectModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Tolak"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}

                                {/* Action Tahap 4: Otorisasi Direktur Utama (Jika Nominal > 5 Jt) */}
                                {req.status === "PENDING_DIRECTOR" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleDirectorApprove(req.id)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                    >
                                      ACC Dirut
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRevisionModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                    >
                                      Revisi
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenRejectModal(req)}
                                      className="px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                    >
                                      Tolak
                                    </button>
                                  </>
                                )}

                                {/* Action Tahap 5: Eksekusi Pencairan Dana oleh Finance */}
                                {req.status === "APPROVED_READY_PAY" && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDisbursementModal(req)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                                  >
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span>Cairkan &amp; Lampirkan Bukti</span>
                                  </button>
                                )}

                                {/* Status Sudah Cair: Cetak Voucher BKK & Lihat Bukti Transfer */}
                                {["DISBURSED", "COMPLETED"].includes(req.status) && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPrintModal(req, "DISBURSEMENT")}
                                      className="flex items-center gap-1 px-2 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                      title="Cetak Bukti Kas Keluar (BKK) A4"
                                    >
                                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>Voucher BKK</span>
                                    </button>

                                    {req.disbursement?.proofAttachment && (
                                      <button
                                        type="button"
                                        onClick={() => setSelectedProofPreview(req.disbursement?.proofAttachment || null)}
                                        className="flex items-center gap-1 px-2 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                        title="Lihat Bukti Transfer Bank yang Dilampirkan Finance"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Bukti Trf</span>
                                      </button>
                                    )}
                                  </>
                                )}

                                {/* Action Pengajuan yang Perlu Revisi: Pemohon Klik Edit & Ajukan Ulang */}
                                {req.status === "NEED_REVISION" && (
                                  <button
                                    type="button"
                                    onClick={() => handleEditForRevision(req)}
                                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                                    title="Edit data dan ajukan ulang ke Tim Audit"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit &amp; Ajukan Ulang</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {sortedRequests.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-10 text-slate-400 bg-white">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <Filter className="w-6 h-6 text-slate-300" />
                              <span className="text-xs font-semibold text-slate-600">Tidak ada pengajuan yang sesuai dengan kriteria filter</span>
                              <span className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau sesuaikan opsi filter di atas.</span>
                              <button
                                type="button"
                                onClick={handleResetRequestFilters}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                              >
                                Reset Semua Filter
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KONTEN TAHAP 2: PENCAIRAN KAS (FINANCE GATE) */}
            {requestWorkflowSubTab === "DISBURSEMENT" && (
              <div className="space-y-4">
                {/* 4 Kartu KPI / Status Pencairan Kas */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setDisburseStatusFilter(prev => prev === "READY" ? "ALL" : "READY")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      disburseStatusFilter === "READY" ? "border-amber-400 bg-amber-50/50 ring-1 ring-amber-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Siap Dicairkan</span>
                    <strong className="text-base text-amber-700 font-extrabold">
                      {requests.filter(r => r.status === "APPROVED_READY_PAY" && !r.disbursement).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatRupiah(requests.filter(r => r.status === "APPROVED_READY_PAY" && !r.disbursement).reduce((acc, r) => acc + r.totalAmount, 0))}
                    </span>
                  </div>

                  <div
                    onClick={() => setDisburseStatusFilter(prev => prev === "DISBURSED" ? "ALL" : "DISBURSED")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      disburseStatusFilter === "DISBURSED" ? "border-emerald-400 bg-emerald-50/50 ring-1 ring-emerald-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Sudah Cair (BKK Terbit)</span>
                    <strong className="text-base text-emerald-700 font-extrabold">
                      {requests.filter(r => !!r.disbursement).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatRupiah(requests.filter(r => !!r.disbursement).reduce((acc, r) => acc + (r.disbursement?.amountPaid || r.totalAmount), 0))}
                    </span>
                  </div>

                  <div
                    onClick={() => setDisburseStatusFilter(prev => prev === "CASH_ADVANCE" ? "ALL" : "CASH_ADVANCE")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      disburseStatusFilter === "CASH_ADVANCE" ? "border-purple-400 bg-purple-50/50 ring-1 ring-purple-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Kasbon Lapangan</span>
                    <strong className="text-base text-purple-700 font-extrabold">
                      {requests.filter(r => (r.status === "APPROVED_READY_PAY" || r.disbursement) && r.requestType === "CASH_ADVANCE").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Operasional tim teknisi site</span>
                  </div>

                  <div
                    onClick={() => setDisburseStatusFilter(prev => prev === "PURCHASE_REQUISITION" ? "ALL" : "PURCHASE_REQUISITION")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      disburseStatusFilter === "PURCHASE_REQUISITION" ? "border-blue-400 bg-blue-50/50 ring-1 ring-blue-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Pengadaan PO / Vendor</span>
                    <strong className="text-base text-blue-700 font-extrabold">
                      {requests.filter(r => (r.status === "APPROVED_READY_PAY" || r.disbursement) && r.requestType === "PURCHASE_REQUISITION").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tagihan material &amp; supplier</span>
                  </div>
                </div>

                {/* Tabel Pencairan Kas */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Daftar Pencairan Kas &amp; Pembayaran Bank</span>
                    </div>
                  </div>

                  {/* BAR FILTER LENGKAP & PENCARIAN */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={disburseSearchQuery}
                        onChange={(e) => setDisburseSearchQuery(e.target.value)}
                        placeholder="Cari no. dokumen, no. voucher, pemohon..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 shadow-2xs"
                      />
                      {disburseSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setDisburseSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Site / Divisi */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Site:</span>
                      <select
                        value={disburseUnit}
                        onChange={(e) => setDisburseUnit(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-emerald-400 shadow-2xs"
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
                    </div>

                    {/* Filter Kategori Pengeluaran */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Kategori:</span>
                      <select
                        value={disburseCategoryFilter}
                        onChange={(e) => setDisburseCategoryFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-emerald-400 shadow-2xs max-w-[170px]"
                      >
                        <option value="ALL">Semua Kategori</option>
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Status Pencairan */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Status:</span>
                      <select
                        value={disburseStatusFilter}
                        onChange={(e) => setDisburseStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-emerald-400 shadow-2xs"
                      >
                        <option value="ALL">Semua Status</option>
                        <option value="READY">Siap Dicairkan</option>
                        <option value="DISBURSED">Sudah Cair (BKK Terbit)</option>
                        <option value="CASH_ADVANCE">Kasbon Saja</option>
                        <option value="PURCHASE_REQUISITION">PO Supplier Saja</option>
                      </select>
                    </div>

                    {/* Tombol Reset Filter */}
                    {isDisburseFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetDisburseFilters}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-xs transition cursor-pointer"
                        title="Reset semua filter"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {/* Status Sort Aktif Indicator */}
                    {disburseSortField && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                        <span>
                          Sort: <strong>{
                            disburseSortField === "docNumber" ? "No. Dokumen" :
                            disburseSortField === "title" ? "Keperluan" :
                            disburseSortField === "category" ? "Kategori" :
                            disburseSortField === "unit" ? "Site" :
                            disburseSortField === "requester" ? "Penerima" :
                            disburseSortField === "amount" ? "Nominal" :
                            disburseSortField === "dueDate" ? "Jatuh Tempo" :
                            disburseSortField === "voucher" ? "No. Voucher" : "Status"
                          }</strong> ({disburseSortOrder === "ASC" ? "A-Z / Naik" : "Z-A / Turun"})
                        </span>
                        <button
                          type="button"
                          onClick={() => { setDisburseSortField(null); setDisburseSortOrder(null); }}
                          className="ml-0.5 text-emerald-600 hover:text-emerald-900 cursor-pointer font-bold"
                          title="Hapus urutan"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-mono">
                      Menampilkan <strong className="text-slate-700">{sortedDisburseRequests.length}</strong> dari {requests.filter(r => r.status === "APPROVED_READY_PAY" || r.disbursement).length} data
                    </span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("docNumber")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan No. Dokumen"
                          >
                            <span>No. Dokumen</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "docNumber" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "docNumber" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("title")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Keperluan"
                          >
                            <span>Keperluan Dana</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "title" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "title" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("unit")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Site / Divisi"
                          >
                            <span>Divisi &amp; Penerima</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "unit" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "unit" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("amount")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Nominal Pencairan"
                          >
                            <span>Nominal Pencairan</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "amount" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "amount" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("status")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Status Pencairan"
                          >
                            <span>Status Pencairan</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "status" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "status" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleDisburseSort("voucher")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-emerald-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Info Voucher Kas"
                          >
                            <span>Info Voucher Kas</span>
                            <span className={`p-0.5 rounded transition ${disburseSortField === "voucher" ? "text-emerald-700 bg-emerald-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {disburseSortField === "voucher" ? (
                                disburseSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Aksi Finance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sortedDisburseRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            <button
                              type="button"
                              onClick={() => setSelectedDetailRequest(req)}
                              className="hover:text-blue-600 hover:underline cursor-pointer text-left"
                              title="Klik untuk melihat detail lengkap pengajuan"
                            >
                              {req.requestNumber}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              onClick={() => setSelectedDetailRequest(req)}
                              className="font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer"
                              title="Klik untuk melihat detail lengkap pengajuan"
                            >
                              {req.title}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Tipe: {req.requestType === "CASH_ADVANCE" ? "Kas Bon Lapangan" : req.requestType === "REIMBURSEMENT" ? "Reimbursement" : "Pengadaan PO"}
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
                                {req.disbursement.proofAttachment ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProofPreview(req.disbursement?.proofAttachment || null)}
                                    className="inline-flex items-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 font-medium underline mt-0.5 cursor-pointer"
                                  >
                                    <Paperclip className="w-2.5 h-2.5 text-blue-600" />
                                    <span>Lihat Bukti Transfer ({req.disbursement.proofAttachment.name.slice(0, 15)}...)</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-amber-600 italic block mt-0.5">Bukti transfer belum diunggah</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Menunggu eksekusi kasir Finance</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {req.disbursement ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintModal(req, "DISBURSEMENT")}
                                    className="flex items-center gap-1 px-2.5 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                    title="Cetak Bukti Kas Keluar (BKK) Resmi"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Cetak Voucher BKK</span>
                                  </button>
                                  {req.disbursement.proofAttachment && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedProofPreview(req.disbursement?.proofAttachment || null)}
                                      className="flex items-center gap-1 px-2 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                      title="Pratinjau Bukti Transfer"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Bukti</span>
                                    </button>
                                  )}
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenDisbursementModal(req)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                                >
                                  <Wallet className="w-3.5 h-3.5" />
                                  <span>Cairkan &amp; Lampirkan Bukti</span>
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

            {/* KONTEN TAHAP 3: LAPORAN REALISASI & LPJ (APPROVAL BERJENJANG & REKONSILIASI KAS) */}
            {requestWorkflowSubTab === "REALIZATION" && (
              <div className="space-y-4">
                {/* 4 Kartu KPI / Status LPJ & Realisasi */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setLpjStatusFilter(prev => prev === "NO_LPJ" ? "ALL" : "NO_LPJ")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      lpjStatusFilter === "NO_LPJ" ? "border-amber-400 bg-amber-50/50 ring-1 ring-amber-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Belum Ada LPJ</span>
                    <strong className="text-base text-amber-700 font-extrabold">
                      {requests.filter(r => (r.status === "DISBURSED" || r.disbursement) && !r.realization).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Kasbon cair, menunggu nota</span>
                  </div>

                  <div
                    onClick={() => setLpjStatusFilter(prev => prev === "IN_REVIEW" ? "ALL" : "IN_REVIEW")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      lpjStatusFilter === "IN_REVIEW" ? "border-purple-400 bg-purple-50/50 ring-1 ring-purple-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Dalam Review Approval</span>
                    <strong className="text-base text-purple-700 font-extrabold">
                      {requests.filter(r => r.realization && !["COMPLETED", "REJECTED"].includes(r.realization.status)).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Uji Audit, PM, GM &amp; Dirut</span>
                  </div>

                  <div
                    onClick={() => setLpjStatusFilter(prev => prev === "SETTLEMENT" ? "ALL" : "SETTLEMENT")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      lpjStatusFilter === "SETTLEMENT" ? "border-blue-400 bg-blue-50/50 ring-1 ring-blue-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Siap Penyelesaian Kasir</span>
                    <strong className="text-base text-blue-700 font-extrabold">
                      {requests.filter(r => r.realization && r.realization.status === "PENDING_FINANCE_SETTLEMENT").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Setor sisa / reimburse / settle</span>
                  </div>

                  <div
                    onClick={() => setLpjStatusFilter(prev => prev === "COMPLETED" ? "ALL" : "COMPLETED")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      lpjStatusFilter === "COMPLETED" ? "border-emerald-400 bg-emerald-50/50 ring-1 ring-emerald-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">LPJ Lunas &amp; Selesai</span>
                    <strong className="text-base text-emerald-700 font-extrabold">
                      {requests.filter(r => r.realization?.status === "COMPLETED").length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Rekonsiliasi saldo selesai</span>
                  </div>
                </div>

                {/* Tabel Dokumen LPJ & Realisasi Anggaran */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Daftar Laporan Realisasi (LPJ) &amp; Rekonsiliasi Saldo Kasbon</span>
                    </div>
                  </div>

                  {/* BAR FILTER LENGKAP & PENCARIAN */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={lpjSearchQuery}
                        onChange={(e) => setLpjSearchQuery(e.target.value)}
                        placeholder="Cari no. LPJ, no. kasbon, uraian, pelapor..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 shadow-2xs"
                      />
                      {lpjSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setLpjSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Site / Divisi */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Site:</span>
                      <select
                        value={lpjUnit}
                        onChange={(e) => setLpjUnit(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-purple-400 shadow-2xs"
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
                    </div>

                    {/* Filter Status Rekonsiliasi Saldo */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Rekonsiliasi:</span>
                      <select
                        value={lpjReconciliationFilter}
                        onChange={(e) => setLpjReconciliationFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-purple-400 shadow-2xs"
                      >
                        <option value="ALL">Semua Rekonsiliasi</option>
                        <option value="EXACT">Pas (Rp 0)</option>
                        <option value="SURPLUS">Sisa Kasbon (+Lebih)</option>
                        <option value="DEFICIT">Kekurangan Dana (-Kurang)</option>
                      </select>
                    </div>

                    {/* Filter Status Approval LPJ */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Status:</span>
                      <select
                        value={lpjStatusFilter}
                        onChange={(e) => setLpjStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-purple-400 shadow-2xs"
                      >
                        <option value="ALL">Semua Status</option>
                        <option value="NO_LPJ">Belum Ada LPJ</option>
                        <option value="PENDING_AUDIT">Menunggu Audit LPJ</option>
                        <option value="PENDING_PM">Menunggu PM</option>
                        <option value="PENDING_GM">Menunggu GM</option>
                        <option value="PENDING_DIRECTOR">Menunggu Dirut (&gt;5 Jt)</option>
                        <option value="SETTLEMENT">Siap Penyelesaian Kasir</option>
                        <option value="WAITING_REIMBURSEMENT">Menunggu Reimburse</option>
                        <option value="COMPLETED">Lunas &amp; Selesai</option>
                      </select>
                    </div>

                    {/* Tombol Reset Filter */}
                    {isLpjFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetLpjFilters}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-xs transition cursor-pointer"
                        title="Reset semua filter"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {/* Status Sort Aktif Indicator */}
                    {lpjSortField && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-medium">
                        <span>
                          Sort: <strong>{
                            lpjSortField === "docNumber" ? "No. Kasbon & LPJ" :
                            lpjSortField === "title" ? "Uraian Proyek" :
                            lpjSortField === "unit" ? "Site / Divisi" :
                            lpjSortField === "requester" ? "Pelapor" :
                            lpjSortField === "advance" ? "Uang Muka Awal" :
                            lpjSortField === "actual" ? "Realisasi Riil" :
                            lpjSortField === "diff" ? "Selisih Saldo" : "Status Approval"
                          }</strong> ({lpjSortOrder === "ASC" ? "A-Z / Naik" : "Z-A / Turun"})
                        </span>
                        <button
                          type="button"
                          onClick={() => { setLpjSortField(null); setLpjSortOrder(null); }}
                          className="ml-0.5 text-purple-600 hover:text-purple-900 cursor-pointer font-bold"
                          title="Hapus urutan"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-mono">
                      Menampilkan <strong className="text-slate-700">{sortedLpjRequests.length}</strong> dari {requests.filter(r => r.status === "DISBURSED" || r.disbursement || r.realization).length} data
                    </span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("docNumber")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan No. Kasbon & LPJ"
                          >
                            <span>No. Kasbon &amp; LPJ</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "docNumber" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "docNumber" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("title")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Uraian Pekerjaan / Proyek"
                          >
                            <span>Uraian Pekerjaan / Proyek</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "title" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "title" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("unit")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Pelapor & Divisi"
                          >
                            <span>Pelapor &amp; Divisi</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "unit" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "unit" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("advance")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group ml-auto"
                            title="Urutkan berdasarkan Uang Muka Awal"
                          >
                            <span>Uang Muka Awal</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "advance" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "advance" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("actual")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group ml-auto"
                            title="Urutkan berdasarkan Realisasi Riil"
                          >
                            <span>Realisasi Riil</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "actual" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "actual" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("diff")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group mx-auto"
                            title="Urutkan berdasarkan Status Rekonsiliasi Saldo"
                          >
                            <span>Status Rekonsiliasi Saldo</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "diff" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "diff" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleLpjSort("status")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-purple-700 transition cursor-pointer select-none group mx-auto"
                            title="Urutkan berdasarkan Status Approval LPJ"
                          >
                            <span>Status Approval LPJ</span>
                            <span className={`p-0.5 rounded transition ${lpjSortField === "status" ? "text-purple-700 bg-purple-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {lpjSortField === "status" ? (
                                lpjSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Aksi &amp; Cetak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sortedLpjRequests.map((req) => {
                        const hasLPJ = !!req.realization;
                        const advance = req.disbursement?.amountPaid || req.totalAmount;
                        const actual = hasLPJ ? req.realization!.totalRealizedAmount : 0;
                        const diff = hasLPJ ? req.realization!.balanceDifference : 0;

                        return (
                          <tr key={req.id} className="hover:bg-slate-50/70 transition">
                            {/* No Kasbon & No LPJ */}
                            <td className="px-4 py-3 font-mono">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailRequest(req)}
                                className="font-bold text-slate-900 block hover:text-blue-600 hover:underline cursor-pointer text-left"
                                title="Lihat Detail Pengajuan Asal"
                              >
                                {req.requestNumber}
                              </button>
                              {hasLPJ ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailLPJ(req)}
                                  className="text-[10px] text-purple-700 font-bold block mt-0.5 hover:underline cursor-pointer text-left flex items-center gap-1"
                                  title="Lihat Rincian LPJ & Nota"
                                >
                                  <Receipt className="w-3 h-3 text-purple-600" />
                                  <span>{req.realization!.lpjNumber}</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-amber-600 font-medium italic block mt-0.5">
                                  Belum ada LPJ
                                </span>
                              )}
                            </td>

                            {/* Judul & Kategori */}
                            <td className="px-4 py-3 max-w-[220px]">
                              <button
                                type="button"
                                onClick={() => hasLPJ ? setSelectedDetailLPJ(req) : setSelectedDetailRequest(req)}
                                className="font-bold text-slate-900 truncate block hover:text-purple-700 hover:underline cursor-pointer text-left max-w-full"
                                title={req.title}
                              >
                                {req.title}
                              </button>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {req.category || "Kasbon Lapangan"}
                              </span>
                            </td>

                            {/* Pelapor & Divisi */}
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">{req.requesterName}</div>
                              <div className="text-[10px] text-slate-500">{req.unit}</div>
                            </td>

                            {/* Uang Muka Kasbon Awal */}
                            <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700">
                              {formatRupiah(advance)}
                            </td>

                            {/* Total Realisasi Riil */}
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                              {hasLPJ ? formatRupiah(actual) : "-"}
                            </td>

                            {/* Status Selisih Saldo Rekonsiliasi */}
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {!hasLPJ ? (
                                <span className="text-[10px] text-slate-400 italic font-mono">-</span>
                              ) : diff === 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                  ✓ Pas (Rp 0)
                                </span>
                              ) : diff > 0 ? (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    + Sisa {formatRupiah(diff)}
                                  </span>
                                  <span className="text-[9px] text-emerald-700 font-medium mt-0.5">Disetor ke Kasir</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    - Kurang {formatRupiah(Math.abs(diff))}
                                  </span>
                                  <span className="text-[9px] text-rose-700 font-medium mt-0.5">Klaim Reimbursement</span>
                                </div>
                              )}
                            </td>

                            {/* Status Approval LPJ Berjenjang */}
                            <td className="px-4 py-3 text-center">
                              {!hasLPJ && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                  Belum Dilaporkan
                                </span>
                              )}
                              {hasLPJ && req.realization!.status === "PENDING_AUDIT" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                  <span>Menunggu Audit LPJ</span>
                                </span>
                              )}
                              {hasLPJ && req.realization!.status === "PENDING_PM" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                                  <span>Menunggu PM</span>
                                </span>
                              )}
                              {hasLPJ && req.realization!.status === "PENDING_GM" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                                  <span>Menunggu GM</span>
                                </span>
                              )}
                              {hasLPJ && req.realization!.status === "PENDING_DIRECTOR" && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                                    <span>Menunggu Dirut</span>
                                  </span>
                                  <span className="text-[9px] text-indigo-600 font-mono mt-0.5 font-medium">&gt; Rp 5 Juta</span>
                                </div>
                              )}
                              {hasLPJ && req.realization!.status === "PENDING_FINANCE_SETTLEMENT" && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-2xs">
                                  <Wallet className="w-3 h-3 text-emerald-700" />
                                  <span>Penyelesaian Kasir</span>
                                </span>
                              )}
                              {hasLPJ && req.realization!.status === "WAITING_REIMBURSEMENT" && (
                                <div className="flex flex-col items-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-400 animate-pulse">
                                    <span>⏳ Menunggu Cair</span>
                                  </span>
                                  <span className="text-[9px] text-purple-700 font-mono mt-0.5 font-bold">
                                    {req.realization!.reimbursementRequestNumber || "REIM-2026-..."}
                                  </span>
                                </div>
                              )}
                              {hasLPJ && req.realization!.status === "COMPLETED" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Lunas &amp; Selesai</span>
                                </span>
                              )}
                            </td>

                            {/* Aksi & Cetak */}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* Tombol Input LPJ Baru jika belum ada LPJ */}
                                {!hasLPJ && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenInputLPJ(req)}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Input LPJ &amp; Nota</span>
                                  </button>
                                )}

                                {/* Tombol Detail LPJ */}
                                {hasLPJ && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailLPJ(req)}
                                    className="flex items-center gap-1 px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                                    title="Lihat Rincian Nota & Bukti LPJ"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Detail</span>
                                  </button>
                                )}

                                {/* Tombol Cetak Dokumen LPJ */}
                                {hasLPJ && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintModal(req, "REALIZATION")}
                                    className="flex items-center gap-1 px-2 py-1 text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                    title="Cetak Formulir Laporan Realisasi LPJ Resmi"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak LPJ</span>
                                  </button>
                                )}

                                {/* Aksi Approval Berjenjang LPJ */}
                                {hasLPJ && req.realization!.status === "PENDING_AUDIT" && (
                                  <button
                                    type="button"
                                    onClick={() => handleAuditApproveLPJ(req.id)}
                                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                  >
                                    ACC Audit LPJ
                                  </button>
                                )}
                                {hasLPJ && req.realization!.status === "PENDING_PM" && (
                                  <button
                                    type="button"
                                    onClick={() => handlePMApproveLPJ(req.id)}
                                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                  >
                                    ACC PM
                                  </button>
                                )}
                                {hasLPJ && req.realization!.status === "PENDING_GM" && (
                                  <button
                                    type="button"
                                    onClick={() => handleGMApproveLPJ(req.id)}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                  >
                                    ACC GM
                                  </button>
                                )}
                                {hasLPJ && req.realization!.status === "PENDING_DIRECTOR" && (
                                  <button
                                    type="button"
                                    onClick={() => handleDirectorApproveLPJ(req.id)}
                                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-xs"
                                  >
                                    ACC Dirut LPJ
                                  </button>
                                )}

                                {/* Tahap Akhir: Penyelesaian Saldo di Finance Gate */}
                                {hasLPJ && req.realization!.status === "PENDING_FINANCE_SETTLEMENT" && (
                                  <>
                                    {diff === 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSettleExactLPJ(req.id)}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs"
                                      >
                                        Selesaikan (Settle)
                                      </button>
                                    )}
                                    {diff > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenRefundModal(req)}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs"
                                      >
                                        Terima Setoran Sisa Kasir
                                      </button>
                                    )}
                                    {diff < 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleCreateReimbursementFromLPJ(req)}
                                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs flex items-center gap-1"
                                        title="Buat Pengajuan Baru Reimbursement Otomatis"
                                      >
                                        <span>⚡ Buat Reimbursement Selisih</span>
                                      </button>
                                    )}
                                  </>
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

            {/* KONTEN TAHAP 4: PENERIMAAN BARANG FISIK (TIM AUDIT BAST GUDANG) */}
            {requestWorkflowSubTab === "GOODS_RECEIPT" && (
              <div className="space-y-4">
                {/* 4 Kartu KPI / Status Penerimaan Barang Fisik */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setGrStatusFilter(prev => prev === "PENDING" ? "ALL" : "PENDING")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      grStatusFilter === "PENDING" ? "border-amber-400 bg-amber-50/50 ring-1 ring-amber-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">Menunggu Pemeriksaan Fisik</span>
                    <strong className="text-base text-amber-700 font-extrabold">
                      {requests.filter(r => r.requestType === "PURCHASE_REQUISITION" && !r.goodsReceipt).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Barang tiba, perlu audit BAST</span>
                  </div>

                  <div
                    onClick={() => setGrStatusFilter(prev => prev === "COMPLETED" ? "ALL" : "COMPLETED")}
                    className={`p-3 bg-white rounded-xl border transition cursor-pointer hover:shadow-xs ${
                      grStatusFilter === "COMPLETED" ? "border-emerald-400 bg-emerald-50/50 ring-1 ring-emerald-300" : "border-slate-200"
                    }`}
                  >
                    <span className="text-slate-500 block">BAST Lengkap &amp; Diterima</span>
                    <strong className="text-base text-emerald-700 font-extrabold">
                      {requests.filter(r => r.requestType === "PURCHASE_REQUISITION" && !!r.goodsReceipt).length} Dokumen
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Inspeksi fisik lolos uji</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Total Nilai Pengadaan PO</span>
                    <strong className="text-base text-slate-900 font-extrabold">
                      {formatRupiah(requests.filter(r => r.requestType === "PURCHASE_REQUISITION").reduce((acc, r) => acc + r.totalAmount, 0))}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Total pesanan material proyek</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Gudang Logistik &amp; Site</span>
                    <strong className="text-base text-slate-900 font-extrabold">
                      {requests.filter(r => r.requestType === "PURCHASE_REQUISITION").length} Pesanan PO
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Gudang Sentul &amp; Site Proyek</span>
                  </div>
                </div>

                {/* Tabel Penerimaan Barang Fisik */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Daftar Penerimaan Barang Fisik (Goods Receipt &amp; BAST Audit)</span>
                    </div>
                  </div>

                  {/* BAR FILTER LENGKAP & PENCARIAN */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={grSearchQuery}
                        onChange={(e) => setGrSearchQuery(e.target.value)}
                        placeholder="Cari no. PO, no. BAST, vendor, barang..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                      />
                      {grSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setGrSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Site / Gudang */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Site:</span>
                      <select
                        value={grUnit}
                        onChange={(e) => setGrUnit(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-amber-400 shadow-2xs"
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
                    </div>

                    {/* Filter Kategori PO */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Kategori:</span>
                      <select
                        value={grCategoryFilter}
                        onChange={(e) => setGrCategoryFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-amber-400 shadow-2xs max-w-[170px]"
                      >
                        <option value="ALL">Semua Kategori PO</option>
                        {EXPENSE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Status Fisik */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium shrink-0">Status:</span>
                      <select
                        value={grStatusFilter}
                        onChange={(e) => setGrStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-amber-400 shadow-2xs"
                      >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">Menunggu Pemeriksaan Fisik</option>
                        <option value="COMPLETED">BAST Lengkap &amp; Diterima</option>
                      </select>
                    </div>

                    {/* Tombol Reset Filter */}
                    {isGrFilterActive && (
                      <button
                        type="button"
                        onClick={handleResetGrFilters}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-xs transition cursor-pointer"
                        title="Reset semua filter"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    {/* Status Sort Aktif Indicator */}
                    {grSortField && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
                        <span>
                          Sort: <strong>{
                            grSortField === "docNumber" ? "No. PO & BAST" :
                            grSortField === "title" ? "Rincian Pengadaan" :
                            grSortField === "vendor" ? "Pemasok" :
                            grSortField === "unit" ? "Site / Gudang" :
                            grSortField === "amount" ? "Nilai PO" :
                            grSortField === "date" ? "Tanggal" : "Status Fisik"
                          }</strong> ({grSortOrder === "ASC" ? "A-Z / Naik" : "Z-A / Turun"})
                        </span>
                        <button
                          type="button"
                          onClick={() => { setGrSortField(null); setGrSortOrder(null); }}
                          className="ml-0.5 text-amber-600 hover:text-amber-900 cursor-pointer font-bold"
                          title="Hapus urutan"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 ml-auto shrink-0 font-mono">
                      Menampilkan <strong className="text-slate-700">{sortedGrRequests.length}</strong> dari {requests.filter(r => r.requestType === "PURCHASE_REQUISITION").length} data
                    </span>
                  </div>

                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("docNumber")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan No. PO & BAST"
                          >
                            <span>No. PO &amp; BAST</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "docNumber" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "docNumber" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("title")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Rincian Pengadaan"
                          >
                            <span>Rincian Pengadaan</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "title" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "title" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("vendor")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Pemasok"
                          >
                            <span>Pemasok &amp; Lokasi</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "vendor" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "vendor" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("unit")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group"
                            title="Urutkan berdasarkan Site / Divisi"
                          >
                            <span>Site / Divisi</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "unit" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "unit" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("amount")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group ml-auto"
                            title="Urutkan berdasarkan Nilai PO"
                          >
                            <span>Nilai PO</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "amount" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "amount" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleGrSort("status")}
                            className="inline-flex items-center gap-1.5 font-semibold hover:text-amber-700 transition cursor-pointer select-none group mx-auto"
                            title="Urutkan berdasarkan Status Pemeriksaan"
                          >
                            <span>Status Pemeriksaan</span>
                            <span className={`p-0.5 rounded transition ${grSortField === "status" ? "text-amber-700 bg-amber-100" : "text-slate-400 group-hover:text-slate-600"}`}>
                              {grSortField === "status" ? (
                                grSortOrder === "ASC" ? <ArrowUpNarrowWide className="w-3.5 h-3.5" /> : <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Aksi &amp; BAST</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {sortedGrRequests.map((req) => {
                        const isExpanded = expandedGrIds.includes(req.id);
                        const items = req.goodsReceipt?.items || (req.procurementItems || req.items).map((it: any) => ({
                          itemId: it.id,
                          itemName: it.itemName || it.description,
                          qtyOrdered: it.quantity,
                          qtyReceived: it.quantity,
                          unit: it.unit,
                          condition: "GOOD",
                          physicalAuditNotes: "Kondisi fisik segel lengkap sesuai PO."
                        }));

                        return (
                          <React.Fragment key={req.id}>
                            <tr className="hover:bg-slate-50/70 transition">
                              {/* No PO & BAST */}
                              <td className="px-4 py-3 font-mono">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailRequest(req)}
                                  className="font-bold text-slate-900 block hover:text-blue-600 hover:underline cursor-pointer text-left"
                                  title="Lihat Detail Pengajuan PO"
                                >
                                  {req.requestNumber}
                                </button>
                                {req.goodsReceipt ? (
                                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                                    {req.goodsReceipt.receiptNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-amber-600 font-medium italic block mt-0.5">
                                    Belum terbit BAST
                                  </span>
                                )}
                              </td>

                              {/* Rincian Pengadaan */}
                              <td className="px-4 py-3 max-w-[220px]">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailRequest(req)}
                                  className="font-bold text-slate-900 truncate block hover:text-blue-600 hover:underline cursor-pointer text-left max-w-full"
                                  title={req.title}
                                >
                                  {req.title}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleGrExpand(req.id)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-0.5 cursor-pointer"
                                >
                                  <span>{items.length} Item Material</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </td>

                              {/* Pemasok & Lokasi */}
                              <td className="px-4 py-3">
                                <div className="font-semibold text-slate-800 truncate max-w-[180px]">
                                  {req.goodsReceipt?.vendorName || req.vendorInfo?.vendorName || "PT. Schneider / Distributor"}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {req.goodsReceipt?.inspectionLocation || "Gudang Utama Sentul"}
                                </div>
                              </td>

                              {/* Site / Divisi */}
                              <td className="px-4 py-3 font-medium text-slate-800">
                                {req.unit}
                              </td>

                              {/* Nilai PO */}
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                                {formatRupiah(req.totalAmount)}
                              </td>

                              {/* Status Pemeriksaan */}
                              <td className="px-4 py-3 text-center">
                                {req.goodsReceipt ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>BAST Terbit</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                    <Clock className="w-3 h-3" />
                                    <span>Menunggu Audit Fisik</span>
                                  </span>
                                )}
                              </td>

                              {/* Aksi & BAST */}
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {req.goodsReceipt ? (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPrintModal(req, "GOODS_RECEIPT")}
                                      className="flex items-center gap-1 px-2.5 py-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                      title="Cetak Form Penerimaan Barang Fisik (BAST) Resmi"
                                    >
                                      <Printer className="w-3.5 h-3.5 text-amber-700" />
                                      <span>Cetak BAST</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleAuditGoodsReceipt(req.id)}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer shadow-xs"
                                    >
                                      <ClipboardCheck className="w-3.5 h-3.5" />
                                      <span>Audit Fisik &amp; BAST</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => toggleGrExpand(req.id)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                                    title={isExpanded ? "Sembunyikan checklist item" : "Lihat checklist item"}
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Accordion Rincian Checklist Fisik Barang */}
                            {isExpanded && (
                              <tr className="bg-amber-50/30">
                                <td colSpan={7} className="px-4 py-3 border-t border-b border-amber-200">
                                  <div className="bg-white rounded-lg border border-amber-200 p-3 shadow-2xs">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                        <Boxes className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Hasil Checklist Pemeriksaan Fisik Barang oleh Tim Audit</span>
                                      </span>
                                      <span className="text-[11px] text-slate-500 font-mono">
                                        Ref PO: {req.requestNumber}
                                      </span>
                                    </div>
                                    <table className="min-w-full text-xs text-left border border-slate-200">
                                      <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                          <th className="px-3 py-1.5 border-b border-slate-200 w-10 text-center">#</th>
                                          <th className="px-3 py-1.5 border-b border-slate-200">Nama Barang / Material Proyek</th>
                                          <th className="px-3 py-1.5 border-b border-slate-200 text-center w-24">Qty Dipesan</th>
                                          <th className="px-3 py-1.5 border-b border-slate-200 text-center w-24">Qty Fisik Tiba</th>
                                          <th className="px-3 py-1.5 border-b border-slate-200 text-center w-28">Kondisi Fisik</th>
                                          <th className="px-3 py-1.5 border-b border-slate-200">Catatan Verifikasi Audit</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {items.map((item: any, idx: number) => (
                                          <tr key={item.itemId || idx} className="hover:bg-slate-50/50">
                                            <td className="px-3 py-1.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                                            <td className="px-3 py-1.5 font-medium text-slate-900">{item.itemName}</td>
                                            <td className="px-3 py-1.5 text-center">{item.qtyOrdered} {item.unit}</td>
                                            <td className="px-3 py-1.5 text-center font-bold text-blue-700">{item.qtyReceived} {item.unit}</td>
                                            <td className="px-3 py-1.5 text-center">
                                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                                {item.condition === "GOOD" ? "BAIK / LENGKAP" : item.condition}
                                              </span>
                                            </td>
                                            <td className="px-3 py-1.5 text-slate-600 text-[11px]">{item.physicalAuditNotes}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
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
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>{editingRevisionRequestId ? "Perbaiki & Ajukan Ulang Pengajuan" : "Form Pengajuan"}</span>
                  {editingRevisionRequestId && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Mode Revisi
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingRevisionRequestId 
                    ? "Perbaiki data atau lampiran sesuai arahan reviewer, lalu kirim ulang ke Tim Audit." 
                    : "Pengajuan dana kas bon operasional, reimbursement, maupun pengadaan barang untuk Site & Divisi HO."}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRevisionRequestId(null);
                  setRevisionBannerNote(null);
                }} 
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Catatan Revisi jika dalam mode revisi */}
            {revisionBannerNote && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-amber-950 block">Catatan / Alasan Permintaan Revisi:</span>
                  <p className="mt-0.5 leading-relaxed text-amber-900 italic font-mono bg-white/70 p-2 rounded border border-amber-200 mt-1">
                    "{revisionBannerNote}"
                  </p>
                  <span className="text-[10px] text-amber-700 mt-1 block">
                    Silakan ubah formulir atau lampiran di bawah, kemudian klik <strong>Kirim Ulang ke Tim Audit</strong>.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
              {/* Row 1: Unit & Jenis Dokumen */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Site / Divisi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    required
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Pengajuan <span className="text-red-500">*</span>
                  </label>
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
                    required
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Pemohon, Tanggal Pengajuan, & Tanggal Jatuh Tempo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Pemohon (Requester) <span className="text-red-500">*</span>
                  </label>
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                    required
                  />
                </div>
              </div>

              {/* TABEL RINCIAN BARANG / ITEM — Accurate Style */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">
                    Rincian Barang / Jasa <span className="text-red-500">*</span>
                  </label>
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
                                placeholder="Nama barang/jasa (wajib)..."
                                className={`w-full border rounded px-1.5 py-1 focus:outline-none ${
                                  !item.description.trim() ? "border-amber-300 bg-amber-50/20 focus:border-amber-500" : "border-slate-200 focus:border-blue-400"
                                }`}
                                required
                              />
                            </td>
                            <td className="px-1 py-1">
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => updateRequestItem(item.id, "quantity", parseFloat(e.target.value) || 1)}
                                className="w-full border border-slate-200 rounded px-1 py-1 text-center focus:outline-none focus:border-blue-400"
                                required
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
                                min={1}
                                value={item.unitPrice || ""}
                                onChange={(e) => updateRequestItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className={`w-full border rounded px-1 py-1 text-right font-mono focus:outline-none ${
                                  item.unitPrice <= 0 ? "border-amber-300 bg-amber-50/20 focus:border-amber-500" : "border-slate-200 focus:border-blue-400"
                                }`}
                                required
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan / Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Tambahkan catatan atau keterangan pengajuan (wajib diisi)..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              {/* LAMPIRAN (FILE PDF, GAMBAR, / AMBIL FOTO KAMERA LANGSUNG) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lampiran Dokumen / Bukti Pendukung</span>
                    <span className="text-red-500 font-bold">*</span>
                    <span className="text-[10px] font-normal text-slate-400">(PDF, Gambar, atau Foto Kamera)</span>
                  </label>
                  {attachments.length === 0 ? (
                    <span className="text-[10px] font-mono font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Wajib lampirkan min. 1 berkas / foto
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {attachments.length} berkas terlampir
                    </span>
                  )}
                </div>

                {/* Input File Tersembunyi */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                {/* Tombol Aksi Upload Berkas & Foto Kamera */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium transition cursor-pointer text-xs shadow-2xs"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pilih Berkas (PDF / Foto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 font-semibold transition cursor-pointer text-xs shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ambil Foto Kamera</span>
                  </button>
                </div>

                {/* Daftar Preview Berkas Terlampir */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 max-h-48 overflow-y-auto">
                    {attachments.map((att) => {
                      const isImage = att.type.startsWith("image/");
                      const isPdf = att.type.includes("pdf");
                      return (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs group relative hover:border-blue-300 transition"
                        >
                          {/* Thumbnail / Icon */}
                          <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200">
                            {isImage ? (
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                                onClick={() => setSelectedPreviewAttachment(att)}
                              />
                            ) : isPdf ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : (
                              <Paperclip className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          {/* Info Nama & Ukuran */}
                          <div className="flex-1 min-w-0 pr-12">
                            <p className="text-[11px] font-semibold text-slate-800 truncate" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono">
                              {(att.size / 1024).toFixed(1)} KB &bull; {att.uploadedAt}
                            </p>
                          </div>

                          {/* Tombol Aksi Preview & Hapus */}
                          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                            {isImage ? (
                              <button
                                type="button"
                                onClick={() => setSelectedPreviewAttachment(att)}
                                className="p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                title="Lihat Foto"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <a
                                href={att.dataUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                                title="Buka PDF"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(att.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                              title="Hapus Lampiran"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Box Peringatan Kelengkapan Formulir jika ada kolom belum terisi */}
              {!isFormValid && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-[11px] text-amber-900">
                      Semua kolom wajib diisi lengkap termasuk lampiran agar tombol Kirim aktif:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {missingFields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100/90 border border-amber-300 text-[10px] font-medium text-amber-900"
                        >
                          ✕ {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                    disabled={!isFormValid}
                    className={`px-4 py-2 rounded-lg font-semibold transition shadow-xs flex items-center gap-1.5 ${
                      isFormValid
                        ? editingRevisionRequestId
                          ? "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                          : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-75"
                    }`}
                    title={!isFormValid ? `Lengkapi semua kolom: ${missingFields.join(", ")}` : "Kirim ke Tim Audit"}
                  >
                    {editingRevisionRequestId ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Kirim Ulang ke Tim Audit</span>
                      </>
                    ) : (
                      <span>Kirim ke Tim Audit (Step 1)</span>
                    )}
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

      {/* MODAL 5: PRATINJAU FOTO LAMPIRAN */}
      {selectedPreviewAttachment && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm truncate max-w-md">{selectedPreviewAttachment.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{(selectedPreviewAttachment.size / 1024).toFixed(1)} KB &bull; {selectedPreviewAttachment.uploadedAt}</span>
              </div>
              <button
                onClick={() => setSelectedPreviewAttachment(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2 border border-slate-200">
              <img
                src={selectedPreviewAttachment.dataUrl}
                alt={selectedPreviewAttachment.name}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="pt-3 flex justify-end gap-2">
              <a
                href={selectedPreviewAttachment.dataUrl}
                download={selectedPreviewAttachment.name}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Foto</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedPreviewAttachment(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: PENCAIRAN KAS & UPLOAD BUKTI TRANSFER (DISBURSEMENT MODAL) */}
      {isDisburseModalOpen && disburseTargetReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150 my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span>Pencairan Dana &amp; Lampirkan Bukti Transfer</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data transaksi kas/bank dan lampirkan bukti pembayaran resmi sebelum dana dilepaskan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDisburseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ringkasan Pengajuan yang Dicairkan */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl mb-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200/60 mb-2">
                <div>
                  <span className="font-mono font-bold text-emerald-950 text-xs block">{disburseTargetReq.requestNumber}</span>
                  <span className="text-[11px] text-emerald-800">{disburseTargetReq.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Nominal Pencairan:</span>
                  <span className="text-base font-black text-emerald-900 font-mono">
                    {formatRupiah(disburseTargetReq.totalAmount)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>Pemohon: <strong className="text-slate-800">{disburseTargetReq.requesterName}</strong> ({disburseTargetReq.unit})</div>
                <div>Kategori: <strong className="text-slate-800">{disburseTargetReq.category || "Operasional"}</strong></div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Sumber Rekening & Metode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sumber Kas / Bank <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={disburseSourceAccount}
                    onChange={(e) => setDisburseSourceAccount(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
                  >
                    <option value="Bank BCA Operasional (A/C: 731-0982-11)">Bank BCA Operasional (A/C: 731-0982-11)</option>
                    <option value="Bank Mandiri Operasional (A/C: 133-00-981240-8)">Bank Mandiri Operasional (A/C: 133-00-981240-8)</option>
                    <option value="Kas Kecil Lapangan (Petty Cash Operasional)">Kas Kecil Lapangan (Petty Cash Operasional)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Metode Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={disbursePaymentMethod}
                    onChange={(e) => setDisbursePaymentMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
                  >
                    <option value="TRANSFER_BANK">Transfer Bank / Online Banking</option>
                    <option value="CASH_KAS_KECIL">Tunai / Kas Kecil</option>
                  </select>
                </div>
              </div>

              {/* Tanggal & No Referensi Transaksi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={disburseDate}
                    onChange={(e) => setDisburseDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. Referensi / ID Transaksi Bank <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={disburseRefNumber}
                    onChange={(e) => setDisburseRefNumber(e.target.value)}
                    placeholder="Contoh: TRF-BCA-981240"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Catatan Finance */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Pencairan (Opsional)
                </label>
                <input
                  type="text"
                  value={disburseNotes}
                  onChange={(e) => setDisburseNotes(e.target.value)}
                  placeholder="Tambahkan keterangan jika diperlukan..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              {/* Upload Bukti Transfer (WAJIB) */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bukti Transfer / Struk Pembayaran Kas <span className="text-red-500">* (Wajib)</span></span>
                  </label>
                  {disburseProofAttachment ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ✓ Bukti Terunggah
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Wajib dilampirkan
                    </span>
                  )}
                </div>

                {/* Hidden File & Camera Inputs */}
                <input
                  type="file"
                  ref={disburseProofFileInputRef}
                  onChange={handleDisburseProofUpload}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={disburseProofCameraInputRef}
                  onChange={handleDisburseProofUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                {!disburseProofAttachment ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => disburseProofFileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium transition cursor-pointer text-xs shadow-2xs"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilih Foto Bukti Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => disburseProofCameraInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 hover:bg-emerald-100 font-semibold transition cursor-pointer text-xs shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Foto Kamera Struk</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between p-2.5 bg-white border border-emerald-300 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2.5 truncate">
                      {disburseProofAttachment.type.startsWith("image/") ? (
                        <img
                          src={disburseProofAttachment.dataUrl}
                          alt="Bukti Transfer"
                          className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-red-500 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 text-xs block truncate max-w-xs">
                          {disburseProofAttachment.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(disburseProofAttachment.size / 1024).toFixed(1)} KB &bull; {disburseProofAttachment.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedProofPreview(disburseProofAttachment)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                        title="Lihat Pratinjau Bukti"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisburseProofAttachment(null)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Hapus / Ganti Bukti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Setelah dicairkan, voucher BKK dapat dicetak langsung sebagai bukti resmi.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDisburseModalOpen(false)}
                    className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDisbursement}
                    disabled={!disburseProofAttachment}
                    className={`px-4 py-2 rounded-lg font-bold transition shadow-xs flex items-center gap-1.5 ${
                      disburseProofAttachment
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-75"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pencairan &amp; Cetak BKK</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: MINTA REVISI PENGAJUAN (REVISION MODAL) */}
      {isRevisionModalOpen && revisionTargetReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Kembalikan Pengajuan untuk Direvisi</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Pengajuan: <strong>{revisionTargetReq.requestNumber}</strong> &bull; {revisionTargetReq.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Tuliskan instruksi atau bagian yang perlu diperbaiki/dilengkapi oleh pemohon (misal: perbaikan deskripsi, kelengkapan surat penawaran vendor, revisi kuantitas, dll):
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Revisi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={revisionInputNote}
                  onChange={(e) => setRevisionInputNote(e.target.value)}
                  placeholder="Contoh: Mohon lampirkan rincian merk barang dan surat penawaran harga resmi dari vendor sebelum disetujui."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRevision}
                  disabled={!revisionInputNote.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold transition shadow-xs flex items-center gap-1.5 ${
                    revisionInputNote.trim()
                      ? "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-75"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permintaan Revisi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: TOLAK PENGAJUAN (REJECT MODAL) */}
      {isRejectModalOpen && rejectTargetReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-red-700 text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span>Tolak Pengajuan Anggaran</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Pengajuan: <strong>{rejectTargetReq.requestNumber}</strong> &bull; {rejectTargetReq.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Pengajuan yang ditolak tidak dapat diproses lebih lanjut. Mohon cantumkan alasan penolakan secara jelas:
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectInputReason}
                  onChange={(e) => setRejectInputReason(e.target.value)}
                  placeholder="Contoh: Pagu anggaran divisi telah melebihi batas atau pekerjaan belum disetujui direksi."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={!rejectInputReason.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold transition shadow-xs flex items-center gap-1.5 ${
                    rejectInputReason.trim()
                      ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-75"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tolak Pengajuan Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: ZOOM PRATINJAU BUKTI TRANSFER BANK */}
      {selectedProofPreview && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm truncate max-w-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bukti Transfer Resmi: {selectedProofPreview.name}</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(selectedProofPreview.size / 1024).toFixed(1)} KB &bull; Diunggah: {selectedProofPreview.uploadedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedProofPreview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[68vh] overflow-auto flex items-center justify-center bg-slate-950/5 rounded-xl p-3 border border-slate-200">
              {selectedProofPreview.type.startsWith("image/") ? (
                <img
                  src={selectedProofPreview.dataUrl}
                  alt={selectedProofPreview.name}
                  className="max-h-[64vh] max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-slate-700 block">Dokumen Berformat PDF</span>
                  <a
                    href={selectedProofPreview.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka PDF di Tab Baru</span>
                  </a>
                </div>
              )}
            </div>
            <div className="pt-3 flex justify-between items-center">
              <span className="text-[11px] text-emerald-700 font-medium">
                ✓ Bukti transfer sah tersimpan dalam voucher pencairan kas (BKK).
              </span>
              <div className="flex gap-2">
                <a
                  href={selectedProofPreview.dataUrl}
                  download={selectedProofPreview.name}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProofPreview(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: POP-UP DETAIL LENGKAP PENGAJUAN */}
      {selectedDetailRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header Modal Detail */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base font-mono">
                    {selectedDetailRequest.requestNumber}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedDetailRequest.requestType === "CASH_ADVANCE"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedDetailRequest.requestType === "CASH_ADVANCE" ? "Kas Bon Operasional" : "Pesanan Pembelian (PO)"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedDetailRequest.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kategori: <strong>{selectedDetailRequest.category || "Operasional"}</strong> &bull; Dibuat: {selectedDetailRequest.createdAt}
                  {selectedDetailRequest.dueDate && (
                    <> &bull; Jatuh Tempo: <span className="font-mono font-medium text-slate-700">{selectedDetailRequest.dueDate}</span></>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailRequest(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Status Approval */}
            <div className="mb-4">
              {selectedDetailRequest.status === "NEED_REVISION" && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold text-amber-950">Pengajuan Ini Perlu Direvisi:</strong>
                    <p className="mt-1 font-mono text-[11px] bg-white/70 p-2 rounded border border-amber-200 italic">
                      "{selectedDetailRequest.revisionNote || "Mohon perbaiki data pengajuan sesuai instruksi."}"
                    </p>
                  </div>
                </div>
              )}

              {selectedDetailRequest.status === "REJECTED" && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold text-red-950">Pengajuan Ditolak:</strong>
                    <p className="mt-1 font-mono text-[11px] bg-white/70 p-2 rounded border border-red-200 italic">
                      "{selectedDetailRequest.rejectedNote || "Pengajuan ini tidak disetujui reviewer."}"
                    </p>
                  </div>
                </div>
              )}

              {selectedDetailRequest.disbursement && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-bold text-emerald-900">Dana Telah Dicairkan oleh Finance:</strong>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-emerald-800">
                      <div>No. Voucher BKK: <strong className="font-mono text-emerald-950">{selectedDetailRequest.disbursement.voucherNumber}</strong></div>
                      <div>Tanggal Bayar: <strong className="font-mono text-emerald-950">{selectedDetailRequest.disbursement.disbursedAt}</strong></div>
                      <div>Rekening Sumber: <strong>{selectedDetailRequest.disbursement.sourceAccount}</strong></div>
                      <div>Ref Transaksi: <strong className="font-mono text-blue-900">{selectedDetailRequest.disbursement.transferReference}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Informasi Pokok Pengajuan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pemohon</span>
                <strong className="text-slate-900 block mt-0.5 truncate">{selectedDetailRequest.requesterName}</strong>
                <span className="text-[10px] text-slate-400 block truncate">{selectedDetailRequest.requesterRole}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Site / Divisi</span>
                <strong className="text-slate-900 block mt-0.5 truncate">{selectedDetailRequest.unit}</strong>
                <span className="text-[10px] text-slate-400 block truncate">{selectedDetailRequest.costCenterId}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status Saat Ini</span>
                <div className="mt-1">
                  {selectedDetailRequest.status === "PENDING_AUDIT" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Menunggu Audit</span>
                  )}
                  {selectedDetailRequest.status === "PENDING_PM" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">Menunggu PM</span>
                  )}
                  {selectedDetailRequest.status === "PENDING_GM" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">Menunggu GM</span>
                  )}
                  {selectedDetailRequest.status === "PENDING_DIRECTOR" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Menunggu Dirut</span>
                  )}
                  {selectedDetailRequest.status === "APPROVED_READY_PAY" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-400">Siap Dicairkan</span>
                  )}
                  {["DISBURSED", "COMPLETED"].includes(selectedDetailRequest.status) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Sudah Cair</span>
                  )}
                  {selectedDetailRequest.status === "NEED_REVISION" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">Perlu Revisi</span>
                  )}
                  {selectedDetailRequest.status === "REJECTED" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">Ditolak</span>
                  )}
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-right">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">Total Nominal</span>
                <strong className="text-base font-black text-emerald-950 font-mono block mt-0.5">
                  {formatRupiah(selectedDetailRequest.totalAmount)}
                </strong>
              </div>
            </div>

            {/* Catatan / Keterangan Keperluan */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Catatan / Keterangan Pengajuan:</span>
              <p className="text-slate-800 leading-relaxed">
                {selectedDetailRequest.purpose || selectedDetailRequest.title}
              </p>
            </div>

            {/* Rincian Barang / Jasa */}
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center justify-between">
                <span>Rincian Barang &amp; Jasa yang Diajukan</span>
                <span className="text-slate-400 font-mono text-[11px] font-normal">
                  {(selectedDetailRequest.items || []).length} Item
                </span>
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2 w-10 text-center">No</th>
                      <th className="px-3 py-2">Nama Barang / Uraian Jasa</th>
                      <th className="px-3 py-2 text-center w-16">Qty</th>
                      <th className="px-3 py-2 text-center w-16">Satuan</th>
                      <th className="px-3 py-2 text-right w-28">Harga Satuan</th>
                      <th className="px-3 py-2 text-right w-32">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(selectedDetailRequest.items && selectedDetailRequest.items.length > 0) ? (
                      selectedDetailRequest.items.map((it, idx) => (
                        <tr key={it.id || idx} className="hover:bg-slate-50/70">
                          <td className="px-3 py-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{it.description}</td>
                          <td className="px-3 py-2 text-center font-mono">{it.quantity}</td>
                          <td className="px-3 py-2 text-center text-slate-500">{it.unit}</td>
                          <td className="px-3 py-2 text-right font-mono">{formatRupiah(it.estimatedPrice)}</td>
                          <td className="px-3 py-2 text-right font-bold font-mono text-slate-900">{formatRupiah(it.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-3 text-center text-slate-400 italic">
                          Tidak ada rincian item.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="px-3 py-2 text-right text-slate-700">Total Pengajuan:</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-800 text-sm">
                        {formatRupiah(selectedDetailRequest.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Informasi Vendor / Rekening (Khusus PO / Pembelian) */}
            {selectedDetailRequest.vendorInfo && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-xs mb-4">
                <span className="text-[10px] text-blue-800 uppercase font-bold block mb-1.5">Informasi Vendor &amp; Rekening Pembayaran:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>Nama Vendor: <strong className="text-slate-900">{selectedDetailRequest.vendorInfo.vendorName}</strong></div>
                  <div>Syarat Bayar: <strong>{selectedDetailRequest.vendorInfo.paymentTerms || "Net 30"}</strong></div>
                  <div>Bank: <strong>{selectedDetailRequest.vendorInfo.bankName}</strong></div>
                  <div>No. Rekening: <strong className="font-mono text-blue-900">{selectedDetailRequest.vendorInfo.bankAccountNumber}</strong> (a.n. {selectedDetailRequest.vendorInfo.bankAccountName})</div>
                  <div className="col-span-2">Alamat Pengiriman: <span className="text-slate-600">{selectedDetailRequest.vendorInfo.shippingAddress}</span></div>
                </div>
              </div>
            )}

            {/* Lampiran Dokumen Pemohon */}
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                <span>Lampiran Dokumen / Bukti Pendukung ({(selectedDetailRequest.attachments || []).length})</span>
              </h4>
              {selectedDetailRequest.attachments && selectedDetailRequest.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedDetailRequest.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {att.type.startsWith("image/") ? (
                          <img
                            src={att.dataUrl}
                            alt={att.name}
                            className="w-8 h-8 object-cover rounded border border-slate-200 shrink-0 cursor-pointer"
                            onClick={() => setSelectedPreviewAttachment(att)}
                          />
                        ) : (
                          <FileText className="w-6 h-6 text-red-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 block truncate text-[11px]">{att.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{(att.size / 1024).toFixed(1)} KB &bull; {att.uploadedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {att.type.startsWith("image/") ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPreviewAttachment(att)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Lihat Pratinjau Foto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <a
                            href={att.dataUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Buka PDF"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-xs italic text-center">
                  Tidak ada lampiran dokumen atau foto pendukung.
                </div>
              )}
            </div>

            {/* Bukti Transfer Pencairan oleh Finance jika ada */}
            {selectedDetailRequest.disbursement?.proofAttachment && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl text-xs mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Bukti Transfer / Pembayaran oleh Finance:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProofPreview(selectedDetailRequest.disbursement?.proofAttachment || null)}
                    className="text-[10px] text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                  >
                    Buka Ukuran Penuh
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {selectedDetailRequest.disbursement.proofAttachment.type.startsWith("image/") ? (
                    <img
                      src={selectedDetailRequest.disbursement.proofAttachment.dataUrl}
                      alt="Bukti Transfer"
                      className="w-14 h-14 object-cover rounded border border-emerald-200 shrink-0 cursor-pointer shadow-2xs"
                      onClick={() => setSelectedProofPreview(selectedDetailRequest.disbursement?.proofAttachment || null)}
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-red-500 shrink-0" />
                  )}
                  <div className="text-[11px] text-slate-700">
                    <span className="font-bold text-slate-900 block">{selectedDetailRequest.disbursement.proofAttachment.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Ref: {selectedDetailRequest.disbursement.transferReference} &bull; {(selectedDetailRequest.disbursement.proofAttachment.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Aksi di Bawah Modal */}
            <div className="pt-3 flex justify-between items-center border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const req = selectedDetailRequest;
                    handleOpenPrintModal(req, "REQUEST");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Form Pengajuan (A4)</span>
                </button>

                {selectedDetailRequest.disbursement && (
                  <button
                    type="button"
                    onClick={() => {
                      const req = selectedDetailRequest;
                      handleOpenPrintModal(req, "DISBURSEMENT");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cetak Voucher BKK</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedDetailRequest.status === "NEED_REVISION" && (
                  <button
                    type="button"
                    onClick={() => {
                      const req = selectedDetailRequest;
                      setSelectedDetailRequest(null);
                      handleEditForRevision(req);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit &amp; Ajukan Ulang</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDetailRequest(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 11: FORM INPUT LAPORAN REALISASI & LPJ NOTA BELANJA */}
      {isInputLPJModalOpen && lpjTargetReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Formulir Pertanggungjawaban (LPJ) &amp; Nota Lapangan
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Laporan Realisasi Kasbon: {lpjTargetReq.requestNumber}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lpjTargetReq.title} &bull; Pemohon: <span className="font-semibold text-slate-700">{lpjTargetReq.requesterName}</span> ({lpjTargetReq.unit})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInputLPJModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Dana Kasbon Diterima vs Realisasi Riil */}
            {(() => {
              const advance = lpjTargetReq.disbursement?.amountPaid || lpjTargetReq.totalAmount;
              const totalRealized = lpjReceiptItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
              const diff = advance - totalRealized;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-purple-50/60 border border-purple-200 rounded-xl mb-4 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Kasbon Diterima</span>
                    <strong className="text-base font-bold text-slate-800 font-mono">
                      {formatRupiah(advance)}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Realisasi Riil (Nota)</span>
                    <strong className="text-base font-bold text-purple-900 font-mono">
                      {formatRupiah(totalRealized)}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      {diff === 0 ? "Status Saldo" : diff > 0 ? "Sisa Lebih (Setor Kasir)" : "Kekurangan (Reimburse)"}
                    </span>
                    <strong className={`text-base font-bold font-mono ${diff === 0 ? "text-slate-700" : diff > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {diff === 0 ? "Rp 0 (Pas)" : formatRupiah(Math.abs(diff))}
                    </strong>
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleSubmitNewLPJ} className="space-y-4">
              {/* Tabel Bukti Fisik Nota / Kwitansi */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Daftar Bukti Pengeluaran Riil (Nota / Kwitansi)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLpjItem}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Nota</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 font-semibold text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-center w-8">#</th>
                        <th className="px-3 py-2 text-left w-28">Tgl Nota</th>
                        <th className="px-3 py-2 text-left">Uraian Pembelian / Pengeluaran</th>
                        <th className="px-3 py-2 text-left w-36">Toko / Vendor</th>
                        <th className="px-3 py-2 text-left w-28">No. Nota</th>
                        <th className="px-3 py-2 text-right w-36">Nominal (Rp)</th>
                        <th className="px-2 py-2 text-center w-10">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lpjReceiptItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="px-3 py-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-2 py-1.5">
                            <input
                              type="date"
                              value={item.receiptDate}
                              onChange={(e) => handleLpjItemChange(item.id, "receiptDate", e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                              required
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleLpjItemChange(item.id, "description", e.target.value)}
                              placeholder="Contoh: BBM Mobil Tangga Sentul"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                              required
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={item.vendor}
                              onChange={(e) => handleLpjItemChange(item.id, "vendor", e.target.value)}
                              placeholder="Nama Toko / SPBU"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="text"
                              value={item.receiptNumber}
                              onChange={(e) => handleLpjItemChange(item.id, "receiptNumber", e.target.value)}
                              placeholder="No. Struk"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              type="number"
                              min="0"
                              value={item.amount || ""}
                              onChange={(e) => handleLpjItemChange(item.id, "amount", Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white text-right font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              required
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLpjItem(item.id)}
                              disabled={lpjReceiptItems.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition cursor-pointer"
                              title="Hapus baris nota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right text-slate-700">Total Pengeluaran Riil (Nota):</td>
                        <td className="px-3 py-2 text-right font-mono text-purple-950 text-sm">
                          {formatRupiah(lpjReceiptItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0))}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Upload Foto Fisik Struk / Nota */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-600" />
                    <span>Upload Foto Struk / Nota Fisik (Audit Trail)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => lpjFileInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Pilih File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => lpjCameraInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-purple-600" />
                      <span>Foto Kamera</span>
                    </button>
                    <input
                      ref={lpjFileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      className="hidden"
                      onChange={handleLpjFileUpload}
                    />
                    <input
                      ref={lpjCameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleLpjFileUpload}
                    />
                  </div>
                </div>

                {lpjAttachments.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {lpjAttachments.map((att, idx) => (
                      <div key={att.id || idx} className="relative group border border-slate-300 rounded-lg overflow-hidden bg-white p-1 text-center">
                        {att.type.startsWith("image/") ? (
                          <img src={att.dataUrl} alt={att.name} className="w-full h-16 object-cover rounded" />
                        ) : (
                          <div className="w-full h-16 flex items-center justify-center bg-slate-100 rounded text-slate-400">
                            <FileText className="w-8 h-8 text-red-500" />
                          </div>
                        )}
                        <span className="block text-[10px] text-slate-700 truncate mt-1 px-1 font-medium">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => setLpjAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-xs"
                          title="Hapus foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">
                    Belum ada foto nota yang diunggah. Foto nota dapat disertakan untuk verifikasi fisik tim audit.
                  </p>
                )}
              </div>

              {/* Catatan Pelapor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Keterangan Lapangan / Penjelasan Penggunaan Dana:
                </label>
                <textarea
                  value={lpjGeneralNotes}
                  onChange={(e) => setLpjGeneralNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Keterangan tambahan kendala lapangan atau rincian pelaksanaan..."
                />
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsInputLPJModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Laporan LPJ ke Tim Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 12: KONFIRMASI PENERIMAAN SETORAN SISA KASBON (REFUND TO CASHIER) */}
      {isRefundModalOpen && refundTargetReq && refundTargetReq.realization && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Kasir &bull; Penerimaan Kas Masuk (BKM)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Terima Setoran Sisa Kasbon
                </h3>
                <p className="text-xs text-slate-500">
                  No. LPJ: <span className="font-mono font-semibold text-purple-700">{refundTargetReq.realization.lpjNumber}</span> &bull; {refundTargetReq.requestNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl mb-4 text-center">
              <span className="text-xs text-emerald-800 font-semibold block">Nominal Sisa Kasbon yang Disetorkan:</span>
              <strong className="text-2xl font-black text-emerald-900 font-mono block my-1">
                {formatRupiah(refundTargetReq.realization.balanceDifference)}
              </strong>
              <span className="text-[11px] text-emerald-700">
                Disetorkan oleh: <span className="font-bold">{refundTargetReq.requesterName}</span> ({refundTargetReq.unit})
              </span>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Metode Penyetoran:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundMethod("CASH")}
                    className={`p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                      refundMethod === "CASH" 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" 
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    💵 Tunai (Kasir Fisik)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundMethod("TRANSFER")}
                    className={`p-2.5 rounded-lg border text-center font-bold transition cursor-pointer ${
                      refundMethod === "TRANSFER" 
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" 
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    🏦 Transfer Bank PT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">No. Bukti Kas Masuk (BKM):</label>
                <input
                  type="text"
                  value={refundReceiptNo}
                  onChange={(e) => setRefundReceiptNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
                  placeholder="BKM-2026-..."
                  required
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] leading-relaxed">
                ℹ️ Dengan mengonfirmasi penerimaan kas ini, saldo pengembalian kasbon masuk ke pembukuan kas perusahaan dan status LPJ menjadi <strong className="text-emerald-700 font-bold">Lunas &amp; Selesai</strong>.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRefund}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Terima Kas &amp; Selesaikan LPJ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 13: POP-UP DETAIL LENGKAP LPJ & BUKTI NOTA */}
      {selectedDetailLPJ && selectedDetailLPJ.realization && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto">
            {/* Header Modal Detail LPJ */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Detail Pertanggungjawaban (LPJ)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Ref Kasbon: {selectedDetailLPJ.requestNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-purple-700" />
                  <span>{selectedDetailLPJ.realization.lpjNumber}</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedDetailLPJ.title} &bull; Pemohon: <span className="font-semibold text-slate-800">{selectedDetailLPJ.requesterName}</span> ({selectedDetailLPJ.unit})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailLPJ(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kartu Status Rekonsiliasi & Perbandingan */}
            {(() => {
              const advance = selectedDetailLPJ.realization.initialAdvanceAmount;
              const actual = selectedDetailLPJ.realization.totalRealizedAmount;
              const diff = selectedDetailLPJ.realization.balanceDifference;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-purple-50/50 border border-purple-200 rounded-xl mb-4 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Kasbon Diterima</span>
                    <strong className="text-sm font-bold text-slate-800 font-mono">
                      {formatRupiah(advance)}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Realisasi Riil</span>
                    <strong className="text-sm font-bold text-purple-900 font-mono">
                      {formatRupiah(actual)}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      {diff === 0 ? "Saldo Sisa" : diff > 0 ? "Sisa Lebih (Disetor)" : "Kekurangan (Reimburse)"}
                    </span>
                    <strong className={`text-sm font-bold font-mono ${diff === 0 ? "text-slate-700" : diff > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {diff === 0 ? "Rp 0 (Pas)" : formatRupiah(Math.abs(diff))}
                    </strong>
                  </div>
                </div>
              );
            })()}

            {/* Status Approval LPJ Single Badge & Audit Trail */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status Persetujuan LPJ Saat Ini:</span>
                <div>
                  {selectedDetailLPJ.realization.status === "PENDING_AUDIT" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Menunggu Verifikasi Tim Audit
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "PENDING_PM" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                      Menunggu Persetujuan Project Manager
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "PENDING_GM" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                      Menunggu Persetujuan General Manager
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "PENDING_DIRECTOR" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                      Menunggu Persetujuan Direktur Utama (&gt; Rp 5 Jt)
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "PENDING_FINANCE_SETTLEMENT" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-400">
                      Siap Rekonsiliasi &amp; Penyelesaian Kasir Finance
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "WAITING_REIMBURSEMENT" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-400">
                      Menunggu Pencairan Reimbursement ({selectedDetailLPJ.realization.reimbursementRequestNumber})
                    </span>
                  )}
                  {selectedDetailLPJ.realization.status === "COMPLETED" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      ✓ Lunas &amp; Selesai
                    </span>
                  )}
                </div>
              </div>

              {/* Catatan Verifikasi Berjenjang */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-700">
                {selectedDetailLPJ.realization.auditNotes && (
                  <div><span className="font-bold text-blue-800">Uji Fisik Audit:</span> {selectedDetailLPJ.realization.auditNotes}</div>
                )}
                {selectedDetailLPJ.realization.pmNotes && (
                  <div><span className="font-bold text-sky-800">Catatan PM:</span> {selectedDetailLPJ.realization.pmNotes}</div>
                )}
                {selectedDetailLPJ.realization.gmNotes && (
                  <div><span className="font-bold text-purple-800">Catatan GM:</span> {selectedDetailLPJ.realization.gmNotes}</div>
                )}
                {selectedDetailLPJ.realization.directorNotes && (
                  <div><span className="font-bold text-indigo-800">Otorisasi Dirut:</span> {selectedDetailLPJ.realization.directorNotes}</div>
                )}
                {selectedDetailLPJ.realization.financeNotes && (
                  <div><span className="font-bold text-emerald-800">Catatan Kasir / Finance:</span> {selectedDetailLPJ.realization.financeNotes}</div>
                )}
              </div>
            </div>

            {/* Rincian Nota & Pengeluaran */}
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase mb-2">Rincian Nota &amp; Struk Belanja</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                  <thead className="bg-slate-50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-center w-8">No</th>
                      <th className="px-3 py-2 w-24">Tgl Nota</th>
                      <th className="px-3 py-2">Uraian Barang / Jasa</th>
                      <th className="px-3 py-2 w-32">Toko / Vendor</th>
                      <th className="px-3 py-2 w-24">No. Struk</th>
                      <th className="px-3 py-2 text-right w-28">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(selectedDetailLPJ.realization.items || []).map((it, idx) => (
                      <tr key={it.id || idx} className="hover:bg-slate-50/70">
                        <td className="px-3 py-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-3 py-2 text-slate-500">{it.receiptDate}</td>
                        <td className="px-3 py-2 font-medium text-slate-800">{it.description}</td>
                        <td className="px-3 py-2 text-slate-600">{it.vendor || "-"}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{it.receiptNumber || "-"}</td>
                        <td className="px-3 py-2 text-right font-bold font-mono text-slate-900">{formatRupiah(it.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="px-3 py-2 text-right text-slate-700">Total Realisasi Nota:</td>
                      <td className="px-3 py-2 text-right font-mono text-purple-950 text-sm">
                        {formatRupiah(selectedDetailLPJ.realization.totalRealizedAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Lampiran Foto Nota / Struk Fisik */}
            {selectedDetailLPJ.realization.receiptAttachments && selectedDetailLPJ.realization.receiptAttachments.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Lampiran Bukti Foto Nota Fisik:</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {selectedDetailLPJ.realization.receiptAttachments.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      onClick={() => setSelectedProofPreview(att)}
                      className="border border-slate-200 rounded-lg p-1 bg-white hover:border-purple-300 transition cursor-pointer text-center"
                    >
                      {att.type.startsWith("image/") ? (
                        <img src={att.dataUrl} alt={att.name} className="w-full h-16 object-cover rounded" />
                      ) : (
                        <div className="w-full h-16 flex items-center justify-center bg-slate-100 rounded">
                          <FileText className="w-8 h-8 text-red-500" />
                        </div>
                      )}
                      <span className="block text-[10px] text-slate-700 truncate mt-1 font-medium">{att.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Aksi di Bawah Modal */}
            <div className="pt-3 flex justify-between items-center border-t border-slate-100 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const req = selectedDetailLPJ;
                  handleOpenPrintModal(req, "REALIZATION");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-purple-700" />
                <span>Cetak Formulir LPJ (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDetailLPJ(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
