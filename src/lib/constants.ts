import { 
  BusinessUnit, 
  CostCenter, 
  StarliteSubscriber, 
  StarliteInvoice, 
  BudgetRequest,
  FinancialTransaction,
  MonthlyFinancialSummary 
} from "@/types";

export const COMPANY_NAME = "PT. Jayahana Manaura Mekanika Selaras";

export const BUSINESS_UNITS: { key: BusinessUnit; label: string; color: string; desc: string }[] = [
  {
    key: "ME_CORE",
    label: "Jasa Mekanik & Elektronik (ME Core)",
    color: "bg-blue-600 text-white",
    desc: "Proyek instalasi, perawatan, dan pengadaan sistem ME industri dan gedung.",
  },
  {
    key: "STARLITE_FTTH",
    label: "Starlite (Fiber to the Home)",
    color: "bg-fuchsia-600 text-white",
    desc: "Ekspansi infrastruktur jaringan fiber optik & layanan internet berlangganan.",
  },
  {
    key: "OVERHEAD_OPERASIONAL",
    label: "Overhead & Operasional Kantor",
    color: "bg-slate-600 text-white",
    desc: "Biaya umum, utilitas kantor pusat, HR/GA, dan perizinan.",
  },
];

export const INITIAL_COST_CENTERS: CostCenter[] = [
  {
    id: "cc-me-01",
    code: "CC-ME-2026-001",
    name: "Proyek Instalasi Listrik & Panel Pabrik KIIC",
    unit: "ME_CORE",
    projectCode: "SPK-ME-KIIC-01",
    budgetLimit: 250000000,
    allocatedAmount: 180000000,
    spentAmount: 145000000,
  },
  {
    id: "cc-me-02",
    code: "CC-ME-2026-002",
    name: "Maintenance Chiller & HVAC Gedung Menara",
    unit: "ME_CORE",
    projectCode: "SPK-ME-MNR-04",
    budgetLimit: 120000000,
    allocatedAmount: 90000000,
    spentAmount: 72500000,
  },
  {
    id: "cc-star-01",
    code: "CC-STAR-EXP-01",
    name: "Penggelaran OLT & Feeder Cluster Sentul City",
    unit: "STARLITE_FTTH",
    clusterCode: "CLUSTER-SENTUL-01",
    budgetLimit: 400000000,
    allocatedAmount: 320000000,
    spentAmount: 285000000,
  },
  {
    id: "cc-star-02",
    code: "CC-STAR-OPEX-01",
    name: "Operasional Drop Cable & Pasang Baru Pelanggan",
    unit: "STARLITE_FTTH",
    clusterCode: "OPS-INSTALL-ALL",
    budgetLimit: 85000000,
    allocatedAmount: 60000000,
    spentAmount: 48200000,
  },
];

export const INITIAL_REQUESTS: BudgetRequest[] = [
  {
    id: "req-001",
    requestNumber: "PR-2026-ME-019",
    title: "Pengadaan Kabel NYY 4x16mm & MCB Schneider",
    unit: "ME_CORE",
    costCenterId: "cc-me-01",
    requesterName: "Agus Pratama",
    requesterRole: "SITE_SPV",
    requestType: "PURCHASE_REQUISITION",
    totalAmount: 18500000,
    status: "DISBURSED",
    purpose: "Material lanjutan instalasi panel incoming pabrik KIIC",
    createdAt: "2026-11-10",
    items: [
      { id: "itm-1", description: "Kabel NYY 4x16mm (100 meter)", quantity: 2, unit: "Roll", estimatedPrice: 7500000, totalPrice: 15000000 },
      { id: "itm-2", description: "MCB 3 Phase 63A Schneider", quantity: 5, unit: "Pcs", estimatedPrice: 700000, totalPrice: 3500000 }
    ]
  },
  {
    id: "req-002",
    requestNumber: "CA-2026-STAR-042",
    title: "Kas Bon Operasional Penarikan Kabel ODP Sentul",
    unit: "STARLITE_FTTH",
    costCenterId: "cc-star-01",
    requesterName: "Rudi Haryanto",
    requesterRole: "FIELD_TECH",
    requestType: "CASH_ADVANCE",
    totalAmount: 3500000,
    status: "PENDING_FINANCE",
    purpose: "BBM mobil operasional tangga, konsumsi lembur tim teknisi, dan klem tiang darurat",
    createdAt: "2026-11-16",
    items: [
      { id: "itm-3", description: "BBM Operasional Lapangan", quantity: 1, unit: "Paket", estimatedPrice: 1000000, totalPrice: 1000000 },
      { id: "itm-4", description: "Aksesoris Klem Tiang & Suspension", quantity: 50, unit: "Pcs", estimatedPrice: 30000, totalPrice: 1500000 },
      { id: "itm-5", description: "Uang Makan & Lembur Teknisi (4 org)", quantity: 4, unit: "Orang", estimatedPrice: 250000, totalPrice: 1000000 }
    ]
  }
];

