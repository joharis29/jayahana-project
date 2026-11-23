export const SITE_DIVISIONS = [
  "Rajeg & Pasar Kemis",
  "Bandung",
  "Tagogapu",
  "Padalarang",
  "Gadobangkong",
  "Cicalengka",
  "Cimahi",
  "Ciledug",
  "Songgom",
  "Nganjuk",
  "Kediri",
  "Tulungagung",
  "Rejotangan",
  "Blitar",
  "HO - Purchasing & Logistics",
  "HO - Permit",
  "HO - Survey and Design",
  "HO - Document Control",
  "HO - Sales",
  "HO - HR-GA",
  "HO - IT",
  "HO - Finance",
  "HO - General Manager",
  "HO - Direktur",
] as const;

export type SiteDivision = typeof SITE_DIVISIONS[number];

export const EXPENSE_CATEGORIES = [
  "Akomodasi",
  "ATP",
  "Bagi Hasil",
  "BPJS",
  "Dinas",
  "Donasi",
  "Entertain",
  "Fee sales",
  "Gaji",
  "Insentif",
  "Kasbon",
  "Kompensasi",
  "Mandor",
  "Operasional",
  "Operasional Mess",
  "Operasional Permit",
  "OTF",
  "Pajak",
  "Pengawalan",
  "Perlengkapan & Peralatan",
  "Permit",
  "Petty Cash",
  "Pinjaman",
  "PNSI",
  "PT Lunar Global",
  "Recurring",
  "Sewa",
  "Survey",
  "Token listrik",
  "Tukang",
  "Upah",
  "Wifi",
  "WO",
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export type BusinessUnit = 'ME_CORE' | 'STARLITE_FTTH' | 'OVERHEAD_OPERASIONAL' | SiteDivision | string;

export type UserRole = 
  | 'FIELD_TECH'
  | 'SITE_SPV'
  | 'PROCUREMENT'
  | 'DIVISION_HEAD'
  | 'INTERNAL_AUDIT'
  | 'FINANCE_CASHIER'
  | 'FINANCE_MANAGER'
  | 'ACCOUNTING_TAX'
  | 'DIRECTOR'
  | 'SUPERADMIN';

export type RequestType = 'CASH_ADVANCE' | 'PURCHASE_REQUISITION' | 'REIMBURSEMENT';

export type ApprovalStatus = 
  | 'DRAFT'
  | 'PENDING_AUDIT'
  | 'PENDING_FINANCE'
  | 'PENDING_DIRECTOR'
  | 'APPROVED_READY_PAY'
  | 'DISBURSED'
  | 'REALIZED_PENDING_AUDIT'
  | 'REALIZED_PENDING_FINANCE'
  | 'REALIZED_PENDING_DIRECTOR'
  | 'COMPLETED'
  | 'REJECTED'
  // Legacy compatibility
  | 'PENDING_SPV'
  | 'PENDING_HEAD'
  | 'APPROVED'
  | 'SETTLED';

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  unit: BusinessUnit;
  budgetLimit: number;
  allocatedAmount: number;
  spentAmount: number;
  projectCode?: string; // For ME (e.g. SPK-2026-ME-01)
  clusterCode?: string; // For Starlite (e.g. CLUSTER-BOGOR-01)
}

export interface ProcurementItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string; // Pcs, Roll, Meter, Unit, Box, Lot
  unitPrice: number;
  discountPercent?: number;
  totalPrice: number;
  notes?: string;
}

export interface ProcurementVendorInfo {
  vendorName: string;
  paymentTerms: string; // e.g. "Net 30", "COD", "Cash On Delivery", "Tunai"
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  shippingAddress: string;
  remarks: string;
  fobType?: string; // FOB Shipping Point / Destination
  isTaxable?: boolean;
  isTaxIncluded?: boolean;
}

export interface ApprovalHistoryEntry {
  stage: 'AUDIT' | 'FINANCE' | 'DIRECTOR';
  approverName: string;
  approverRole: string;
  status: 'APPROVED' | 'REJECTED' | 'REVISED';
  date: string;
  notes?: string;
}

export interface DisbursementRecord {
  disbursedAt: string;
  disbursedBy: string; // "Finance Staff"
  voucherNumber: string; // "BKK-2026-11-002"
  sourceAccount: string; // "BCA Operasional 123-xxx" | "Kas Kecil (Petty Cash)"
  paymentMethod: 'TRANSFER_BANK' | 'CASH_KAS_KECIL';
  transferReference: string;
  amountPaid: number;
  bankReceiptUrl?: string;
}

export interface RealizationItem {
  id: string;
  receiptDate: string;
  description: string;
  amount: number;
  receiptNumber: string;
  vendor: string;
}

export interface RealizationRecord {
  id: string;
  requestId: string;
  lpjNumber: string;
  submittedAt: string;
  submittedBy: string;
  initialAdvanceAmount: number;
  totalRealizedAmount: number;
  balanceDifference: number; // >0: sisa dana disetor ke kasir, <0: klaim reimbursement tambahan
  settlementAction: 'REFUND_TO_CASHIER' | 'REIMBURSE_ADDITIONAL' | 'EXACT';
  status: 'PENDING_AUDIT' | 'PENDING_FINANCE' | 'PENDING_DIRECTOR' | 'COMPLETED' | 'REJECTED';
  items: RealizationItem[];
  auditNotes?: string;
  financeNotes?: string;
  directorNotes?: string;
}

export interface GoodsReceiptItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  qtyOrdered: number;
  qtyReceived: number;
  unit: string;
  condition: 'GOOD' | 'DAMAGED' | 'SHORTAGE';
  physicalAuditNotes: string;
}

