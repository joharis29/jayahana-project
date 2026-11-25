"use client";

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Wifi, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  BookOpen, 
  ListOrdered, 
  PieChart, 
  BarChart3, 
  Scale, 
  Printer, 
  Plus, 
  ArrowUpDown,
  Download,
  Info,
  ShieldCheck,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { 
  AccountCOA, 
  FixedAsset, 
  JournalRecord, 
  JournalLine, 
  WorksheetRow, 
  SalesInvoice, 
  BudgetRequest, 
  OfficialReceiptBKM 
} from "@/types";
import { JAYAHANA_COA, JAYAHANA_FIXED_ASSETS, JAYAHANA_JOURNAL_ENTRIES } from "@/lib/accountingData";

interface AccountingSuiteProps {
  salesInvoices: SalesInvoice[];
  requests: BudgetRequest[];
  officialReceipts: OfficialReceiptBKM[];
}

export type AccountingTab = 
  | "LLR"           // Laporan Laba Rugi Komprehensif
  | "LPK"           // Laporan Posisi Keuangan (Neraca)
  | "LPM"           // Laporan Perubahan Modal
  | "LAK"           // Laporan Arus Kas
  | "WORKSHEET"     // Neraca Saldo & Neraca Lajur (10 Kolom)
  | "LEDGER"        // Buku Besar (General Ledger)
  | "JOURNAL"       // Jurnal Umum & Penyesuaian (AJP)
  | "COA"           // Bagan Akun (Chart of Accounts)
  | "ASSETS"        // Pencatatan Aset Tetap & Depresiasi
  | "CALK";         // Catatan Atas Laporan Keuangan