export const INITIAL_SUBSCRIBERS: StarliteSubscriber[] = [
  {
    id: "sub-001",
    customerNumber: "STL-2026-0001",
    fullName: "Bambang Sudibyo",
    phone: "081234567890",
    address: "Jl. Dahlia No. 12, Cluster Sentul",
    cluster: "Sentul City",
    odpCode: "ODP-STL-04/02",
    packagePlan: "Starlite Home 50 Mbps",
    monthlyFee: 299000,
    status: "ACTIVE",
    installedAt: "2026-09-15",
    billingDueDay: 10,
  },
  {
    id: "sub-002",
    customerNumber: "STL-2026-0002",
    fullName: "Indah Permatasari",
    phone: "081398765432",
    address: "Jl. Mawar Raya No. 45, Cluster Sentul",
    cluster: "Sentul City",
    odpCode: "ODP-STL-04/05",
    packagePlan: "Starlite Home 100 Mbps",
    monthlyFee: 449000,
    status: "ACTIVE",
    installedAt: "2026-10-01",
    billingDueDay: 10,
  },
  {
    id: "sub-003",
    customerNumber: "STL-2026-0003",
    fullName: "CV. Abadi Surya (SOHO)",
    phone: "082111223344",
    address: "Ruko Sentul Niaga Blok B-03",
    cluster: "Sentul City",
    odpCode: "ODP-STL-02/01",
    packagePlan: "Starlite Business 200 Mbps",
    monthlyFee: 1250000,
    status: "ACTIVE",
    installedAt: "2026-10-20",
    billingDueDay: 15,
  }
];

export const INITIAL_INVOICES: StarliteInvoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-STL-2611-001",
    subscriberId: "sub-001",
    subscriberName: "Bambang Sudibyo",
    periodMonth: "2026-11",
    amount: 299000,
    dueDate: "2026-11-10",
    paymentStatus: "PAID",
    paidAt: "2026-11-08",
    paymentMethod: "TRANSFER_BCA"
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-STL-2611-002",
    subscriberId: "sub-002",
    subscriberName: "Indah Permatasari",
    periodMonth: "2026-11",
    amount: 449000,
    dueDate: "2026-11-10",
    paymentStatus: "PAID",
    paidAt: "2026-11-09",
    paymentMethod: "TRANSFER_MANDIRI"
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-STL-2611-003",
    subscriberId: "sub-003",
    subscriberName: "CV. Abadi Surya (SOHO)",
    periodMonth: "2026-11",
    amount: 1250000,
    dueDate: "2026-11-15",
    paymentStatus: "OVERDUE"
  }
];

