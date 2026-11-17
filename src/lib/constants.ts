import { BusinessUnit, CostCenter, StarliteSubscriber, StarliteInvoice, BudgetRequest } from "@/types";

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
