// ============================================================
// RBAC — Role-Based Access Control
// PT. Jayahana Manaura Mekanika Selaras | ERP & Billing 2026
// ============================================================

import { UserRole } from "@/types";

// ── Modules ─────────────────────────────────────────────────
export type AppModule =
  | "DASHBOARD"
  | "PENGAJUAN"
  | "PENCAIRAN"
  | "REALISASI"
  | "PENERIMAAN_BARANG"
  | "PENDAPATAN_AR"
  | "BUKU_BESAR"
  | "USER_MANAGEMENT";

// ── Actions ──────────────────────────────────────────────────
export type AppAction =
  | "VIEW"
  | "CREATE"
  | "EDIT"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "DISBURSE"
  | "EXPORT";

export interface Permission {
  module: AppModule;
  actions: AppAction[];
}

// ── Permission Matrix ────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  FIELD_TECH: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "CREATE"] },
  ],
  SITE_SPV: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "CREATE", "EDIT", "APPROVE", "REJECT"] },
    { module: "REALISASI",   actions: ["VIEW", "CREATE", "EDIT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW", "CREATE"] },
  ],
  PROCUREMENT: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "CREATE", "EDIT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW", "CREATE", "EDIT"] },
  ],
  DIVISION_HEAD: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "CREATE", "EDIT", "APPROVE", "REJECT"] },
    { module: "PENCAIRAN",   actions: ["VIEW"] },
    { module: "REALISASI",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW", "APPROVE"] },
  ],
  INTERNAL_AUDIT: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENCAIRAN",   actions: ["VIEW"] },
    { module: "REALISASI",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "BUKU_BESAR",  actions: ["VIEW", "EXPORT"] },
    { module: "PENDAPATAN_AR", actions: ["VIEW"] },
  ],
  FINANCE_CASHIER: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW"] },
    { module: "PENCAIRAN",   actions: ["VIEW", "DISBURSE"] },
    { module: "PENDAPATAN_AR", actions: ["VIEW", "CREATE", "EDIT"] },
    { module: "REALISASI",   actions: ["VIEW"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW"] },
  ],
  FINANCE_MANAGER: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENCAIRAN",   actions: ["VIEW", "DISBURSE"] },
    { module: "REALISASI",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENDAPATAN_AR", actions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW"] },
    { module: "BUKU_BESAR",  actions: ["VIEW", "EXPORT"] },
  ],
  ACCOUNTING_TAX: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW"] },
    { module: "PENCAIRAN",   actions: ["VIEW"] },
    { module: "REALISASI",   actions: ["VIEW"] },
    { module: "PENDAPATAN_AR", actions: ["VIEW", "CREATE", "EDIT"] },
    { module: "BUKU_BESAR",  actions: ["VIEW", "CREATE", "EDIT", "DELETE", "EXPORT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW"] },
  ],
  DIRECTOR: [
    { module: "DASHBOARD",   actions: ["VIEW"] },
    { module: "PENGAJUAN",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENCAIRAN",   actions: ["VIEW"] },
    { module: "REALISASI",   actions: ["VIEW", "APPROVE", "REJECT"] },
    { module: "PENDAPATAN_AR", actions: ["VIEW", "CREATE"] },
    { module: "BUKU_BESAR",  actions: ["VIEW", "EXPORT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW"] },
  ],
  SUPERADMIN: [
    { module: "DASHBOARD",         actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "PENGAJUAN",         actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "PENCAIRAN",         actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "REALISASI",         actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "PENERIMAAN_BARANG", actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "PENDAPATAN_AR",     actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "BUKU_BESAR",        actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
    { module: "USER_MANAGEMENT",   actions: ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "REJECT", "DISBURSE", "EXPORT"] },
  ],
};

// ── Helper ───────────────────────────────────────────────────
export function hasPermission(role: UserRole, module: AppModule, action: AppAction): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.some((p) => p.module === module && p.actions.includes(action));
}