// Recent Multi-Channel Transactions (Income & Expense)
export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx-001",
    transactionNumber: "TX-IN-20261118-01",
    date: "2026-11-18",
    description: "Pembayaran Termin II Proyek Mekanikal & Elektrikal Pabrik KIIC",
    unit: "ME_CORE",
    type: "INCOME",
    category: "Termin Kontrak Jasa ME",
    amount: 175000000,
    status: "COMPLETED",
    paymentMethod: "Bank Mandiri (VA)",
    recipientOrPayer: "PT. Global Chemindo Industri (Klien)"
  },
  {
    id: "tx-002",
    transactionNumber: "TX-OUT-20261117-02",
    date: "2026-11-17",
    description: "Pengadaan Kabel Fiber Optik Drop Core 1000m & Splitter PLC ODP",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Capex Rollout Jaringan",
    amount: 14200000,
    status: "COMPLETED",
    paymentMethod: "Bank BCA Bisnis",
    recipientOrPayer: "PT. Fiberindo Mandiri Sukses"
  },
  {
    id: "tx-003",
    transactionNumber: "TX-IN-20261116-03",
    date: "2026-11-16",
    description: "Penerimaan Tagihan Internet Starlite Cluster Sentul (Batch 1)",
    unit: "STARLITE_FTTH",
    type: "INCOME",
    category: "Pendapatan Langganan FTTH",
    amount: 8640000,
    status: "COMPLETED",
    paymentMethod: "Payment Gateway QRIS/BCA",
    recipientOrPayer: "18 Pelanggan Residensial"
  },
  {
    id: "tx-004",
    transactionNumber: "TX-OUT-20261115-04",
    date: "2026-11-15",
    description: "Kas Bon Operasional Penarikan Kabel Feeder OLT Sentul",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Kas Bon Operasional",
    amount: 3500000,
    status: "COMPLETED",
    paymentMethod: "Kas Bon Kasir Lapangan",
    recipientOrPayer: "Rudi Haryanto (Teknisi)"
  },
  {
    id: "tx-005",
    transactionNumber: "TX-OUT-20261114-05",
    date: "2026-11-14",
    description: "Beban Upstream Bandwidth 1 Gbps Dedicated Dedicated Internet",
    unit: "STARLITE_FTTH",
    type: "EXPENSE",
    category: "Opex Bandwidth Upstream",
    amount: 18500000,
    status: "COMPLETED",
    paymentMethod: "Bank BCA",
    recipientOrPayer: "PT. Lintas Data Jaringan (NAP)"
  },
  {
    id: "tx-006",
    transactionNumber: "TX-OUT-20261112-06",
    date: "2026-11-12",
    description: "Pembelian MCB Schneider & Panel Distribusi Proyek Menara",
    unit: "ME_CORE",
    type: "EXPENSE",
    category: "Material Proyek",
    amount: 22800000,
    status: "COMPLETED",
    paymentMethod: "Transfer Mandiri",
    recipientOrPayer: "Toko Sinar Elektrik Jaya"
  },
  {
    id: "tx-007",
    transactionNumber: "TX-IN-20261110-07",
    date: "2026-11-10",
    description: "Biaya Pasang Baru (PSB) Pelanggan Bisnis Sentul Niaga",
    unit: "STARLITE_FTTH",
    type: "INCOME",
    category: "Pendapatan PSB & Registrasi",
    amount: 2500000,
    status: "COMPLETED",
    paymentMethod: "Transfer BCA",
    recipientOrPayer: "CV. Abadi Surya"
  },
  {
    id: "tx-008",
    transactionNumber: "TX-OUT-20261108-08",
    date: "2026-11-08",
    description: "Utilitas Kantor Pusat, Internet Backup, & Konsumsi Meeting",
    unit: "OVERHEAD_OPERASIONAL",
    type: "EXPENSE",
    category: "Overhead Umum & GA",
    amount: 6750000,
    status: "COMPLETED",
    paymentMethod: "Petty Cash Kantor",
    recipientOrPayer: "Divisi GA & HR"
  }
];

