"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Wifi, 
  Wallet, 
  Receipt, 
  Users, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Filter
} from "lucide-react";
import { 
  COMPANY_NAME, 
  BUSINESS_UNITS, 
  INITIAL_COST_CENTERS, 
  INITIAL_REQUESTS, 
  INITIAL_SUBSCRIBERS, 
  INITIAL_INVOICES 
} from "@/lib/constants";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { BusinessUnit, BudgetRequest, RequestType, UserRole } from "@/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "lpj" | "starlite" | "reports">("overview");
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | "ALL">("ALL");
  const [requests, setRequests] = useState<BudgetRequest[]>(INITIAL_REQUESTS);
  
  // New request modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUnit, setNewUnit] = useState<BusinessUnit>("STARLITE_FTTH");
  const [newType, setNewType] = useState<RequestType>("CASH_ADVANCE");
  const [newAmount, setNewAmount] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [requesterName, setRequesterName] = useState("Tim Lapangan");

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newReq: BudgetRequest = {
      id: `req-${Date.now()}`,
      requestNumber: `${newType === "CASH_ADVANCE" ? "CA" : "PR"}-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      unit: newUnit,
      costCenterId: newUnit === "STARLITE_FTTH" ? "cc-star-01" : "cc-me-01",
      requesterName: requesterName,
      requesterRole: newType === "CASH_ADVANCE" ? "FIELD_TECH" : "SITE_SPV",
      requestType: newType,
      totalAmount: parseFloat(newAmount),
      status: "PENDING_SPV",
      purpose: newPurpose,
      createdAt: new Date().toISOString().split("T")[0],
      items: [
        {
          id: `item-${Date.now()}`,
          description: newTitle,
          quantity: 1,
          unit: "Paket",
          estimatedPrice: parseFloat(newAmount),
          totalPrice: parseFloat(newAmount),
        }
      ]
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewAmount("");
    setNewPurpose("");
  };

  // Metrics calculation
  const totalBudget = INITIAL_COST_CENTERS.reduce((acc, c) => acc + c.budgetLimit, 0);
  const totalSpent = INITIAL_COST_CENTERS.reduce((acc, c) => acc + c.spentAmount, 0);
  const totalSubscribers = INITIAL_SUBSCRIBERS.length;
  const totalMonthlyAR = INITIAL_SUBSCRIBERS.reduce((acc, s) => acc + s.monthlyFee, 0);
  const paidInvoicesCount = INITIAL_INVOICES.filter(i => i.paymentStatus === "PAID").length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-xl">
              J
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {COMPANY_NAME}
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sistem Keuangan, Pengadaan & Ekosistem Starlite FTTH
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pengajuan Baru</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-slate-100 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-700 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Ringkasan Eksekutif
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-700 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Pengajuan Anggaran & Kas Bon
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {requests.filter(r => r.status.startsWith("PENDING")).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lpj")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "lpj"
                ? "border-blue-600 text-blue-700 font-semibold"
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
                ? "border-fuchsia-600 text-fuchsia-700 font-semibold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Wifi className="w-4 h-4 text-fuchsia-600" />
            Starlite FTTH (Billing & AR)
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-fuchsia-100 text-fuchsia-800 font-bold">
              {totalSubscribers} Klien
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "reports"
                ? "border-blue-600 text-blue-700 font-semibold"
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
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Pagu Anggaran</span>
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">{formatRupiah(totalBudget)}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span>Realisasi terserap:</span>
                  <span className="font-semibold text-slate-700">{formatRupiah(totalSpent)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${Math.round((totalSpent / totalBudget) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Jasa ME (Cost Realization)</span>
                  <Building2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {formatRupiah(INITIAL_COST_CENTERS.filter(c => c.unit === "ME_CORE").reduce((a, b) => a + b.spentAmount, 0))}
                </div>
                <p className="text-xs text-slate-500 mt-1">2 Proyek Aktif (KIIC & Menara)</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Starlite FTTH Capex</span>
                  <Wifi className="w-4 h-4 text-fuchsia-600" />
                </div>
                <div className="text-xl font-bold text-fuchsia-700">
                  {formatRupiah(INITIAL_COST_CENTERS.filter(c => c.unit === "STARLITE_FTTH").reduce((a, b) => a + b.spentAmount, 0))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Rollout Sentul & Pasang Baru</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Potensi Omset FTTH / Bln</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-emerald-700">{formatRupiah(totalMonthlyAR)}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                  <span>Terbayar bulan ini:</span>
                  <span className="font-bold text-emerald-600">{paidInvoicesCount} / {INITIAL_INVOICES.length}</span>
                </div>
              </div>
            </div>

            {/* Business Units Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {BUSINESS_UNITS.slice(0, 2).map((unit) => {
                const centers = INITIAL_COST_CENTERS.filter(c => c.unit === unit.key);
                const unitBudget = centers.reduce((a, b) => a + b.budgetLimit, 0);
                const unitSpent = centers.reduce((a, b) => a + b.spentAmount, 0);

                return (
                  <div key={unit.key} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {unit.key === "ME_CORE" ? (
                          <Building2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Wifi className="w-5 h-5 text-fuchsia-600" />
                        )}
                        <h3 className="font-bold text-slate-900 text-sm">{unit.label}</h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {Math.round((unitSpent / unitBudget) * 100)}% Terpakai
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4">{unit.desc}</p>

                    <div className="space-y-3">
                      {centers.map(center => (
                        <div key={center.id} className="p-3 rounded-lg bg-slate-50 border border-slate-150">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{center.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {center.projectCode || center.clusterCode}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-900">{formatRupiah(center.spentAmount)}</div>
                              <div className="text-[10px] text-slate-500">Pagu: {formatRupiah(center.budgetLimit)}</div>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                            <div 
                              className={`h-1 rounded-full ${unit.key === "ME_CORE" ? "bg-blue-600" : "bg-fuchsia-600"}`}
                              style={{ width: `${Math.min(100, (center.spentAmount / center.budgetLimit) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Status Bar */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Alur Keuangan Berjalan Otomatis & Terintegrasi
                </h4>
                <p className="text-xs text-blue-200 mt-1 max-w-2xl">
                  Setiap pengajuan kas bon lapangan dan pengadaan langsung dipetakan ke cost center proyek atau cluster Starlite FTTH. Setelah diverifikasi nota realisasinya, jurnal otomatis langsung terisi.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("requests")}
                className="px-4 py-2 bg-white text-blue-900 rounded-lg text-xs font-bold hover:bg-blue-50 transition whitespace-nowrap shadow-sm"
              >
                Tinjau Pengajuan Masuk &rarr;
              </button>
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
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
                >
                  <option value="ALL">Semua Divisi / Unit</option>
                  <option value="ME_CORE">Jasa ME Core</option>
                  <option value="STARLITE_FTTH">Starlite FTTH</option>
                </select>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
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

      {/* Modal: Buat Pengajuan Baru */}
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
    </div>
  );
}