// ── Role Labels ──────────────────────────────────────────────
export const ROLE_LABELS: Record<UserRole, string> = {
  FIELD_TECH:       "Teknisi Lapangan",
  SITE_SPV:         "Supervisor Site",
  PROCUREMENT:      "Pengadaan",
  DIVISION_HEAD:    "Kepala Divisi / PM",
  INTERNAL_AUDIT:   "Audit Internal",
  FINANCE_CASHIER:  "Kasir Keuangan",
  FINANCE_MANAGER:  "Manager Keuangan",
  ACCOUNTING_TAX:   "Akuntansi & Pajak",
  DIRECTOR:         "Direktur",
  SUPERADMIN:       "Super Admin",
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  FIELD_TECH:       { bg: "bg-slate-100",   text: "text-slate-700",   border: "border-slate-300" },
  SITE_SPV:         { bg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-300" },
  PROCUREMENT:      { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-300" },
  DIVISION_HEAD:    { bg: "bg-indigo-100",  text: "text-indigo-700",  border: "border-indigo-300" },
  INTERNAL_AUDIT:   { bg: "bg-orange-100",  text: "text-orange-700",  border: "border-orange-300" },
  FINANCE_CASHIER:  { bg: "bg-teal-100",    text: "text-teal-700",    border: "border-teal-300" },
  FINANCE_MANAGER:  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  ACCOUNTING_TAX:   { bg: "bg-purple-100",  text: "text-purple-700",  border: "border-purple-300" },
  DIRECTOR:         { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-300" },
  SUPERADMIN:       { bg: "bg-pink-100",    text: "text-pink-700",    border: "border-pink-300" },
};

// ── Seed Users ───────────────────────────────────────────────
import { AppUser } from "@/types";

export const SEED_USERS: AppUser[] = [
  {
    id: "u-001",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@jayahana.co.id",
    username: "ahmad.fauzi",
    password: "jayahana123",
    role: "FIELD_TECH",
    unit: "Bandung",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-002",
    name: "Budi Santoso",
    email: "budi.santoso@jayahana.co.id",
    username: "budi.santoso",
    password: "jayahana123",
    role: "SITE_SPV",
    unit: "Rajeg & Pasar Kemis",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-003",
    name: "Cahyani Dewi",
    email: "cahyani.dewi@jayahana.co.id",
    username: "cahyani.dewi",
    password: "jayahana123",
    role: "PROCUREMENT",
    unit: "HO - Purchasing & Logistics",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-24",
  },
  {
    id: "u-004",
    name: "Darto Wibowo",
    email: "darto.wibowo@jayahana.co.id",
    username: "darto.wibowo",
    password: "jayahana123",
    role: "DIVISION_HEAD",
    unit: "HO - General Manager",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-005",
    name: "Eka Nurjanah",
    email: "eka.nurjanah@jayahana.co.id",
    username: "eka.nurjanah",
    password: "jayahana123",
    role: "INTERNAL_AUDIT",
    unit: "HO - Finance",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-006",
    name: "Faridah Hasanah",
    email: "faridah.hasanah@jayahana.co.id",
    username: "faridah.hasanah",
    password: "jayahana123",
    role: "FINANCE_CASHIER",
    unit: "HO - Finance",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-007",
    name: "Gunawan Prakoso",
    email: "gunawan.prakoso@jayahana.co.id",
    username: "gunawan.prakoso",
    password: "jayahana123",
    role: "FINANCE_MANAGER",
    unit: "HO - Finance",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-008",
    name: "Hendra Laksono",
    email: "hendra.laksono@jayahana.co.id",
    username: "hendra.laksono",
    password: "jayahana123",
    role: "ACCOUNTING_TAX",
    unit: "HO - Finance",
    isActive: true,
    createdAt: "2026-01-10",
    lastLogin: "2026-11-24",
  },
  {
    id: "u-009",
    name: "Ir. Susanto",
    email: "susanto@jayahana.co.id",
    username: "susanto",
    password: "direktur2026",
    role: "DIRECTOR",
    unit: "HO - Direktur",
    isActive: true,
    createdAt: "2026-01-01",
    lastLogin: "2026-11-25",
  },
  {
    id: "u-010",
    name: "Admin System",
    email: "admin@jayahana.co.id",
    username: "admin",
    password: "admin2026",
    role: "SUPERADMIN",
    unit: "HO - IT",
    isActive: true,
    createdAt: "2026-01-01",
    lastLogin: "2026-11-26",
  },
];