// Historical Monthly Summary Data for Filtering (2024, 2025, 2026)
export const HISTORICAL_FINANCIAL_DATA: MonthlyFinancialSummary[] = [
  // Tahun 2026
  { month: "Jan", monthNum: 1, year: 2026, income: 145000000, expense: 98000000, meExpense: 65000000, ftthExpense: 23000000, overheadExpense: 10000000 },
  { month: "Feb", monthNum: 2, year: 2026, income: 160000000, expense: 112000000, meExpense: 72000000, ftthExpense: 28000000, overheadExpense: 12000000 },
  { month: "Mar", monthNum: 3, year: 2026, income: 185000000, expense: 130000000, meExpense: 85000000, ftthExpense: 33000000, overheadExpense: 12000000 },
  { month: "Apr", monthNum: 4, year: 2026, income: 170000000, expense: 125000000, meExpense: 80000000, ftthExpense: 32000000, overheadExpense: 13000000 },
  { month: "Mei", monthNum: 5, year: 2026, income: 210000000, expense: 148000000, meExpense: 95000000, ftthExpense: 40000000, overheadExpense: 13000000 },
  { month: "Jun", monthNum: 6, year: 2026, income: 230000000, expense: 165000000, meExpense: 105000000, ftthExpense: 45000000, overheadExpense: 15000000 },
  { month: "Jul", monthNum: 7, year: 2026, income: 245000000, expense: 172000000, meExpense: 110000000, ftthExpense: 47000000, overheadExpense: 15000000 },
  { month: "Agu", monthNum: 8, year: 2026, income: 260000000, expense: 188000000, meExpense: 115000000, ftthExpense: 58000000, overheadExpense: 15000000 },
  { month: "Sep", monthNum: 9, year: 2026, income: 290000000, expense: 205000000, meExpense: 125000000, ftthExpense: 64000000, overheadExpense: 16000000 },
  { month: "Okt", monthNum: 10, year: 2026, income: 310000000, expense: 220000000, meExpense: 130000000, ftthExpense: 72000000, overheadExpense: 18000000 },
  { month: "Nov", monthNum: 11, year: 2026, income: 285000000, expense: 195000000, meExpense: 118000000, ftthExpense: 61000000, overheadExpense: 16000000 },
  { month: "Des", monthNum: 12, year: 2026, income: 340000000, expense: 235000000, meExpense: 140000000, ftthExpense: 75000000, overheadExpense: 20000000 },

  // Tahun 2025
  { month: "Jan", monthNum: 1, year: 2025, income: 110000000, expense: 80000000, meExpense: 55000000, ftthExpense: 15000000, overheadExpense: 10000000 },
  { month: "Feb", monthNum: 2, year: 2025, income: 125000000, expense: 90000000, meExpense: 65000000, ftthExpense: 15000000, overheadExpense: 10000000 },
  { month: "Mar", monthNum: 3, year: 2025, income: 140000000, expense: 102000000, meExpense: 75000000, ftthExpense: 17000000, overheadExpense: 10000000 },
  { month: "Apr", monthNum: 4, year: 2025, income: 135000000, expense: 98000000, meExpense: 70000000, ftthExpense: 18000000, overheadExpense: 10000000 },
  { month: "Mei", monthNum: 5, year: 2025, income: 150000000, expense: 110000000, meExpense: 80000000, ftthExpense: 19000000, overheadExpense: 11000000 },
  { month: "Jun", monthNum: 6, year: 2025, income: 165000000, expense: 120000000, meExpense: 85000000, ftthExpense: 23000000, overheadExpense: 12000000 },
  { month: "Jul", monthNum: 7, year: 2025, income: 175000000, expense: 128000000, meExpense: 90000000, ftthExpense: 26000000, overheadExpense: 12000000 },
  { month: "Agu", monthNum: 8, year: 2025, income: 180000000, expense: 135000000, meExpense: 95000000, ftthExpense: 28000000, overheadExpense: 12000000 },
  { month: "Sep", monthNum: 9, year: 2025, income: 195000000, expense: 142000000, meExpense: 100000000, ftthExpense: 30000000, overheadExpense: 12000000 },
  { month: "Okt", monthNum: 10, year: 2025, income: 210000000, expense: 155000000, meExpense: 110000000, ftthExpense: 32000000, overheadExpense: 13000000 },
  { month: "Nov", monthNum: 11, year: 2025, income: 220000000, expense: 160000000, meExpense: 112000000, ftthExpense: 34000000, overheadExpense: 14000000 },
  { month: "Des", monthNum: 12, year: 2025, income: 240000000, expense: 178000000, meExpense: 120000000, ftthExpense: 42000000, overheadExpense: 16000000 },

  // Tahun 2024
  { month: "Jan", monthNum: 1, year: 2024, income: 80000000, expense: 60000000, meExpense: 48000000, ftthExpense: 5000000, overheadExpense: 7000000 },
  { month: "Feb", monthNum: 2, year: 2024, income: 85000000, expense: 64000000, meExpense: 51000000, ftthExpense: 6000000, overheadExpense: 7000000 },
  { month: "Mar", monthNum: 3, year: 2024, income: 95000000, expense: 70000000, meExpense: 56000000, ftthExpense: 6000000, overheadExpense: 8000000 },
  { month: "Apr", monthNum: 4, year: 2024, income: 90000000, expense: 68000000, meExpense: 54000000, ftthExpense: 6000000, overheadExpense: 8000000 },
  { month: "Mei", monthNum: 5, year: 2024, income: 100000000, expense: 75000000, meExpense: 60000000, ftthExpense: 7000000, overheadExpense: 8000000 },
  { month: "Jun", monthNum: 6, year: 2024, income: 110000000, expense: 82000000, meExpense: 66000000, ftthExpense: 8000000, overheadExpense: 8000000 },
  { month: "Jul", monthNum: 7, year: 2024, income: 115000000, expense: 85000000, meExpense: 68000000, ftthExpense: 9000000, overheadExpense: 8000000 },
  { month: "Agu", monthNum: 8, year: 2024, income: 120000000, expense: 89000000, meExpense: 71000000, ftthExpense: 10000000, overheadExpense: 8000000 },
  { month: "Sep", monthNum: 9, year: 2024, income: 130000000, expense: 95000000, meExpense: 76000000, ftthExpense: 10000000, overheadExpense: 9000000 },
  { month: "Okt", monthNum: 10, year: 2024, income: 135000000, expense: 99000000, meExpense: 78000000, ftthExpense: 11000000, overheadExpense: 10000000 },
  { month: "Nov", monthNum: 11, year: 2024, income: 140000000, expense: 102000000, meExpense: 80000000, ftthExpense: 12000000, overheadExpense: 10000000 },
  { month: "Des", monthNum: 12, year: 2024, income: 150000000, expense: 112000000, meExpense: 88000000, ftthExpense: 13000000, overheadExpense: 11000000 }
];