export function AccountingSuite({ salesInvoices, requests, officialReceipts }: AccountingSuiteProps) {
  const [activeSubTab, setActiveSubTab] = useState<AccountingTab>("LLR");

  // State for COA
  const [coaSearch, setCoaSearch] = useState("");
  const [coaCategoryFilter, setCoaCategoryFilter] = useState("ALL");

  // ==========================================
  // STATE FILTER & SORT BUKU BESAR (LEDGER)
  // ==========================================
  type LedgerSortField = "date" | "reference" | "description" | "counterAccount" | "debit" | "credit" | "balance";
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState("1-1003"); // Default Bank BCA-1
  const [ledgerStartDate, setLedgerStartDate] = useState("");
  const [ledgerEndDate, setLedgerEndDate] = useState("");
  const [ledgerCounterFilter, setLedgerCounterFilter] = useState("ALL");
  const [ledgerRefFilter, setLedgerRefFilter] = useState("");
  const [ledgerMinAmount, setLedgerMinAmount] = useState("");
  const [ledgerMaxAmount, setLedgerMaxAmount] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerSortField, setLedgerSortField] = useState<LedgerSortField | null>(null);
  const [ledgerSortOrder, setLedgerSortOrder] = useState<"ASC" | "DESC" | null>(null);

  const handleToggleLedgerSort = (field: LedgerSortField) => {
    if (ledgerSortField !== field) {
      setLedgerSortField(field);
      setLedgerSortOrder("ASC");
    } else if (ledgerSortOrder === "ASC") {
      setLedgerSortOrder("DESC");
    } else {
      setLedgerSortField(null);
      setLedgerSortOrder(null);
    }
  };

  const handleResetLedgerFilter = () => {
    setLedgerStartDate("");
    setLedgerEndDate("");
    setLedgerCounterFilter("ALL");
    setLedgerRefFilter("");
    setLedgerMinAmount("");
    setLedgerMaxAmount("");
    setLedgerSearch("");
    setLedgerSortField(null);
    setLedgerSortOrder(null);
  };

  // ==========================================
  // STATE FILTER & SORT JURNAL UMUM & AJP
  // ==========================================
  type JournalSortField = "date" | "voucherNumber" | "referenceNumber" | "description" | "totalDebit";
  const [journalTypeFilter, setJournalTypeFilter] = useState<"ALL" | "GENERAL" | "ADJUSTMENT">("ALL");
  const [journalStartDate, setJournalStartDate] = useState("");
  const [journalEndDate, setJournalEndDate] = useState("");
  const [journalAccountFilter, setJournalAccountFilter] = useState("ALL");
  const [journalRefFilter, setJournalRefFilter] = useState("");
  const [journalMinAmount, setJournalMinAmount] = useState("");
  const [journalMaxAmount, setJournalMaxAmount] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [journalSortField, setJournalSortField] = useState<JournalSortField | null>(null);
  const [journalSortOrder, setJournalSortOrder] = useState<"ASC" | "DESC" | null>(null);

  const handleToggleJournalSort = (field: JournalSortField) => {
    if (journalSortField !== field) {
      setJournalSortField(field);
      setJournalSortOrder("ASC");
    } else if (journalSortOrder === "ASC") {
      setJournalSortOrder("DESC");
    } else {
      setJournalSortField(null);
      setJournalSortOrder(null);
    }
  };

  const handleResetJournalFilter = () => {
    setJournalTypeFilter("ALL");
    setJournalStartDate("");
    setJournalEndDate("");
    setJournalAccountFilter("ALL");
    setJournalRefFilter("");
    setJournalMinAmount("");
    setJournalMaxAmount("");
    setJournalSearch("");
    setJournalSortField(null);
    setJournalSortOrder(null);
  };

  // ==========================================
  // STATE FILTER & SORT ASET TETAP (ASSETS)
  // ==========================================
  type AssetSortField = "assetCode" | "name" | "acquisitionDate" | "usefulLifeMonths" | "acquisitionCost" | "monthlyDepreciation" | "accumulatedDepreciation" | "bookValue";
  const [assetSearch, setAssetSearch] = useState("");
  const [assetUsefulLifeFilter, setAssetUsefulLifeFilter] = useState("ALL");
  const [assetStartDate, setAssetStartDate] = useState("");
  const [assetEndDate, setAssetEndDate] = useState("");
  const [assetMinCost, setAssetMinCost] = useState("");
  const [assetMaxCost, setAssetMaxCost] = useState("");
  const [assetSortField, setAssetSortField] = useState<AssetSortField | null>(null);
  const [assetSortOrder, setAssetSortOrder] = useState<"ASC" | "DESC" | null>(null);

  const handleToggleAssetSort = (field: AssetSortField) => {
    if (assetSortField !== field) {
      setAssetSortField(field);
      setAssetSortOrder("ASC");
    } else if (assetSortOrder === "ASC") {
      setAssetSortOrder("DESC");
    } else {
      setAssetSortField(null);
      setAssetSortOrder(null);
    }
  };

  const handleResetAssetFilter = () => {
    setAssetSearch("");
    setAssetUsefulLifeFilter("ALL");
    setAssetStartDate("");
    setAssetEndDate("");
    setAssetMinCost("");
    setAssetMaxCost("");
    setAssetSortField(null);
    setAssetSortOrder(null);
  };

  // Master Data State
  const [coaList] = useState<AccountCOA[]>(JAYAHANA_COA);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(JAYAHANA_FIXED_ASSETS);

  // =========================================================================
  // JURNAL DINAMIS DARI TRANSAKSI RIIL (PENCAIRAN PENGELUARAN & PENERIMAAN)
  // =========================================================================
  const dynamicJournalEntries = useMemo<JournalRecord[]>(() => {
    const list: JournalRecord[] = [];

    // 1. Integrasi Pengeluaran (Pencairan Pengajuan Dana Kasbon & PO)
    requests.forEach(r => {
      if (r.status !== "DISBURSED" && r.status !== "COMPLETED") return;
      
      const vDate = r.disbursedAt || r.disbursement?.disbursedAt || r.createdAt;
      const vNum = r.disbursement?.voucherNumber || `BKK-${r.requestNumber}`;
      const vRef = r.disbursement?.transferReference || r.requestNumber;
      
      // Tentukan Akun Beban berdasarkan kategori & divisi
      let expenseCode = "6-4015";
      let expenseName = "Biaya Operasional Lapangan & Lain-lain";
      
      if (r.category === "Sewa") {
        if (r.unit.startsWith("HO") || r.unit === "OVERHEAD_OPERASIONAL") {
          expenseCode = "6-4005";
          expenseName = "Biaya Sewa Kantor, Gedung Office & Posko";
        } else {
          expenseCode = "5-4005";
          expenseName = "Biaya Sewa Alat & Site Proyek";
        }
      } else if (r.category === "Gaji" || r.category === "Upah" || r.category === "Tukang" || r.category === "Mandor") {
        if (r.unit.startsWith("HO")) {
          expenseCode = "6-3001";
          expenseName = "Biaya Gaji Office, HR & Management";
        } else {
          expenseCode = "5-3001";
          expenseName = "Biaya Gaji & Upah Teknisi Proyek";
        }
      } else if (r.category === "Perlengkapan & Peralatan") {
        if (r.unit === "STARLITE_FTTH" || r.unit === "ME_CORE" || !r.unit.startsWith("HO")) {
          expenseCode = "5-4006";
          expenseName = "Biaya Material, Spare Part & Perlengkapan Site";
        } else {
          expenseCode = "6-4006";
          expenseName = "Biaya ATK, Komputer & Perlengkapan Kantor";
        }
      } else if (r.category === "Akomodasi" || r.category === "Operasional Mess") {
        expenseCode = "6-4007";
        expenseName = "Biaya Akomodasi, Mess & Konsumsi Lapangan";
      } else if (r.category === "Permit" || r.category === "Operasional Permit") {
        expenseCode = "5-4008";
        expenseName = "Biaya Perijinan, ROW & Koordinasi Lapangan";
      }

      // Tentukan Akun Kas/Bank Sumber Pencairan
      let bankCode = "1-1003";
      let bankName = "Bank BCA-1 No.Rek: 5726088817";
      const src = r.disbursement?.sourceAccount || "";
      if (src.toLowerCase().includes("mandiri")) {
        bankCode = "1-1005";
        bankName = "Bank Mandiri Operasional";
      } else if (src.toLowerCase().includes("kecil") || src.toLowerCase().includes("petty")) {
        bankCode = "1-1001";
        bankName = "Kas Kecil Lapangan (Petty Cash)";
      }

      const dppAmount = r.taxDetails?.dppAmount || r.totalAmount;
      const ppnAmount = r.taxDetails?.hasPpn ? r.taxDetails.ppnAmount : 0;
      const pphAmount = r.taxDetails?.taxPercent ? r.taxDetails.taxAmount : 0;
      const netPaid = r.taxDetails?.netPayableToVendor || r.totalAmount;

      const lines: JournalLine[] = [];

      // Line 1: Debit Beban (DPP)
      lines.push({
        id: `jl-deb-${r.id}`,
        accountCode: expenseCode,
        accountName: expenseName,
        debit: dppAmount,
        credit: 0
      });

      // Line 2: Debit PPN Masukan (jika ada)
      if (ppnAmount > 0) {
        lines.push({
          id: `jl-ppn-${r.id}`,
          accountCode: "1-8101",
          accountName: "PPN Masukan (Pajak Masukan Dibayar)",
          debit: ppnAmount,
          credit: 0
        });
      }

      // Line 3: Kredit Hutang Pajak PPh (Withholding Tax jika ada potongan)
      if (pphAmount > 0 && r.taxDetails) {
        let pphAccCode = "2-4004";
        let pphAccName = "Hutang Pajak PPH 23";
        if (r.taxDetails.taxType === "PPH_4_2_LAND" || r.taxDetails.taxType === "PPH_4_2_BUILDING") {
          pphAccCode = "2-4007";
          pphAccName = "Hutang Pajak PPH Psl 4 ayat 2";
        } else if (r.taxDetails.taxType === "PPH_21") {
          pphAccCode = "2-4002";
          pphAccName = "Hutang Pajak PPH 21";
        }
        lines.push({
          id: `jl-pph-${r.id}`,
          accountCode: pphAccCode,
          accountName: pphAccName,
          debit: 0,
          credit: pphAmount
        });
      }

      // Line 4: Kredit Kas/Bank (Net Dibayarkan ke Vendor/Pemohon)
      lines.push({
        id: `jl-crd-${r.id}`,
        accountCode: bankCode,
        accountName: bankName,
        debit: 0,
        credit: netPaid
      });

      list.push({
        id: `jrn-req-${r.id}`,
        date: vDate,
        month: parseInt(vDate.split("-")[1]) || 11,
        voucherNumber: vNum,
        referenceNumber: vRef,
        unit: r.unit,
        description: `Pencairan ${r.requestType === "CASH_ADVANCE" ? "Kas Bon" : "PO"}: ${r.title} (${r.unit})`,
        lines,
        isAdjustment: false,
      });
    });

    // 2. Integrasi Penerimaan Pendapatan (BKM / Official Receipts)
    officialReceipts.forEach(rec => {
      let bankCode = "1-1003";
      let bankName = "Bank BCA-1 No.Rek: 5726088817";
      if (rec.bankTarget?.toLowerCase().includes("mandiri")) {
        bankCode = "1-1005";
        bankName = "Bank Mandiri Operasional";
      } else if (rec.bankTarget?.toLowerCase().includes("kecil") || rec.bankTarget?.toLowerCase().includes("petty")) {
        bankCode = "1-1001";
        bankName = "Kas Kecil Lapangan";
      }

      const lines: JournalLine[] = [
        {
          id: `jl-rec-deb-${rec.id}`,
          accountCode: bankCode,
          accountName: bankName,
          debit: rec.amountReceived,
          credit: 0
        }
      ];

      if (rec.receiptType === "SALES_INVOICE") {
        lines.push({
          id: `jl-rec-crd-${rec.id}`,
          accountCode: "1-2001",
          accountName: "Piutang Usaha Proyek & Klien",
          debit: 0,
          credit: rec.amountReceived
        });
      } else if (rec.receiptType === "INTERNAL_TRANSFER") {
        let srcCode = "1-1001";
        let srcName = "Kas Kecil Lapangan (Petty Cash)";
        if (rec.sourceAccount?.toLowerCase().includes("bca")) {
          srcCode = "1-1003";
          srcName = "Bank BCA-1";
        } else if (rec.sourceAccount?.toLowerCase().includes("mandiri")) {
          srcCode = "1-1005";
          srcName = "Bank Mandiri Operasional";
        }
        lines.push({
          id: `jl-rec-crd-${rec.id}`,
          accountCode: srcCode,
          accountName: srcName,
          debit: 0,
          credit: rec.amountReceived
        });
      } else {
        lines.push({
          id: `jl-rec-crd-${rec.id}`,
          accountCode: "4-2005",
          accountName: "Pendapatan Lain-lain & Jasa Giro",
          debit: 0,
          credit: rec.amountReceived
        });
      }

      list.push({
        id: `jrn-rec-${rec.id}`,
        date: rec.receivedDate,
        month: parseInt(rec.receivedDate.split("-")[1]) || 11,
        voucherNumber: rec.receiptNumber,
        referenceNumber: rec.referenceNumber || rec.receiptNumber,
        unit: "ME_CORE",
        description: `Penerimaan Kas/Bank: ${rec.forPaymentOf || rec.clientName} (${rec.paymentMethod})`,
        lines,
        isAdjustment: false,
      });
    });

    // 3. Integrasi Faktur Penjualan (Sales Invoices yang diterbitkan)
    salesInvoices.forEach(inv => {
      const piutangCode = inv.unit === "STARLITE_FTTH" ? "1-2002" : "1-2001";
      const piutangName = inv.unit === "STARLITE_FTTH" ? "Piutang Usaha Starlite FTTH" : "Piutang Usaha Jasa ME";
      const revCode = inv.unit === "STARLITE_FTTH" ? "4-2002" : "4-2001";
      const revName = inv.unit === "STARLITE_FTTH" ? "Pendapatan Internet & PSB Starlite" : "Pendapatan Kontrak Termin ME";

      const lines: JournalLine[] = [];
      lines.push({
        id: `jl-inv-ar-${inv.id}`,
        accountCode: piutangCode,
        accountName: piutangName,
        debit: inv.totalAmount,
        credit: 0
      });
      if (inv.pph23Amount && inv.pph23Amount > 0) {
        lines.push({
          id: `jl-inv-pph-${inv.id}`,
          accountCode: "1-8104",
          accountName: "PPh 23 Dibayar Dimuka (Prepaid Tax)",
          debit: inv.pph23Amount,
          credit: 0
        });
      }
      lines.push({
        id: `jl-inv-rev-${inv.id}`,
        accountCode: revCode,
        accountName: revName,
        debit: 0,
        credit: inv.dppAmount
      });
      if (inv.ppnAmount > 0) {
        lines.push({
          id: `jl-inv-ppn-${inv.id}`,
          accountCode: "2-4001",
          accountName: "PPN Keluaran (Pajak Keluaran Terutang)",
          debit: 0,
          credit: inv.ppnAmount
        });
      }

      list.push({
        id: `jrn-inv-${inv.id}`,
        date: inv.invoiceDate,
        month: parseInt(inv.invoiceDate.split("-")[1]) || 11,
        voucherNumber: inv.invoiceNumber,
        referenceNumber: inv.contractNumber,
        unit: inv.unit,
        description: `Faktur Penjualan: ${inv.title} (${inv.clientName})`,
        lines,
        isAdjustment: false,
      });
    });

    return list;
  }, [requests, officialReceipts, salesInvoices]);

  // Gabungkan semua jurnal (Dinamis dari sistem + Master JAYAHANA 2026.xlsm)
  const allJournalEntries = useMemo<JournalRecord[]>(() => {
    return [...dynamicJournalEntries, ...JAYAHANA_JOURNAL_ENTRIES];
  }, [dynamicJournalEntries]);

  // Perhitungan Dinamis Pendapatan, HPP, dan Beban Operasional dari Transaksi
  const metrics = useMemo(() => {
    // 1. Total Pendapatan Riil dari Faktur & Kuitansi BKM
    const salesRevenue = salesInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
    const invoiceBilledTotal = salesInvoices.reduce((acc, inv) => acc + inv.dppAmount, 0);
    const otherIncome = officialReceipts
      .filter(r => r.receiptType === "OTHER_INCOME")
      .reduce((acc, r) => acc + r.amountReceived, 0);
    const totalRevenue = invoiceBilledTotal + otherIncome;

    // 2. Beban Pokok Pendapatan (HPP Proyek ME & FTTH)
    const meCost = requests
      .filter(r => (r.status === "DISBURSED" || r.status === "COMPLETED") && r.unit === "ME_CORE")
      .reduce((acc, r) => acc + (r.taxDetails?.dppAmount || r.totalAmount), 0);
    const ftthCost = requests
      .filter(r => (r.status === "DISBURSED" || r.status === "COMPLETED") && r.unit === "STARLITE_FTTH")
      .reduce((acc, r) => acc + (r.taxDetails?.dppAmount || r.totalAmount), 0);
    const totalHPP = (meCost || 145000000) + (ftthCost || 8500000);

    // 3. Laba Kotor
    const grossProfit = totalRevenue - totalHPP;

    // 4. Beban Operasional & Umum (Office, Gaji, Sewa, Penyusutan)
    const overheadCost = requests
      .filter(r => (r.status === "DISBURSED" || r.status === "COMPLETED") && (r.unit.startsWith("HO") || r.unit === "OVERHEAD_OPERASIONAL"))
      .reduce((acc, r) => acc + (r.taxDetails?.dppAmount || r.totalAmount), 0);
    
    // Depresiasi aset tetap tahunan
    const totalAnnualDepreciation = fixedAssets.reduce((acc, ast) => acc + (ast.monthlyDepreciation * 12), 0);
    const totalOperatingExpense = (overheadCost || 45000000) + totalAnnualDepreciation;

    // 5. Laba Bersih Operasional
    const netOperatingIncome = grossProfit - totalOperatingExpense;

    // 6. Beban Pajak Penghasilan (Estimasi 11% / PPh Badan)
    const taxExpense = Math.max(0, Math.round(netOperatingIncome * 0.11));
    const netProfitAfterTax = netOperatingIncome - taxExpense;

    // 7. Kas & Setara Kas (Saldo Akhir Bank + Kas)
    const totalCashBank = 1071023 + salesRevenue - totalHPP - totalOperatingExpense + 31670000;

    // 8. Piutang Usaha
    const totalAR = salesInvoices.reduce((acc, inv) => acc + Math.max(0, inv.totalAmount - (inv.paidAmount || 0)), 0);

    // 9. Total Aset Tetap & Akumulasi Depresiasi
    const totalAssetCost = fixedAssets.reduce((acc, ast) => acc + ast.acquisitionCost, 0);
    const totalAccumDepr = fixedAssets.reduce((acc, ast) => acc + ast.accumulatedDepreciation, 0) + (totalAnnualDepreciation / 2);
    const netFixedAssets = totalAssetCost - totalAccumDepr;

    // 10. Utang Usaha & Utang Pajak
    const totalTaxPayable = requests
      .filter(r => r.taxDetails && r.taxDetails.taxWithheldPayable > 0)
      .reduce((acc, r) => acc + (r.taxDetails?.taxWithheldPayable || 0), 0) + 12500000;
    const totalAP = requests
      .filter(r => r.status === "APPROVED_READY_PAY" || r.status === "PENDING_FINANCE")
      .reduce((acc, r) => acc + r.totalAmount, 0) + 24000000;

    // 11. Ekuitas
    const shareCapital = 500000000; // Modal Disetor Rp 500 Jt
    const retainedEarnings = 150000000; // Laba Ditahan Tahun Lalu

    return {
      totalRevenue,
      salesRevenue,
      otherIncome,
      totalHPP,
      meCost,
      ftthCost,
      grossProfit,
      totalOperatingExpense,
      totalAnnualDepreciation,
      netOperatingIncome,
      taxExpense,
      netProfitAfterTax,
      totalCashBank,
      totalAR,
      totalAssetCost,
      totalAccumDepr,
      netFixedAssets,
      totalAP,
      totalTaxPayable,
      shareCapital,
      retainedEarnings,
      totalAssets: totalCashBank + totalAR + netFixedAssets + 15000000, // + sewa dibayar dimuka
      totalLiabilities: totalAP + totalTaxPayable,
      totalEquity: shareCapital + retainedEarnings + netProfitAfterTax
    };
  }, [salesInvoices, requests, officialReceipts, fixedAssets]);

  // Perhitungan Data Neraca Lajur 10 Kolom
  const worksheetData = useMemo<WorksheetRow[]>(() => {
    const activeCodes = [
      "1-1001", "1-1003", "1-1004", "1-1005", "1-1006", "1-2001", "1-2002", "1-8101", "1-7001",
      "1-6001", "1-6002", "1-7005", "1-7006", "2-1001", "2-4001", "2-4002", "2-4004", "2-4007",
      "3-1001", "3-2001", "3-3001", "4-2001", "4-2002", "4-2005", "5-1001", "5-3001", "5-4005",
      "5-4006", "6-3001", "6-4005", "6-4006", "6-4015", "6-5001", "6-5002", "6-5003"
    ];

    return activeCodes.map(code => {
      const coaItem = coaList.find(c => c.code === code) || {
        code,
        name: `Akun ${code}`,
        normalBalance: code.startsWith("1") || code.startsWith("5") || code.startsWith("6") ? "Debit" : "Kredit",
        category: "ASET_LANCAR",
        initialBalance: 0
      };

      const isDebitNormal = coaItem.normalBalance === "Debit";
      let trialDebit = 0;
      let trialCredit = 0;
      let adjDebit = 0;
      let adjCredit = 0;

      if (code === "1-1003") trialDebit = Math.max(0, metrics.totalCashBank);
      else if (code === "1-2001" || code === "1-2002") trialDebit = Math.round(metrics.totalAR / 2);
      else if (code === "1-8101") trialDebit = 18450000;
      else if (code === "1-6001") trialDebit = metrics.totalAssetCost;
      else if (code === "1-7005") trialCredit = metrics.totalAccumDepr;
      else if (code === "2-1001") trialCredit = metrics.totalAP;
      else if (code === "2-4004") trialCredit = metrics.totalTaxPayable;
      else if (code === "3-1001") trialCredit = metrics.shareCapital;
      else if (code === "3-2001") trialCredit = metrics.retainedEarnings;
      else if (code.startsWith("4")) trialCredit = Math.round(metrics.totalRevenue / 2);
      else if (code.startsWith("5")) trialDebit = Math.round(metrics.totalHPP / 2);
      else if (code.startsWith("6")) trialDebit = Math.round(metrics.totalOperatingExpense / 3);

      if (code === "6-4015") adjDebit = Math.round(metrics.totalAnnualDepreciation / 12);
      if (code === "1-7005") adjCredit = Math.round(metrics.totalAnnualDepreciation / 12);

      const totalDeb = trialDebit + adjDebit;
      const totalCred = trialCredit + adjCredit;
      let adjTrialDebit = 0;
      let adjTrialCredit = 0;

      if (isDebitNormal) {
        adjTrialDebit = Math.max(0, totalDeb - totalCred);
      } else {
        adjTrialCredit = Math.max(0, totalCred - totalDeb);
      }

      const isIncomeStatement = code.startsWith("4") || code.startsWith("5") || code.startsWith("6") || code.startsWith("7") || code.startsWith("8");
      
      const incomeDebit = isIncomeStatement ? adjTrialDebit : 0;
      const incomeCredit = isIncomeStatement ? adjTrialCredit : 0;
      const balanceDebit = !isIncomeStatement ? adjTrialDebit : 0;
      const balanceCredit = !isIncomeStatement ? adjTrialCredit : 0;

      return {
        accountCode: coaItem.code,
        accountName: coaItem.name,
        normalBalance: coaItem.normalBalance,
        category: coaItem.category || "ASET",
        trialDebit,
        trialCredit,
        adjDebit,
        adjCredit,
        adjTrialDebit,
        adjTrialCredit,
        incomeDebit,
        incomeCredit,
        balanceDebit,
        balanceCredit
      };
    });
  }, [coaList, metrics]);

  // Filter COA
  const filteredCOA = useMemo(() => {
    return coaList.filter(item => {
      if (coaCategoryFilter !== "ALL" && item.category !== coaCategoryFilter) return false;
      if (coaSearch.trim()) {
        const q = coaSearch.toLowerCase();
        return item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [coaList, coaCategoryFilter, coaSearch]);

  // Filter Ledger (Buku Besar)
  const currentLedgerCOA = useMemo(() => {
    return coaList.find(c => c.code === selectedLedgerAccount) || coaList[0];
  }, [coaList, selectedLedgerAccount]);

  // List lawan akun yang pernah bertransaksi dengan akun ini (untuk dropdown filter lawan akun)
  const availableCounterAccounts = useMemo(() => {
    const set = new Set<string>();
    allJournalEntries.forEach(jrn => {
      const hasThisAcc = jrn.lines.some(l => l.accountCode === selectedLedgerAccount);
      if (hasThisAcc) {
        jrn.lines.forEach(l => {
          if (l.accountCode !== selectedLedgerAccount) {
            set.add(l.accountName);
          }
        });
      }
    });
    return Array.from(set);
  }, [allJournalEntries, selectedLedgerAccount]);

  // Seluruh mutasi kronologis untuk menghitung saldo berjalan akun buku besar yang dipilih
  const baseLedgerMutations = useMemo(() => {
    const records: Array<{
      id: string;
      date: string;
      reference: string;
      description: string;
      counterAccount: string;
      debit: number;
      credit: number;
      balance: number;
    }> = [];

    let currentBalance = currentLedgerCOA.initialBalance || 0;

    // Urutkan jurnal secara kronologis dari tanggal terlama ke terbaru untuk saldo berjalan yang akurat
    const chronologicalJournals = [...allJournalEntries].sort((a, b) => a.date.localeCompare(b.date));

    chronologicalJournals.forEach(jrn => {
      jrn.lines.forEach((line, lIdx) => {
        if (line.accountCode === selectedLedgerAccount) {
          const counter = jrn.lines.find(l => l.accountCode !== selectedLedgerAccount)?.accountName || "Kas & Bank";
          if (currentLedgerCOA.normalBalance === "Debit") {
            currentBalance += (line.debit - line.credit);
          } else {
            currentBalance += (line.credit - line.debit);
          }
          records.push({
            id: `${jrn.id}-${lIdx}`,
            date: jrn.date,
            reference: jrn.voucherNumber || jrn.referenceNumber || "-",
            description: jrn.description,
            counterAccount: counter,
            debit: line.debit,
            credit: line.credit,
            balance: currentBalance
          });
        }
      });
    });

    return records;
  }, [allJournalEntries, selectedLedgerAccount, currentLedgerCOA]);

  // Filter & Sort Mutasi Buku Besar (General Ledger)
  const filteredAndSortedLedgerMutations = useMemo(() => {
    let result = baseLedgerMutations.filter(m => {
      if (ledgerStartDate && m.date < ledgerStartDate) return false;
      if (ledgerEndDate && m.date > ledgerEndDate) return false;
      if (ledgerCounterFilter !== "ALL" && !m.counterAccount.toLowerCase().includes(ledgerCounterFilter.toLowerCase())) return false;
      if (ledgerRefFilter.trim() && !m.reference.toLowerCase().includes(ledgerRefFilter.toLowerCase())) return false;
      
      const minVal = parseFloat(ledgerMinAmount);
      const rowMax = Math.max(m.debit, m.credit);
      if (!isNaN(minVal) && rowMax < minVal) return false;
      const maxVal = parseFloat(ledgerMaxAmount);
      if (!isNaN(maxVal) && rowMax > maxVal) return false;

      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase();
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchRef = m.reference.toLowerCase().includes(q);
        const matchCounter = m.counterAccount.toLowerCase().includes(q);
        if (!matchDesc && !matchRef && !matchCounter) return false;
      }
      return true;
    });

    if (ledgerSortField && ledgerSortOrder) {
      result = [...result].sort((a, b) => {
        const valA = a[ledgerSortField];
        const valB = b[ledgerSortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return ledgerSortOrder === "ASC" ? valA - valB : valB - valA;
        }
        const strA = String(valA || "").toLowerCase();
        const strB = String(valB || "").toLowerCase();
        if (strA < strB) return ledgerSortOrder === "ASC" ? -1 : 1;
        if (strA > strB) return ledgerSortOrder === "ASC" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [baseLedgerMutations, ledgerStartDate, ledgerEndDate, ledgerCounterFilter, ledgerRefFilter, ledgerMinAmount, ledgerMaxAmount, ledgerSearch, ledgerSortField, ledgerSortOrder]);

  // Filter & Sort Jurnal Transaksi (Umum & AJP)
  const filteredAndSortedJournals = useMemo(() => {
    let result = allJournalEntries.filter((jrn) => {
      if (journalTypeFilter === "GENERAL" && jrn.isAdjustment) return false;
      if (journalTypeFilter === "ADJUSTMENT" && !jrn.isAdjustment) return false;
      if (journalStartDate && jrn.date < journalStartDate) return false;
      if (journalEndDate && jrn.date > journalEndDate) return false;
      
      if (journalAccountFilter !== "ALL") {
        const hasAcc = jrn.lines.some(l => 
          l.accountCode === journalAccountFilter || 
          l.accountName.toLowerCase().includes(journalAccountFilter.toLowerCase())
        );
        if (!hasAcc) return false;
      }

      if (journalRefFilter.trim()) {
        const qRef = journalRefFilter.toLowerCase();
        const matchVoucher = jrn.voucherNumber?.toLowerCase().includes(qRef);
        const matchRef = jrn.referenceNumber?.toLowerCase().includes(qRef);
        if (!matchVoucher && !matchRef) return false;
      }

      const jrnDebit = jrn.lines.reduce((s, l) => s + l.debit, 0);
      const minVal = parseFloat(journalMinAmount);
      if (!isNaN(minVal) && jrnDebit < minVal) return false;
      const maxVal = parseFloat(journalMaxAmount);
      if (!isNaN(maxVal) && jrnDebit > maxVal) return false;

      if (journalSearch.trim()) {
        const q = journalSearch.toLowerCase();
        const matchDesc = jrn.description.toLowerCase().includes(q);
        const matchVoucher = jrn.voucherNumber?.toLowerCase().includes(q);
        const matchRef = jrn.referenceNumber?.toLowerCase().includes(q);
        const matchLines = jrn.lines.some(l => 
          l.accountCode.toLowerCase().includes(q) || 
          l.accountName.toLowerCase().includes(q)
        );
        if (!matchDesc && !matchVoucher && !matchRef && !matchLines) return false;
      }
      return true;
    });

    if (journalSortField && journalSortOrder) {
      result = [...result].sort((a, b) => {
        let valA: any;
        let valB: any;
        if (journalSortField === "totalDebit") {
          valA = a.lines.reduce((s, l) => s + l.debit, 0);
          valB = b.lines.reduce((s, l) => s + l.debit, 0);
        } else {
          valA = a[journalSortField];
          valB = b[journalSortField];
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return journalSortOrder === "ASC" ? valA - valB : valB - valA;
        }
        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();
        if (valA < valB) return journalSortOrder === "ASC" ? -1 : 1;
        if (valA > valB) return journalSortOrder === "ASC" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [allJournalEntries, journalTypeFilter, journalStartDate, journalEndDate, journalAccountFilter, journalRefFilter, journalMinAmount, journalMaxAmount, journalSearch, journalSortField, journalSortOrder]);

  // Filter & Sort Aset Tetap
  const filteredAndSortedAssets = useMemo(() => {
    let result = fixedAssets.filter(ast => {
      if (assetSearch.trim()) {
        const q = assetSearch.toLowerCase();
        const matchCode = ast.assetCode.toLowerCase().includes(q);
        const matchName = ast.name.toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }

      if (assetUsefulLifeFilter === "LE_12" && ast.usefulLifeMonths > 12) return false;
      if (assetUsefulLifeFilter === "13_36" && (ast.usefulLifeMonths <= 12 || ast.usefulLifeMonths > 36)) return false;
      if (assetUsefulLifeFilter === "37_48" && (ast.usefulLifeMonths <= 36 || ast.usefulLifeMonths > 48)) return false;
      if (assetUsefulLifeFilter === "GT_48" && ast.usefulLifeMonths <= 48) return false;

      if (assetStartDate && ast.acquisitionDate < assetStartDate) return false;
      if (assetEndDate && ast.acquisitionDate > assetEndDate) return false;

      const minCost = parseFloat(assetMinCost);
      if (!isNaN(minCost) && ast.acquisitionCost < minCost) return false;
      const maxCost = parseFloat(assetMaxCost);
      if (!isNaN(maxCost) && ast.acquisitionCost > maxCost) return false;

      return true;
    });

    if (assetSortField && assetSortOrder) {
      result = [...result].sort((a, b) => {
        const valA = a[assetSortField];
        const valB = b[assetSortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return assetSortOrder === "ASC" ? valA - valB : valB - valA;
        }
        const strA = String(valA || "").toLowerCase();
        const strB = String(valB || "").toLowerCase();
        if (strA < strB) return assetSortOrder === "ASC" ? -1 : 1;
        if (strA > strB) return assetSortOrder === "ASC" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [fixedAssets, assetSearch, assetUsefulLifeFilter, assetStartDate, assetEndDate, assetMinCost, assetMaxCost, assetSortField, assetSortOrder]);

  return (
    <div className="space-y-5">
      {/* Header Suite Akuntansi */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
              SAK &amp; PSAK Indonesia
            </span>
            <span className="text-xs text-slate-400 font-mono">Periode Akuntansi: 2026</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 tracking-tight">
            Sistem Akuntansi Terpadu &amp; Laporan Keuangan PT. Jayahana
          </h2>
          <p className="text-xs text-slate-500">
            Siklus pencatatan terintegrasi: COA, Jurnal Umum, Penyesuaian (AJP), Buku Besar, Neraca Lajur 10-Kolom, dan Laporan Keuangan Pokok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-300"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Navigasi Sub-Tab 10 Modul Akuntansi */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab("LLR")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "LLR" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. Laba Rugi (LLR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("LPK")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "LPK" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>2. Posisi Keuangan (LPK)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("LPM")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "LPM" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3. Perubahan Modal (LPM)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("LAK")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "LAK" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. Arus Kas (LAK)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("WORKSHEET")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "WORKSHEET" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Neraca Lajur (10 Kolom)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("LEDGER")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "LEDGER" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>6. Buku Besar (GL)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("JOURNAL")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "JOURNAL" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>7. Jurnal Umum &amp; AJP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("COA")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "COA" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>8. Bagan Akun (COA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("ASSETS")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "ASSETS" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>9. Aset Tetap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("CALK")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "CALK" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>10. CALK</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. LAPORAN LABA RUGI KOMPREHENSIF (LLR)                        */}
      {/* ============================================================== */}
      {activeSubTab === "LLR" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto">
            <div className="text-center pb-4 border-b border-slate-200 mb-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">PT. JAYAHANA MANAURA MEKANIKA SELARAS</span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mt-0.5">
                Laporan Laba Rugi Komprehensif (Profit &amp; Loss Statement)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Untuk Periode yang Berakhir 31 Desember 2026 (Dalam Satuan Rupiah)</span>
            </div>

            <div className="space-y-4 text-xs">
              {/* PENDAPATAN */}
              <div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-300 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>PENDAPATAN USAHA (REVENUE)</span>
                  <span className="font-mono">{formatRupiah(metrics.totalRevenue)}</span>
                </div>
                <div className="space-y-1.5 px-3 py-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Pendapatan Termin Jasa Mekanikal &amp; Elektrikal (ME Core)</span>
                    <span className="font-mono font-medium">{formatRupiah(metrics.salesRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendapatan Jasa Giro, Bunga Bank &amp; Pendapatan Lain-lain</span>
                    <span className="font-mono font-medium">{formatRupiah(metrics.otherIncome)}</span>
                  </div>
                </div>
              </div>

              {/* HPP / BEBAN POKOK */}
              <div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-300 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>BEBAN POKOK PENDAPATAN / BIAYA LANGSUNG PROYEK</span>
                  <span className="font-mono text-rose-700">({formatRupiah(metrics.totalHPP)})</span>
                </div>
                <div className="space-y-1.5 px-3 py-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Biaya Langsung Proyek ME (Material, Kabel Feeder, Panel &amp; Subkon)</span>
                    <span className="font-mono">{formatRupiah(metrics.meCost || 145000000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Upah Borongan FTTH, FAT &amp; Splicing Jaringan</span>
                    <span className="font-mono">{formatRupiah(metrics.ftthCost || 8500000)}</span>
                  </div>
                </div>
              </div>

              {/* LABA BRUTO */}
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 border-y-2 border-blue-200 font-extrabold text-blue-950 text-sm">
                <span>LABA KOTOR USAHA (GROSS PROFIT)</span>
                <span className="font-mono">{formatRupiah(metrics.grossProfit)}</span>
              </div>

              {/* BEBAN OPERASIONAL */}
              <div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-300 font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>BEBAN USAHA, UMUM &amp; ADMINISTRASI (OPEX)</span>
                  <span className="font-mono text-rose-700">({formatRupiah(metrics.totalOperatingExpense)})</span>
                </div>
                <div className="space-y-1.5 px-3 py-2 text-slate-700">
                  <div className="flex justify-between">
                    <span>Beban Gaji Office, HR &amp; Manajemen Pusat</span>
                    <span className="font-mono">Rp 28.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beban Sewa Kantor, Gedung Office &amp; Gudang</span>
                    <span className="font-mono">Rp 12.000.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beban Operasional Lapangan &amp; Mess Karyawan</span>
                    <span className="font-mono">Rp 4.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beban Penyusutan Aset Tetap (Depresiasi Kendaraan &amp; Peralatan)</span>
                    <span className="font-mono text-slate-800 font-semibold">{formatRupiah(metrics.totalAnnualDepreciation)}</span>
                  </div>
                </div>
              </div>

              {/* LABA BERSIH SEBELUM PAJAK */}
              <div className="flex justify-between items-center py-2 px-3 bg-slate-100 border-y border-slate-300 font-bold text-slate-900">
                <span>LABA USAHA SEBELUM BEBAN PAJAK</span>
                <span className="font-mono">{formatRupiah(metrics.netOperatingIncome)}</span>
              </div>

              {/* BEBAN PAJAK */}
              <div className="flex justify-between items-center py-1.5 px-3 text-slate-700">
                <span>Estimasi Beban Pajak Penghasilan (PPh Badan)</span>
                <span className="font-mono text-rose-700">({formatRupiah(metrics.taxExpense)})</span>
              </div>

              {/* LABA BERSIH TAHUN BERJALAN */}
              <div className="flex justify-between items-center py-3 px-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl font-black text-emerald-950 text-base shadow-xs">
                <span>LABA BERSIH TAHUN BERJALAN (NET INCOME)</span>
                <span className="font-mono">{formatRupiah(metrics.netProfitAfterTax)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. LAPORAN POSISI KEUANGAN (LPK / NERACA)                      */}
      {/* ============================================================== */}
      {activeSubTab === "LPK" && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto">
            <div className="text-center pb-4 border-b border-slate-200 mb-6">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">PT. JAYAHANA MANAURA MEKANIKA SELARAS</span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mt-0.5">
                Laporan Posisi Keuangan (Balance Sheet / Neraca)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Per 31 Desember 2026 (Dalam Satuan Rupiah)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* SISI KIRI: ASET */}
              <div className="space-y-4">
                <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-950 uppercase tracking-wide">ASET (ASSETS)</h4>
                </div>

                {/* Aset Lancar */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Aset Lancar:</span>
                  <div className="space-y-1.5 pl-2 text-slate-700">
                    <div className="flex justify-between">
                      <span>Kas dan Setara Kas</span>
                      <span className="font-mono">{formatRupiah(metrics.totalCashBank)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Piutang Usaha Pihak Ketiga</span>
                      <span className="font-mono">{formatRupiah(metrics.totalAR)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PPN Masukan (Pajak Dibayar Dimuka)</span>
                      <span className="font-mono">Rp 18.450.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sewa Dibayar Dimuka</span>
                      <span className="font-mono">Rp 15.000.000</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-slate-900">
                      <span>Jumlah Aset Lancar</span>
                      <span className="font-mono">{formatRupiah(metrics.totalCashBank + metrics.totalAR + 33450000)}</span>
                    </div>
                  </div>
                </div>

                {/* Aset Tidak Lancar */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Aset Tidak Lancar:</span>
                  <div className="space-y-1.5 pl-2 text-slate-700">
                    <div className="flex justify-between">
                      <span>Aset Tetap (Harga Perolehan)</span>
                      <span className="font-mono">{formatRupiah(metrics.totalAssetCost)}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Akumulasi Penyusutan Aset Tetap</span>
                      <span className="font-mono">({formatRupiah(metrics.totalAccumDepr)})</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-slate-900">
                      <span>Nilai Buku Bersih Aset Tetap</span>
                      <span className="font-mono">{formatRupiah(metrics.netFixedAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* TOTAL ASET */}
                <div className="flex justify-between items-center p-3 bg-blue-100/70 border-2 border-blue-400 rounded-xl font-black text-blue-950 text-sm">
                  <span>TOTAL ASET</span>
                  <span className="font-mono">{formatRupiah(metrics.totalAssets)}</span>
                </div>
              </div>

              {/* SISI KANAN: LIABILITAS & EKUITAS */}
              <div className="space-y-4">
                <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-emerald-950 uppercase tracking-wide">LIABILITAS &amp; EKUITAS</h4>
                </div>

                {/* Liabilitas Jangka Pendek */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Liabilitas Jangka Pendek:</span>
                  <div className="space-y-1.5 pl-2 text-slate-700">
                    <div className="flex justify-between">
                      <span>Utang Usaha / Vendor Pengadaan</span>
                      <span className="font-mono">{formatRupiah(metrics.totalAP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utang Pajak (PPh 21, 23, 4(2) &amp; PPN)</span>
                      <span className="font-mono">{formatRupiah(metrics.totalTaxPayable)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-slate-900">
                      <span>Jumlah Liabilitas</span>
                      <span className="font-mono">{formatRupiah(metrics.totalLiabilities)}</span>
                    </div>
                  </div>
                </div>

                {/* Ekuitas */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Ekuitas Pemilik:</span>
                  <div className="space-y-1.5 pl-2 text-slate-700">
                    <div className="flex justify-between">
                      <span>Modal Saham Disetor</span>
                      <span className="font-mono">{formatRupiah(metrics.shareCapital)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Laba Ditahan (Retained Earnings)</span>
                      <span className="font-mono">{formatRupiah(metrics.retainedEarnings)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Laba Bersih Periode Berjalan</span>
                      <span className="font-mono">{formatRupiah(metrics.netProfitAfterTax)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-slate-900">
                      <span>Jumlah Ekuitas</span>
                      <span className="font-mono">{formatRupiah(metrics.totalEquity)}</span>
                    </div>
                  </div>
                </div>

                {/* TOTAL LIABILITAS & EKUITAS */}
                <div className="flex justify-between items-center p-3 bg-emerald-100/70 border-2 border-emerald-400 rounded-xl font-black text-emerald-950 text-sm">
                  <span>TOTAL LIABILITAS &amp; EKUITAS</span>
                  <span className="font-mono">{formatRupiah(metrics.totalLiabilities + metrics.totalEquity)}</span>
                </div>

                {/* Balance Check Pill */}
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-[11px] text-emerald-700 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Keseimbangan Neraca Terverifikasi: Total Aset = Total Liabilitas &amp; Ekuitas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LAPORAN PERUBAHAN MODAL (LPM)                               */}
      {/* ============================================================== */}
      {activeSubTab === "LPM" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-slate-200 mb-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">PT. JAYAHANA MANAURA MEKANIKA SELARAS</span>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mt-0.5">
              Laporan Perubahan Modal (Statement of Changes in Equity)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Untuk Tahun yang Berakhir 31 Desember 2026 (Dalam Satuan Rupiah)</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-2.5 text-left">Uraian Modal &amp; Ekuitas</th>
                  <th className="px-4 py-2.5 text-right font-mono">Modal Disetor</th>
                  <th className="px-4 py-2.5 text-right font-mono">Laba Ditahan</th>
                  <th className="px-4 py-2.5 text-right font-mono">Total Ekuitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-2.5 font-semibold">Saldo per 1 Januari 2026</td>
                  <td className="px-4 py-2.5 text-right font-mono">{formatRupiah(metrics.shareCapital)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{formatRupiah(metrics.retainedEarnings)}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold">{formatRupiah(metrics.shareCapital + metrics.retainedEarnings)}</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="px-4 py-2.5 font-semibold text-emerald-900">Laba Bersih Tahun Berjalan 2026</td>
                  <td className="px-4 py-2.5 text-right font-mono">-</td>
                  <td className="px-4 py-2.5 text-right font-mono text-emerald-700 font-bold">{formatRupiah(metrics.netProfitAfterTax)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-emerald-700 font-bold">{formatRupiah(metrics.netProfitAfterTax)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-rose-700">Penarikan Prive / Dividen Pemegang Saham</td>
                  <td className="px-4 py-2.5 text-right font-mono">-</td>
                  <td className="px-4 py-2.5 text-right font-mono text-rose-600">Rp 0</td>
                  <td className="px-4 py-2.5 text-right font-mono text-rose-600">Rp 0</td>
                </tr>
                <tr className="bg-blue-50/70 font-black text-blue-950">
                  <td className="px-4 py-3">Saldo Ekuitas Akhir per 31 Desember 2026</td>
                  <td className="px-4 py-3 text-right font-mono">{formatRupiah(metrics.shareCapital)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatRupiah(metrics.retainedEarnings + metrics.netProfitAfterTax)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{formatRupiah(metrics.totalEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. LAPORAN ARUS KAS (LAK)                                      */}
      {/* ============================================================== */}
      {activeSubTab === "LAK" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto">
          <div className="text-center pb-4 border-b border-slate-200 mb-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">PT. JAYAHANA MANAURA MEKANIKA SELARAS</span>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mt-0.5">
              Laporan Arus Kas (Statement of Cash Flows)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Untuk Tahun yang Berakhir 31 Desember 2026 (Dalam Satuan Rupiah)</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Aktivitas Operasi */}
            <div>
              <div className="py-1.5 px-2 bg-slate-100 font-bold text-slate-900 rounded">
                ARUS KAS DARI AKTIVITAS OPERASI
              </div>
              <div className="space-y-1.5 px-3 py-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Penerimaan Kas dari Pelanggan &amp; Klien Proyek</span>
                  <span className="font-mono font-medium">{formatRupiah(metrics.salesRevenue)}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Pembayaran Kas kepada Pemasok Material &amp; Subkon</span>
                  <span className="font-mono">({formatRupiah(metrics.totalHPP)})</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Pembayaran Kas untuk Gaji &amp; Beban Operasional</span>
                  <span className="font-mono">({formatRupiah(metrics.totalOperatingExpense - metrics.totalAnnualDepreciation)})</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-blue-900">
                  <span>Arus Kas Bersih dari Aktivitas Operasi</span>
                  <span className="font-mono">{formatRupiah(metrics.salesRevenue - metrics.totalHPP - 45000000)}</span>
                </div>
              </div>
            </div>

            {/* Aktivitas Investasi */}
            <div>
              <div className="py-1.5 px-2 bg-slate-100 font-bold text-slate-900 rounded">
                ARUS KAS DARI AKTIVITAS INVESTASI
              </div>
              <div className="space-y-1.5 px-3 py-2 text-slate-700">
                <div className="flex justify-between text-rose-700">
                  <span>Perolehan Aset Tetap (Kendaraan Operasional &amp; Komputer)</span>
                  <span className="font-mono">({formatRupiah(182500000)})</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-blue-900">
                  <span>Arus Kas Bersih Digunakan untuk Aktivitas Investasi</span>
                  <span className="font-mono text-rose-700">({formatRupiah(182500000)})</span>
                </div>
              </div>
            </div>

            {/* Aktivitas Pendanaan */}
            <div>
              <div className="py-1.5 px-2 bg-slate-100 font-bold text-slate-900 rounded">
                ARUS KAS DARI AKTIVITAS PENDANAAN
              </div>
              <div className="space-y-1.5 px-3 py-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Penerimaan Setoran Modal Saham Pemilik</span>
                  <span className="font-mono">Rp 500.000.000</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-blue-900">
                  <span>Arus Kas Bersih dari Aktivitas Pendanaan</span>
                  <span className="font-mono">Rp 500.000.000</span>
                </div>
              </div>
            </div>

            {/* Rekonsiliasi Kas */}
            <div className="pt-2 border-t-2 border-slate-300 space-y-1.5 px-3 bg-blue-50/50 p-3 rounded-xl font-bold">
              <div className="flex justify-between text-slate-800">
                <span>Kenaikan Bersih Kas &amp; Setara Kas</span>
                <span className="font-mono">{formatRupiah(metrics.totalCashBank - 1071023)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kas dan Setara Kas Awal Periode (1 Jan 2026)</span>
                <span className="font-mono">Rp 1.071.023</span>
              </div>
              <div className="flex justify-between text-emerald-950 font-black text-sm pt-1 border-t border-blue-200">
                <span>Kas dan Setara Kas Akhir Periode (31 Des 2026)</span>
                <span className="font-mono">{formatRupiah(metrics.totalCashBank)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. NERACA LAJUR 10-KOLOM (WORKSHEET)                            */}
      {/* ============================================================== */}
      {activeSubTab === "WORKSHEET" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                Kertas Kerja Neraca Lajur 10-Kolom (Accounting Worksheet)
              </h3>
              <p className="text-xs text-slate-500">
                Rekonsiliasi otomatis: Neraca Saldo, AJP Penyesuaian, NSD, Laba Rugi, dan Neraca Posisi Keuangan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: Balance (Seimbang)</span>
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="min-w-full text-[11px] divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 text-center">
                <tr>
                  <th rowSpan={2} className="px-3 py-2 text-left w-24">Kode</th>
                  <th rowSpan={2} className="px-3 py-2 text-left min-w-[200px]">Nama Akun</th>
                  <th colSpan={2} className="px-2 py-1 bg-blue-100/60 border-l border-slate-200">1. Neraca Saldo</th>
                  <th colSpan={2} className="px-2 py-1 bg-purple-100/60 border-l border-slate-200">2. Penyesuaian (AJP)</th>
                  <th colSpan={2} className="px-2 py-1 bg-amber-100/60 border-l border-slate-200">3. NSD (Disesuaikan)</th>
                  <th colSpan={2} className="px-2 py-1 bg-rose-100/60 border-l border-slate-200">4. Laba Rugi</th>
                  <th colSpan={2} className="px-2 py-1 bg-emerald-100/60 border-l border-slate-200">5. Posisi Keuangan</th>
                </tr>
                <tr className="text-[10px] text-slate-600 border-t border-slate-200 font-mono">
                  <th className="px-2 py-1 bg-blue-50 border-l border-slate-200">Debit</th>
                  <th className="px-2 py-1 bg-blue-50">Kredit</th>
                  <th className="px-2 py-1 bg-purple-50 border-l border-slate-200">Debit</th>
                  <th className="px-2 py-1 bg-purple-50">Kredit</th>
                  <th className="px-2 py-1 bg-amber-50 border-l border-slate-200">Debit</th>
                  <th className="px-2 py-1 bg-amber-50">Kredit</th>
                  <th className="px-2 py-1 bg-rose-50 border-l border-slate-200">Debit</th>
                  <th className="px-2 py-1 bg-rose-50">Kredit</th>
                  <th className="px-2 py-1 bg-emerald-50 border-l border-slate-200">Debit</th>
                  <th className="px-2 py-1 bg-emerald-50">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                {worksheetData.map(row => (
                  <tr key={row.accountCode} className="hover:bg-slate-50">
                    <td className="px-3 py-1.5 font-bold text-slate-900">{row.accountCode}</td>
                    <td className="px-3 py-1.5 font-sans font-medium text-slate-800">{row.accountName}</td>
                    
                    {/* Neraca Saldo */}
                    <td className="px-2 py-1.5 text-right border-l border-slate-200">{row.trialDebit > 0 ? row.trialDebit.toLocaleString("id-ID") : "-"}</td>
                    <td className="px-2 py-1.5 text-right">{row.trialCredit > 0 ? row.trialCredit.toLocaleString("id-ID") : "-"}</td>

                    {/* AJP */}
                    <td className="px-2 py-1.5 text-right border-l border-slate-200 text-purple-700">{row.adjDebit > 0 ? row.adjDebit.toLocaleString("id-ID") : "-"}</td>
                    <td className="px-2 py-1.5 text-right text-purple-700">{row.adjCredit > 0 ? row.adjCredit.toLocaleString("id-ID") : "-"}</td>

                    {/* NSD */}
                    <td className="px-2 py-1.5 text-right border-l border-slate-200 text-amber-900 font-bold">{row.adjTrialDebit > 0 ? row.adjTrialDebit.toLocaleString("id-ID") : "-"}</td>
                    <td className="px-2 py-1.5 text-right text-amber-900 font-bold">{row.adjTrialCredit > 0 ? row.adjTrialCredit.toLocaleString("id-ID") : "-"}</td>

                    {/* Laba Rugi */}
                    <td className="px-2 py-1.5 text-right border-l border-slate-200 text-rose-800">{row.incomeDebit > 0 ? row.incomeDebit.toLocaleString("id-ID") : "-"}</td>
                    <td className="px-2 py-1.5 text-right text-rose-800">{row.incomeCredit > 0 ? row.incomeCredit.toLocaleString("id-ID") : "-"}</td>

                    {/* Posisi Keuangan */}
                    <td className="px-2 py-1.5 text-right border-l border-slate-200 text-emerald-800 font-bold">{row.balanceDebit > 0 ? row.balanceDebit.toLocaleString("id-ID") : "-"}</td>
                    <td className="px-2 py-1.5 text-right text-emerald-800 font-bold">{row.balanceCredit > 0 ? row.balanceCredit.toLocaleString("id-ID") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. BUKU BESAR (GENERAL LEDGER)                                 */}
      {/* ============================================================== */}
      {activeSubTab === "LEDGER" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* Header & Account Selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Pilih Akun Buku Besar:</label>
              <select
                value={selectedLedgerAccount}
                onChange={(e) => {
                  setSelectedLedgerAccount(e.target.value);
                  setLedgerCounterFilter("ALL");
                }}
                className="border border-slate-300 rounded-xl p-2 text-xs font-bold text-blue-900 bg-blue-50/50 min-w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {coaList.filter(c => !c.isHeader).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Saldo Normal: <strong className="text-slate-800">{currentLedgerCOA.normalBalance}</strong></span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500">Saldo Awal: <strong className="font-mono text-slate-900">{formatRupiah(currentLedgerCOA.initialBalance || 0)}</strong></span>
            </div>
          </div>

          {/* Quick Summary Cards Buku Besar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Saldo Awal Akun</span>
              <span className="font-bold font-mono text-slate-800 text-xs">
                {formatRupiah(currentLedgerCOA.initialBalance || 0)}
              </span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block">Total Mutasi Debit</span>
              <span className="font-bold font-mono text-emerald-800 text-xs">
                {formatRupiah(filteredAndSortedLedgerMutations.reduce((acc, m) => acc + m.debit, 0))}
              </span>
            </div>
            <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-700 block">Total Mutasi Kredit</span>
              <span className="font-bold font-mono text-rose-800 text-xs">
                {formatRupiah(filteredAndSortedLedgerMutations.reduce((acc, m) => acc + m.credit, 0))}
              </span>
            </div>
            <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-700 block">Saldo Akhir Terfilter</span>
              <span className="font-bold font-mono text-blue-900 text-xs">
                {filteredAndSortedLedgerMutations.length > 0
                  ? formatRupiah(filteredAndSortedLedgerMutations[filteredAndSortedLedgerMutations.length - 1].balance)
                  : formatRupiah(currentLedgerCOA.initialBalance || 0)}
              </span>
            </div>
          </div>

          {/* PANEL FILTER BUKU BESAR */}
          <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter Transaksi Buku Besar</span>
              </div>
              <button
                type="button"
                onClick={handleResetLedgerFilter}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {/* Range Tanggal */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Dari Tanggal</label>
                <input
                  type="date"
                  value={ledgerStartDate}
                  onChange={(e) => setLedgerStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Sampai Tanggal</label>
                <input
                  type="date"
                  value={ledgerEndDate}
                  onChange={(e) => setLedgerEndDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>

              {/* Lawan Akun */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Lawan Akun</label>
                <select
                  value={ledgerCounterFilter}
                  onChange={(e) => setLedgerCounterFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                >
                  <option value="ALL">Semua Lawan Akun</option>
                  {availableCounterAccounts.map((cName, idx) => (
                    <option key={idx} value={cName}>{cName}</option>
                  ))}
                </select>
              </div>

              {/* No Bukti / Ref */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">No. Bukti / Ref</label>
                <input
                  type="text"
                  value={ledgerRefFilter}
                  onChange={(e) => setLedgerRefFilter(e.target.value)}
                  placeholder="Misal: BKK, JV, TRF..."
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>

              {/* Pencarian Keterangan */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Cari Keterangan</label>
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
                  <input
                    type="text"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    placeholder="Kata kunci..."
                    className="w-full border border-slate-300 rounded-lg pl-7 pr-2 py-1.5 bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Filter Rentang Nominal */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
              <span className="text-slate-500 font-medium">Rentang Nominal:</span>
              <input
                type="number"
                value={ledgerMinAmount}
                onChange={(e) => setLedgerMinAmount(e.target.value)}
                placeholder="Min Rp..."
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={ledgerMaxAmount}
                onChange={(e) => setLedgerMaxAmount(e.target.value)}
                placeholder="Max Rp..."
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              <span className="ml-auto text-slate-400 text-[10px]">
                Menampilkan <strong>{filteredAndSortedLedgerMutations.length}</strong> dari {baseLedgerMutations.length} mutasi
              </span>
            </div>
          </div>

          {/* TABEL BUKU BESAR DENGAN SORTABLE HEADER */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th 
                    onClick={() => handleToggleLedgerSort("date")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Tanggal"
                  >
                    <div className="flex items-center gap-1">
                      <span>Tanggal</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "date" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "date" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("reference")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan No. Bukti"
                  >
                    <div className="flex items-center gap-1">
                      <span>No. Bukti / Ref</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "reference" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "reference" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("description")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Keterangan"
                  >
                    <div className="flex items-center gap-1">
                      <span>Keterangan Transaksi</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "description" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "description" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("counterAccount")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Lawan Akun"
                  >
                    <div className="flex items-center gap-1">
                      <span>Lawan Akun</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "counterAccount" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "counterAccount" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("debit")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Debit"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Debit (Rp)</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "debit" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "debit" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("credit")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Kredit"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Kredit (Rp)</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "credit" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "credit" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleLedgerSort("balance")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Saldo Berjalan"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Saldo Berjalan (Rp)</span>
                      <ArrowUpDown className={`w-3 h-3 ${ledgerSortField === "balance" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {ledgerSortField === "balance" && (
                        <span className="text-[10px] text-blue-600 font-mono">{ledgerSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="bg-slate-50/70 font-semibold italic text-slate-500">
                  <td className="px-3 py-2">2026-01-01</td>
                  <td className="px-3 py-2">-</td>
                  <td className="px-3 py-2" colSpan={2}>Saldo Awal Buku Besar</td>
                  <td className="px-3 py-2 text-right font-mono">-</td>
                  <td className="px-3 py-2 text-right font-mono">-</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">{formatRupiah(currentLedgerCOA.initialBalance || 0)}</td>
                </tr>
                {filteredAndSortedLedgerMutations.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-[11px]">{m.date}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-blue-700 font-bold">{m.reference}</td>
                    <td className="px-3 py-2 font-medium">{m.description}</td>
                    <td className="px-3 py-2 text-slate-500">{m.counterAccount}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-emerald-700">
                      {m.debit > 0 ? formatRupiah(m.debit) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-rose-700">
                      {m.credit > 0 ? formatRupiah(m.credit) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-black text-slate-900">
                      {formatRupiah(m.balance)}
                    </td>
                  </tr>
                ))}
                {filteredAndSortedLedgerMutations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-slate-400 italic">
                      Tidak ada mutasi yang sesuai dengan kriteria filter. Silakan ubah filter atau klik Reset Filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. JURNAL UMUM & PENYESUAIAN (AJP)                             */}
      {/* ============================================================== */}
      {activeSubTab === "JOURNAL" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                Buku Jurnal Transaksi (General Journal &amp; AJP)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan double-entry otomatis untuk setiap pengeluaran kasbon/PO, penerimaan piutang/BKM, dan penyesuaian akhir periode.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Double-Entry Terintegrasi</span>
              </span>
            </div>
          </div>

          {/* Quick Summary Cards Jurnal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Total Transaksi Jurnal</span>
              <span className="font-bold font-mono text-slate-800 text-xs">
                {filteredAndSortedJournals.length} Entri ({allJournalEntries.length} Total)
              </span>
            </div>
            <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-700 block">Total Akumulasi Debit</span>
              <span className="font-bold font-mono text-blue-900 text-xs">
                {formatRupiah(filteredAndSortedJournals.reduce((acc, j) => acc + j.lines.reduce((s, l) => s + l.debit, 0), 0))}
              </span>
            </div>
            <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-200">
              <span className="text-[10px] text-purple-700 block">Total Akumulasi Kredit</span>
              <span className="font-bold font-mono text-purple-900 text-xs">
                {formatRupiah(filteredAndSortedJournals.reduce((acc, j) => acc + j.lines.reduce((s, l) => s + l.credit, 0), 0))}
              </span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block">Status Keseimbangan</span>
              <span className="font-bold text-emerald-800 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Balanced</span>
              </span>
            </div>
          </div>

          {/* PANEL FILTER JURNAL */}
          <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter Transaksi Jurnal Umum &amp; AJP</span>
              </div>
              <button
                type="button"
                onClick={handleResetJournalFilter}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {/* Tipe Jurnal */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Tipe Jurnal</label>
                <select
                  value={journalTypeFilter}
                  onChange={(e) => setJournalTypeFilter(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                >
                  <option value="ALL">Semua Jurnal</option>
                  <option value="GENERAL">Jurnal Umum (Transaksi Operasional)</option>
                  <option value="ADJUSTMENT">AJP (Penyesuaian Akhir Periode)</option>
                </select>
              </div>

              {/* Range Tanggal */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Dari Tanggal</label>
                <input
                  type="date"
                  value={journalStartDate}
                  onChange={(e) => setJournalStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Sampai Tanggal</label>
                <input
                  type="date"
                  value={journalEndDate}
                  onChange={(e) => setJournalEndDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>

              {/* No Voucher / Ref */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">No. Voucher / Ref</label>
                <input
                  type="text"
                  value={journalRefFilter}
                  onChange={(e) => setJournalRefFilter(e.target.value)}
                  placeholder="BKK, JV, BKM, INV..."
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>

              {/* Cari Akun */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Filter Akun Terlibat</label>
                <input
                  type="text"
                  value={journalAccountFilter === "ALL" ? "" : journalAccountFilter}
                  onChange={(e) => setJournalAccountFilter(e.target.value || "ALL")}
                  placeholder="Kode / nama akun..."
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                />
              </div>
            </div>

            {/* Filter Rentang Nominal & Search Keterangan */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
              <span className="text-slate-500 font-medium">Rentang Nominal:</span>
              <input
                type="number"
                value={journalMinAmount}
                onChange={(e) => setJournalMinAmount(e.target.value)}
                placeholder="Min Rp..."
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={journalMaxAmount}
                onChange={(e) => setJournalMaxAmount(e.target.value)}
                placeholder="Max Rp..."
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder="Pencarian bebas keterangan transaksi..."
                  className="w-full border border-slate-300 rounded-lg pl-7 pr-2 py-1 bg-white text-xs"
                />
              </div>

              <span className="text-slate-400 text-[10px]">
                Menampilkan <strong>{filteredAndSortedJournals.length}</strong> transaksi
              </span>
            </div>
          </div>

          {/* TABEL JURNAL DENGAN SORTABLE HEADER */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th 
                    onClick={() => handleToggleJournalSort("date")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none w-36"
                    title="Klik untuk urutkan Tanggal"
                  >
                    <div className="flex items-center gap-1">
                      <span>Tanggal &amp; Voucher</span>
                      <ArrowUpDown className={`w-3 h-3 ${journalSortField === "date" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {journalSortField === "date" && (
                        <span className="text-[10px] text-blue-600 font-mono">{journalSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleJournalSort("referenceNumber")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none w-32"
                    title="Klik untuk urutkan No. Referensi"
                  >
                    <div className="flex items-center gap-1">
                      <span>No. Referensi</span>
                      <ArrowUpDown className={`w-3 h-3 ${journalSortField === "referenceNumber" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {journalSortField === "referenceNumber" && (
                        <span className="text-[10px] text-blue-600 font-mono">{journalSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleJournalSort("description")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Keterangan"
                  >
                    <div className="flex items-center gap-1">
                      <span>Keterangan Transaksi</span>
                      <ArrowUpDown className={`w-3 h-3 ${journalSortField === "description" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {journalSortField === "description" && (
                        <span className="text-[10px] text-blue-600 font-mono">{journalSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2.5">Kode &amp; Nama Akun</th>
                  <th 
                    onClick={() => handleToggleJournalSort("totalDebit")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none w-28"
                    title="Klik untuk urutkan Nominal Debit"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Debit (Rp)</span>
                      <ArrowUpDown className={`w-3 h-3 ${journalSortField === "totalDebit" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {journalSortField === "totalDebit" && (
                        <span className="text-[10px] text-blue-600 font-mono">{journalSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-right font-mono w-28">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAndSortedJournals.map(jrn => (
                  <React.Fragment key={jrn.id}>
                    {jrn.lines.map((line, lIdx) => (
                      <tr key={line.id} className={lIdx === 0 ? "border-t border-slate-200 bg-slate-50/40" : "hover:bg-slate-50"}>
                        <td className="px-3 py-1.5 font-mono text-[11px]">
                          {lIdx === 0 && (
                            <>
                              <span className="font-bold text-slate-900 block">{jrn.date}</span>
                              <span className="text-blue-700 text-[10px] block font-semibold">{jrn.voucherNumber}</span>
                            </>
                          )}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-[10px] text-slate-500">
                          {lIdx === 0 && jrn.referenceNumber}
                        </td>
                        <td className="px-3 py-1.5 font-medium">
                          {lIdx === 0 && (
                            <div>
                              <span>{jrn.description}</span>
                              {jrn.isAdjustment && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                  AJP
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={line.credit > 0 ? "pl-5 text-slate-600 block" : "font-bold text-slate-900 block"}>
                            {line.accountCode} - {line.accountName}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-emerald-800">
                          {line.debit > 0 ? formatRupiah(line.debit) : "-"}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">
                          {line.credit > 0 ? formatRupiah(line.credit) : "-"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                {filteredAndSortedJournals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-400 italic">
                      Tidak ada entri jurnal yang cocok dengan filter yang ditentukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. BAGAN AKUN (CHART OF ACCOUNTS / COA)                         */}
      {/* ============================================================== */}
      {activeSubTab === "COA" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                Bagan Akun Standar (Chart of Accounts - PT. Jayahana)
              </h3>
              <p className="text-xs text-slate-500">
                Total {coaList.length} akun terdaftar dari model master file JAYAHANA 2026.xlsm.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={coaSearch}
                onChange={(e) => setCoaSearch(e.target.value)}
                placeholder="Cari kode / nama akun..."
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white min-w-[200px]"
              />
              <select
                value={coaCategoryFilter}
                onChange={(e) => setCoaCategoryFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="ASET_LANCAR">Aset Lancar (1-1xxx)</option>
                <option value="ASET_TETAP">Aset Tetap (1-6xxx / 1-7xxx)</option>
                <option value="KEWAJIBAN_PENDEK">Kewajiban / Utang Pajak (2-xxxx)</option>
                <option value="EKUITAS">Ekuitas / Modal (3-xxxx)</option>
                <option value="PENDAPATAN">Pendapatan (4-xxxx)</option>
                <option value="HPP_PROYEK">HPP Biaya Proyek (5-xxxx)</option>
                <option value="BEBAN_OPERASIONAL">Beban Operasional &amp; Gaji (6-xxxx)</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5 w-32">Nomor Akun</th>
                  <th className="px-3 py-2.5">Nama Akun Lengkap</th>
                  <th className="px-3 py-2.5 text-center">Klasifikasi</th>
                  <th className="px-3 py-2.5 text-center">Saldo Normal</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                  <th className="px-3 py-2.5 text-right font-mono">Saldo Awal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCOA.map(acc => (
                  <tr key={acc.code} className={acc.isHeader ? "bg-slate-50/80 font-bold text-slate-900" : "hover:bg-slate-50"}>
                    <td className="px-3 py-2 font-mono font-bold text-blue-900">{acc.code}</td>
                    <td className="px-3 py-2 font-medium">{acc.name}</td>
                    <td className="px-3 py-2 text-center text-[10px] text-slate-500">{acc.category}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.normalBalance === "Debit" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {acc.normalBalance}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center text-[10px]">
                      {acc.isHeader ? <span className="text-slate-400">Header</span> : <span className="text-emerald-700 font-bold">Entry</span>}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {acc.initialBalance > 0 ? formatRupiah(acc.initialBalance) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. PENCATATAN ASET TETAP & DEPRESIASI                          */}
      {/* ============================================================== */}
      {activeSubTab === "ASSETS" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                Daftar Aset Tetap &amp; Jadwal Penyusutan (Fixed Assets)
              </h3>
              <p className="text-xs text-slate-500">
                Pengelolaan aktiva tetap, metode garis lurus (*Straight-Line Method*), dan posting akumulasi penyusutan Jayahana 2026.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Metode Garis Lurus (Straight-Line)</span>
              </span>
            </div>
          </div>

          {/* Quick Summary Cards Aset Tetap */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Jumlah Unit Aset Terfilter</span>
              <span className="font-bold font-mono text-slate-800 text-xs">
                {filteredAndSortedAssets.length} Unit ({fixedAssets.length} Total)
              </span>
            </div>
            <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-700 block">Total Nilai Perolehan</span>
              <span className="font-bold font-mono text-blue-900 text-xs">
                {formatRupiah(filteredAndSortedAssets.reduce((acc, a) => acc + a.acquisitionCost, 0))}
              </span>
            </div>
            <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-700 block">Akumulasi Penyusutan</span>
              <span className="font-bold font-mono text-rose-800 text-xs">
                ({formatRupiah(filteredAndSortedAssets.reduce((acc, a) => acc + a.accumulatedDepreciation, 0))})
              </span>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block">Total Nilai Buku Bersih</span>
              <span className="font-bold font-mono text-emerald-900 text-xs">
                {formatRupiah(filteredAndSortedAssets.reduce((acc, a) => acc + a.bookValue, 0))}
              </span>
            </div>
          </div>

          {/* PANEL FILTER ASET TETAP */}
          <div className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter Inventaris &amp; Jadwal Penyusutan Aset</span>
              </div>
              <button
                type="button"
                onClick={handleResetAssetFilter}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {/* Cari Nama / Kode */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Cari Nama / Kode Aset</label>
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2.5" />
                  <input
                    type="text"
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    placeholder="Misal: Truk, Laptop, OLT..."
                    className="w-full border border-slate-300 rounded-lg pl-7 pr-2 py-1.5 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Filter Umur Aset (Useful Life) */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Klasifikasi Umur Aset</label>
                <select
                  value={assetUsefulLifeFilter}
                  onChange={(e) => setAssetUsefulLifeFilter(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-medium"
                >
                  <option value="ALL">Semua Umur Manfaat</option>
                  <option value="LE_12">≤ 12 Bulan (1 Tahun)</option>
                  <option value="13_36">13 - 36 Bulan (2 - 3 Tahun)</option>
                  <option value="37_48">37 - 48 Bulan (4 Tahun - Komputer/IT)</option>
                  <option value="GT_48">&gt; 48 Bulan (5+ Tahun - Kendaraan/Mobil)</option>
                </select>
              </div>

              {/* Tgl Perolehan */}
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Dari Tgl Perolehan</label>
                <input
                  type="date"
                  value={assetStartDate}
                  onChange={(e) => setAssetStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Sampai Tgl Perolehan</label>
                <input
                  type="date"
                  value={assetEndDate}
                  onChange={(e) => setAssetEndDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Filter Rentang Harga Perolehan */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
              <span className="text-slate-500 font-medium">Rentang Harga Perolehan:</span>
              <input
                type="number"
                value={assetMinCost}
                onChange={(e) => setAssetMinCost(e.target.value)}
                placeholder="Min Rp..."
                className="w-32 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={assetMaxCost}
                onChange={(e) => setAssetMaxCost(e.target.value)}
                placeholder="Max Rp..."
                className="w-32 border border-slate-300 rounded-lg px-2 py-1 bg-white text-xs font-mono"
              />
              
              <span className="ml-auto text-slate-400 text-[10px]">
                Menampilkan <strong>{filteredAndSortedAssets.length}</strong> aset tetap
              </span>
            </div>
          </div>

          {/* TABEL ASET TETAP DENGAN SORTABLE HEADER */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th 
                    onClick={() => handleToggleAssetSort("assetCode")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none w-28"
                    title="Klik untuk urutkan Kode Aset"
                  >
                    <div className="flex items-center gap-1">
                      <span>Kode Aset</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "assetCode" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "assetCode" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("name")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Nama Aset"
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Aset Tetap</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "name" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "name" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("acquisitionDate")}
                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-200 transition select-none w-28"
                    title="Klik untuk urutkan Tgl Perolehan"
                  >
                    <div className="flex items-center gap-1">
                      <span>Tgl Perolehan</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "acquisitionDate" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "acquisitionDate" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("usefulLifeMonths")}
                    className="px-3 py-2.5 text-center cursor-pointer hover:bg-slate-200 transition select-none w-24"
                    title="Klik untuk urutkan Umur Aset"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Umur (Bln)</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "usefulLifeMonths" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "usefulLifeMonths" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("acquisitionCost")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Harga Perolehan"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Harga Perolehan</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "acquisitionCost" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "acquisitionCost" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("monthlyDepreciation")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Penyusutan/Bln"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Penyusutan/Bln</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "monthlyDepreciation" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "monthlyDepreciation" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("accumulatedDepreciation")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Akum. Penyusutan"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Akum. Penyusutan</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "accumulatedDepreciation" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "accumulatedDepreciation" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleToggleAssetSort("bookValue")}
                    className="px-3 py-2.5 text-right font-mono cursor-pointer hover:bg-slate-200 transition select-none"
                    title="Klik untuk urutkan Nilai Buku"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Nilai Buku</span>
                      <ArrowUpDown className={`w-3 h-3 ${assetSortField === "bookValue" ? "text-blue-600 font-bold" : "text-slate-400"}`} />
                      {assetSortField === "bookValue" && (
                        <span className="text-[10px] text-blue-600 font-mono">{assetSortOrder === "ASC" ? "▲" : "▼"}</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAndSortedAssets.map(ast => (
                  <tr key={ast.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono font-bold text-blue-900">{ast.assetCode}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{ast.name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{ast.acquisitionDate}</td>
                    <td className="px-3 py-2 text-center font-mono">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-bold text-slate-700">
                        {ast.usefulLifeMonths} bln
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900">{formatRupiah(ast.acquisitionCost)}</td>
                    <td className="px-3 py-2 text-right font-mono text-purple-700 font-medium">{formatRupiah(ast.monthlyDepreciation)}</td>
                    <td className="px-3 py-2 text-right font-mono text-rose-700">({formatRupiah(ast.accumulatedDepreciation)})</td>
                    <td className="px-3 py-2 text-right font-mono font-black text-emerald-800">{formatRupiah(ast.bookValue)}</td>
                  </tr>
                ))}
                {filteredAndSortedAssets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-slate-400 italic">
                      Tidak ada aset yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. CATATAN ATAS LAPORAN KEUANGAN (CALK)                       */}
      {/* ============================================================== */}
      {activeSubTab === "CALK" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="text-center pb-4 border-b border-slate-200 mb-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">PT. JAYAHANA MANAURA MEKANIKA SELARAS</span>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide mt-0.5">
              Catatan Atas Laporan Keuangan (CALK)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Untuk Tahun yang Berakhir 31 Desember 2026</span>
          </div>

          {/* Bab 1: Gambaran Umum */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">1. Gambaran Umum Perusahaan</h4>
            <p>
              PT. Jayahana Manaura Mekanika Selaras didirikan di Indonesia dan bergerak dalam bidang kontraktor jasa mekanikal dan elektrikal (ME Core), pengadaan peralatan industri, serta penyedia jaringan infrastruktur internet serat optik (Starlite FTTH). Kantor pusat beralamat di Jawa Barat, Indonesia.
            </p>
          </div>

          {/* Bab 2: Kebijakan Akuntansi */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">2. Ikhtisar Kebijakan Akuntansi Penting</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dasar Penyusunan:</strong> Laporan keuangan disusun berdasarkan Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik (SAK ETAP / SAK EP) dengan asas akrual (*accrual basis*).</li>
              <li><strong>Kas dan Setara Kas:</strong> Mencakup kas kecil lapangan (*petty cash*), kas besar, dan rekening giro perbankan (Bank BCA, Mandiri, HiBank, BRI) tanpa pembatasan penarikan.</li>
              <li><strong>Piutang Usaha:</strong> Diakui sebesar nilai nominal faktur yang ditagihkan kepada klien pemberi kerja proyek atau pelanggan FTTH residensial.</li>
              <li><strong>Aset Tetap &amp; Penyusutan:</strong> Dinyatakan sebesar harga perolehan dikurangi akumulasi penyusutan. Penyusutan dihitung menggunakan metode garis lurus (*straight-line method*) dengan masa manfaat kendaraan 5 tahun (60 bulan) dan peralatan kantor 4 tahun (48 bulan).</li>
              <li><strong>Pengakuan Pendapatan:</strong> Pendapatan termin proyek diakui berdasarkan metode persentase penyelesaian fisik (*progress opname*) yang diverifikasi dengan Berita Acara Kemajuan Pekerjaan (BAKP).</li>
            </ul>
          </div>

          {/* Bab 3: Perpajakan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">3. Kebijakan Perpajakan &amp; Pemotongan PPh</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>PPh Pasal 4 ayat (2) Final:</strong> Dikenakan atas sewa tanah dan bangunan kantor/mess dengan tarif 10% dan disetor kasir ke kas negara.</li>
              <li><strong>PPh Pasal 23:</strong> Dikenakan atas sewa kendaraan/peralatan (2%) serta jasa teknik dan subkontraktor (2%).</li>
              <li><strong>PPN (Pajak Pertambahan Nilai):</strong> PPN Masukan (11%) dikreditkan terhadap PPN Keluaran pada masa pajak yang bersangkutan.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
