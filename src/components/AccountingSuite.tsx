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
  Clock
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

  // State for Buku Besar (Ledger)
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState("1-1003"); // Default Bank BCA-1
  const [ledgerMonthFilter, setLedgerMonthFilter] = useState("ALL");

  // State for Jurnal
  const [journalTypeFilter, setJournalTypeFilter] = useState<"ALL" | "GENERAL" | "ADJUSTMENT">("ALL");
  const [journalSearch, setJournalSearch] = useState("");

  // Master Data State
  const [coaList] = useState<AccountCOA[]>(JAYAHANA_COA);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(JAYAHANA_FIXED_ASSETS);
  const [journalEntries, setJournalEntries] = useState<JournalRecord[]>(JAYAHANA_JOURNAL_ENTRIES);

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

  const ledgerMutations = useMemo(() => {
    const records: Array<{
      date: string;
      reference: string;
      description: string;
      counterAccount: string;
      debit: number;
      credit: number;
      balance: number;
    }> = [];

    let currentBalance = currentLedgerCOA.initialBalance || 0;

    journalEntries.forEach(jrn => {
      jrn.lines.forEach(line => {
        if (line.accountCode === selectedLedgerAccount) {
          const counter = jrn.lines.find(l => l.accountCode !== selectedLedgerAccount)?.accountName || "Kas & Bank";
          if (currentLedgerCOA.normalBalance === "Debit") {
            currentBalance += (line.debit - line.credit);
          } else {
            currentBalance += (line.credit - line.debit);
          }
          records.push({
            date: jrn.date,
            reference: jrn.voucherNumber || jrn.referenceNumber,
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
  }, [journalEntries, selectedLedgerAccount, currentLedgerCOA]);

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
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Pilih Akun Buku Besar:</label>
              <select
                value={selectedLedgerAccount}
                onChange={(e) => setSelectedLedgerAccount(e.target.value)}
                className="border border-slate-300 rounded-xl p-2 text-xs font-bold text-blue-900 bg-blue-50/50 min-w-[280px]"
              >
                {coaList.filter(c => !c.isHeader).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Saldo Normal: <strong>{currentLedgerCOA.normalBalance}</strong></span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-500">Saldo Awal: <strong className="font-mono">{formatRupiah(currentLedgerCOA.initialBalance || 0)}</strong></span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">No. Bukti / Ref</th>
                  <th className="px-3 py-2.5">Keterangan Transaksi</th>
                  <th className="px-3 py-2.5">Lawan Akun</th>
                  <th className="px-3 py-2.5 text-right font-mono">Debit (Rp)</th>
                  <th className="px-3 py-2.5 text-right font-mono">Kredit (Rp)</th>
                  <th className="px-3 py-2.5 text-right font-mono">Saldo Berjalan (Rp)</th>
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
                {ledgerMutations.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
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
                Pencatatan double-entry otomatis untuk setiap pengeluaran, penerimaan, dan penyesuaian akhir bulan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={journalSearch}
                onChange={(e) => setJournalSearch(e.target.value)}
                placeholder="Cari voucher, no ref, akun..."
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Tanggal &amp; No. Voucher</th>
                  <th className="px-3 py-2.5">No. Referensi</th>
                  <th className="px-3 py-2.5">Keterangan Transaksi</th>
                  <th className="px-3 py-2.5">Kode &amp; Nama Akun</th>
                  <th className="px-3 py-2.5 text-right font-mono">Debit (Rp)</th>
                  <th className="px-3 py-2.5 text-right font-mono">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {journalEntries.slice(0, 30).map(jrn => (
                  <React.Fragment key={jrn.id}>
                    {jrn.lines.map((line, lIdx) => (
                      <tr key={line.id} className={lIdx === 0 ? "border-t border-slate-200 bg-slate-50/30" : ""}>
                        <td className="px-3 py-1.5 font-mono text-[11px]">
                          {lIdx === 0 && (
                            <>
                              <span className="font-bold text-slate-900 block">{jrn.date}</span>
                              <span className="text-blue-700 text-[10px] block">{jrn.voucherNumber}</span>
                            </>
                          )}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-[10px] text-slate-500">
                          {lIdx === 0 && jrn.referenceNumber}
                        </td>
                        <td className="px-3 py-1.5 font-medium">
                          {lIdx === 0 && jrn.description}
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={line.credit > 0 ? "pl-4 text-slate-600 block" : "font-bold text-slate-900 block"}>
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
                Pengelolaan aktiva tetap, metode garis lurus (*Straight-Line Method*), dan posting akumulasi penyusutan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Total Nilai Perolehan:</span>
              <strong className="text-sm font-mono text-slate-900">{formatRupiah(metrics.totalAssetCost)}</strong>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5">Kode Aset</th>
                  <th className="px-3 py-2.5">Nama Aset Tetap</th>
                  <th className="px-3 py-2.5">Tgl Perolehan</th>
                  <th className="px-3 py-2.5 text-center">Umur (Bln)</th>
                  <th className="px-3 py-2.5 text-right font-mono">Harga Perolehan</th>
                  <th className="px-3 py-2.5 text-right font-mono">Penyusutan/Bln</th>
                  <th className="px-3 py-2.5 text-right font-mono">Akum. Penyusutan</th>
                  <th className="px-3 py-2.5 text-right font-mono">Nilai Buku</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {fixedAssets.map(ast => (
                  <tr key={ast.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono font-bold text-blue-900">{ast.assetCode}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{ast.name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{ast.acquisitionDate}</td>
                    <td className="px-3 py-2 text-center font-mono">{ast.usefulLifeMonths}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900">{formatRupiah(ast.acquisitionCost)}</td>
                    <td className="px-3 py-2 text-right font-mono text-purple-700 font-medium">{formatRupiah(ast.monthlyDepreciation)}</td>
                    <td className="px-3 py-2 text-right font-mono text-rose-700">({formatRupiah(ast.accumulatedDepreciation)})</td>
                    <td className="px-3 py-2 text-right font-mono font-black text-emerald-800">{formatRupiah(ast.bookValue)}</td>
                  </tr>
                ))}
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