// Pending Approvals Queue (Budget Requests & LPJ Realizations)
export interface PendingApprovalItem {
  id: string;
  type: 'BUDGET_REQUEST' | 'LPJ_REALIZATION';
  docNumber: string;
  title: string;
  unit: BusinessUnit;
  requester: string;
  amount: number;
  submittedAt: string;
  level: string; // e.g. "SPV Operasional", "Finance / Kasir", "Direksi"
  urgent: boolean;
}

export const INITIAL_PENDING_APPROVALS: PendingApprovalItem[] = [
  {
    id: "appr-01",
    type: "BUDGET_REQUEST",
    docNumber: "CA-2026-STAR-042",
    title: "Kas Bon Operasional Penarikan Kabel ODP Sentul",
    unit: "STARLITE_FTTH",
    requester: "Rudi Haryanto (Teknisi Lapangan)",
    amount: 3500000,
    submittedAt: "2026-11-16",
    level: "Finance / Kasir",
    urgent: true
  },
  {
    id: "appr-02",
    type: "BUDGET_REQUEST",
    docNumber: "PR-2026-ME-020",
    title: "Pengadaan Pipa Konduit & Cable Tray Gedung Menara",
    unit: "ME_CORE",
    requester: "Agus Pratama (Site SPV)",
    amount: 14750000,
    submittedAt: "2026-11-17",
    level: "Division Head ME",
    urgent: false
  },
  {
    id: "appr-03",
    type: "LPJ_REALIZATION",
    docNumber: "LPJ-2026-ME-015",
    title: "LPJ Pembelian Solar Genset Proyek KIIC (Nota Terlampir)",
    unit: "ME_CORE",
    requester: "Sandi Kurnia (Logistik)",
    amount: 5200000,
    submittedAt: "2026-11-17",
    level: "Verifikasi Kasir",
    urgent: true
  },
  {
    id: "appr-04",
    type: "LPJ_REALIZATION",
    docNumber: "LPJ-2026-STAR-039",
    title: "LPJ Splicer Maintenance & Transport Teknisi",
    unit: "STARLITE_FTTH",
    requester: "Fajar Nugraha (Teknisi FTTH)",
    amount: 2800000,
    submittedAt: "2026-11-18",
    level: "Verifikasi Kasir",
    urgent: false
  }
];

// Division Budget Capaian Data Helper per Year
export const DIVISION_BUDGET_YEARS: Record<number, Array<{
  unit: BusinessUnit;
  name: string;
  code: string;
  pagu: number;
  terpakai: number;
  terencana: number;
  iconName: string;
  color: string;
}>> = {
  2026: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 850000000,
      terpakai: 625000000,
      terencana: 120000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 950000000,
      terpakai: 742000000,
      terencana: 150000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 220000000,
      terpakai: 165000000,
      terencana: 30000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ],
  2025: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 720000000,
      terpakai: 680000000,
      terencana: 20000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 500000000,
      terpakai: 460000000,
      terencana: 25000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 180000000,
      terpakai: 162000000,
      terencana: 10000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ],
  2024: [
    {
      unit: "ME_CORE",
      name: "Divisi Jasa Mekanik & Elektronik (ME)",
      code: "DIV-ME",
      pagu: 550000000,
      terpakai: 512000000,
      terencana: 15000000,
      iconName: "Building2",
      color: "blue"
    },
    {
      unit: "STARLITE_FTTH",
      name: "Divisi Ekspansi Starlite FTTH",
      code: "DIV-STARLITE",
      pagu: 200000000,
      terpakai: 185000000,
      terencana: 10000000,
      iconName: "Wifi",
      color: "fuchsia"
    },
    {
      unit: "OVERHEAD_OPERASIONAL",
      name: "Divisi Operasional & Umum (GA/HR)",
      code: "DIV-OPS",
      pagu: 140000000,
      terpakai: 132000000,
      terencana: 5000000,
      iconName: "ShieldCheck",
      color: "slate"
    }
  ]
};