export interface GoodsReceiptRecord {
  id: string;
  receiptNumber: string; // "GR-2026-11-001" / "BAST-2026-11-001"
  poNumber: string;
  requestId: string;
  receivedDate: string;
  vendorName: string;
  vendorDeliveryNoteNumber: string; // No. Surat Jalan Pengirim
  auditedBy: string; // "Tim Audit Internal"
  warehouseStaff: string; // "Gudang Sentul"
  overallStatus: 'VERIFIED_GOOD' | 'PARTIAL_ISSUE' | 'REJECTED';
  inspectionLocation: string; // "Gudang Utama Sentul / Site Proyek"
  items: GoodsReceiptItem[];
  notes: string;
}

export interface BudgetRequestItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  totalPrice: number;
  realizedPrice?: number;
  notes?: string;
}

export interface RequestAttachment {
  id: string;
  name: string;
  type: string; // 'application/pdf' | 'image/jpeg' | etc.
  size: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface BudgetRequest {
  id: string;
  requestNumber: string;
  title: string;
  unit: BusinessUnit;
  category?: ExpenseCategory | string;
  costCenterId: string;
  requesterName: string;
  requesterRole: UserRole;
  requestType: RequestType;
  totalAmount: number;
  status: ApprovalStatus;
  items: BudgetRequestItem[];
  procurementItems?: ProcurementItem[];
  vendorInfo?: ProcurementVendorInfo;
  disbursement?: DisbursementRecord;
  realization?: RealizationRecord;
  goodsReceipt?: GoodsReceiptRecord;
  approvalHistory?: ApprovalHistoryEntry[];
  attachments?: RequestAttachment[];
  purpose: string;
  createdAt: string;
  dueDate?: string; // Tanggal Jatuh Tempo (YYYY-MM-DD)
  disbursedAt?: string;
  settledAt?: string;
}

export interface ExpenseRealization {
  id: string;
  requestId: string;
  receiptNumber: string;
  vendorName: string;
  totalActualAmount: number;
  differenceAmount: number;
  receiptImageUrl?: string;
  settledBy?: string;
  verifiedAt?: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
}

// Starlite FTTH Subscriber & Billing Models
export interface StarliteSubscriber {
  id: string;
  customerNumber: string;
  fullName: string;
  phone: string;
  address: string;
  cluster: string;
  odpCode: string; // Optical Distribution Point code
  packagePlan: string;
  monthlyFee: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  installedAt: string;
  billingDueDay: number; // e.g. day 10 of each month
}

export interface StarliteInvoice {
  id: string;
  invoiceNumber: string;
  subscriberId: string;
  subscriberName: string;
  periodMonth: string; // e.g. "2026-11"
  amount: number;
  dueDate: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'OVERDUE';
  paidAt?: string;
  paymentMethod?: 'TRANSFER_BCA' | 'TRANSFER_MANDIRI' | 'CASH';
}

// B2B & B2C Integrated Sales Invoice, Accounts Receivable & Official Receipt Models
export type InvoiceStatus = 
  | 'PENDING_AUDIT_PROGRESS'
  | 'PENDING_FINANCE_TAX'
  | 'PENDING_DIRECTOR'
  | 'APPROVED_ISSUED'
  | 'PAID_FULL'
  | 'PARTIAL_PAID'
  | 'OVERDUE';

export interface InvoicePaymentRecord {
  paymentId: string;
  paymentDate: string;
  amountPaid: number;
  voucherNumber: string; // "BKM-2026-11-001"
  bankAccount: string; // "Bank BCA - 731-0982-11"
  paymentMethod: 'TRANSFER_BANK' | 'CASH';
  referenceNote: string;
  receivedBy: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string; // "INV-2026-ME-001"
  clientName: string;
  clientAddress: string;
  clientNPWP?: string;
  clientPhone?: string;
  contractNumber: string; // "SPK-2026-ME-01" / "SUB-2026-STL-01"
  unit: BusinessUnit;
  title: string;
  description: string;
  invoiceDate: string;
  dueDate: string;
  progressPercent?: number; // e.g. 30 (Termin I 30%)
  dppAmount: number; // Dasar Pengenaan Pajak
  ppnPercent: number; // 11%
  ppnAmount: number;
  pph23Percent?: number; // 2%
  pph23Amount?: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  targetBankAccount: string;
  auditProgressNote?: string;
  financeTaxNote?: string;
  directorApprovalDate?: string;
  payments?: InvoicePaymentRecord[];
}

export interface OfficialReceiptBKM {
  id: string;
  receiptNumber: string; // "BKM-2026-11-001"
  invoiceNumber: string;
  clientName: string;
  amountReceived: number;
  receivedDate: string;
  paymentMethod: string;
  bankTarget: string;
  forPaymentOf: string;
  cashierName: string;
  authorizedBy: string;
}

// Accounting & Financial Reporting Models
export interface AccountCOA {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
}

export interface JournalEntry {
  id: string;
  transactionDate: string;
  referenceNumber: string;
  description: string;
  unit: BusinessUnit;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

// Financial Transaction for Dashboard Feed
export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  description: string;
  unit: BusinessUnit;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'VERIFIED';
  paymentMethod: string;
  recipientOrPayer: string;
}

export interface MonthlyFinancialSummary {
  month: string; // e.g. "Jan", "Feb", ...
  monthNum: number; // 1-12
  year: number;
  income: number;
  expense: number;
  meExpense: number;
  ftthExpense: number;
  overheadExpense: number;
}

