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
  "Reimbursement",
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
  | 'PENDING_PM'
  | 'PENDING_GM'
  | 'PENDING_FINANCE'
  | 'PENDING_DIRECTOR'
  | 'APPROVED_READY_PAY'
  | 'DISBURSED'
  | 'NEED_REVISION'
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
  proofAttachment?: RequestAttachment; // Bukti transfer m-banking / slip setoran
  notes?: string;
}

export interface RealizationItem {
  id: string;
  receiptDate: string;
  description: string;
  amount: number;
  receiptNumber: string;
  vendor: string;
  receiptAttachment?: RequestAttachment;
}

export type LPJApprovalStatus =
  | 'PENDING_SUBMISSION'
  | 'PENDING_AUDIT'
  | 'PENDING_PM'
  | 'PENDING_GM'
  | 'PENDING_DIRECTOR'
  | 'PENDING_FINANCE_SETTLEMENT'
  | 'WAITING_REIMBURSEMENT'
  | 'NEED_REVISION'
  | 'COMPLETED'
  | 'REJECTED'
  | 'PENDING_FINANCE';

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
  status: LPJApprovalStatus;
  items: RealizationItem[];
  reimbursementRequestId?: string;
  reimbursementRequestNumber?: string;
  refundReceiptNumber?: string;
  refundReceivedAt?: string;
  refundProofAttachment?: RequestAttachment;
  revisionNote?: string;
  rejectedNote?: string;
  auditNotes?: string;
  pmNotes?: string;
  gmNotes?: string;
  directorNotes?: string;
  financeNotes?: string;
  receiptAttachments?: RequestAttachment[];
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
  taxDetails?: TaxCalculationDetail;
  disbursedAt?: string;
  settledAt?: string;
  revisionNote?: string;
  rejectedNote?: string;
  revisionHistory?: Array<{ role: string; name: string; note: string; date: string; action: 'REVISION' | 'REJECT' }>;
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
  | 'UNPAID'
  | 'PAID_FULL'
  | 'PARTIAL_PAID'
  | 'OVERDUE'
  | 'PENDING_AUDIT_PROGRESS'
  | 'PENDING_FINANCE_TAX'
  | 'PENDING_DIRECTOR'
  | 'APPROVED_ISSUED';

export interface InvoicePaymentRecord {
  paymentId: string;
  paymentDate: string;
  amountPaid: number;
  voucherNumber: string; // "BKM-2026-11-001"
  bankAccount: string; // "Bank BCA - 731-0982-11"
  paymentMethod: 'TRANSFER_BANK' | 'CASH';
  referenceNote: string;
  receivedBy: string;
  installmentNumber?: number;
  remainingBalance?: number;
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
  category?: string; // "Jasa & Kontrak ME", "Starlite FTTH", "Pengadaan Barang", dll.
  title: string;
  description: string;
  invoiceDate: string;
  dueDate: string;
  progressPercent?: number; // e.g. 30 (Termin I 30%)
  dppAmount: number; // Dasar Pengenaan Pajak
  ppnPercent: number; // 11%
  ppnAmount: number;
  isPpnIncluded?: boolean;
  taxType?: TaxType;
  pph23Percent?: number; // 2%
  pph23Amount?: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  targetBankAccount: string;
  auditProgressNote?: string;
  financeTaxNote?: string;
  directorApprovalDate?: string;
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  attachments?: RequestAttachment[];
  payments?: InvoicePaymentRecord[];
}

export interface OfficialReceiptBKM {
  id: string;
  receiptNumber: string; // "BKM-2026-11-001" or "BTI-2026-11-001"
  receiptType?: 'SALES_INVOICE' | 'OTHER_INCOME' | 'INTERNAL_TRANSFER';
  category?: string; // e.g. "Pelunasan Faktur Penjualan", "Pendapatan Jasa Giro/Bunga Bank", "Penjualan Sisa Material/Scrap", "Pemindahbukuan Antar Kas & Bank", dll.
  invoiceNumber?: string;
  clientName: string;
  amountReceived: number;
  receivedDate: string;
  paymentMethod: string;
  bankTarget: string;
  sourceAccount?: string; // Akun pengirim (e.g. "Petty Cash Operasional", "Bank BCA 800-xxx")
  targetAccount?: string; // Akun penerima (e.g. "Bank Mandiri 130-xxx")
  adminFee?: number; // Biaya administrasi transfer bank (misal Rp 2.500)
  forPaymentOf: string;
  cashierName: string;
  authorizedBy: string;
  proofAttachment?: RequestAttachment;
  referenceNumber?: string;
  installmentNumber?: number;
  totalInvoiceAmount?: number;
  remainingBalance?: number;
  isInstallment?: boolean;
  isNonRevenue?: boolean; // Menandai mutasi internal aset lancar neraca (tidak dihitung omset)
}

// Tax Engine Calculation Detail
export type TaxType = 'NONE' | 'PPH_21' | 'PPH_23_RENT' | 'PPH_23_SERVICE' | 'PPH_4_2_LAND' | 'PPH_4_2_BUILDING';

export interface TaxCalculationDetail {
  taxType: TaxType;
  taxTypeName?: string; // e.g. "PPh 4(2) Final Sewa Tanah 10%", "PPh 23 Sewa Barang 2%", "PPh 23 Jasa 2%", "PPh 21 Tenaga Kerja"
  taxPercent: number; // e.g. 10 or 2 or 5
  dppAmount: number;
  taxAmount: number;
  hasPpn: boolean;
  isPpnIncluded: boolean;
  ppnPercent: number; // e.g. 11
  ppnAmount: number;
  grossAmount: number;
  netPayableToVendor: number;
  taxWithheldPayable: number;
  targetTaxAccount: string; // e.g. "2-4007 Hutang Pajak PPH Psl 4 ayat 2" | "2-4004 Hutang Pajak PPH 23"
}

// Accounting & Financial Reporting Models based on JAYAHANA 2026.xlsm
export interface AccountCOA {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  category: 'ASET_LANCAR' | 'ASET_TETAP' | 'ASET_LAINNYA' | 'KEWAJIBAN_PENDEK' | 'KEWAJIBAN_PANJANG' | 'EKUITAS' | 'PENDAPATAN' | 'HPP_PROYEK' | 'BEBAN_OPERASIONAL' | 'PENDAPATAN_LAIN' | 'BEBAN_LAIN';
  normalBalance: 'Debit' | 'Kredit';
  isHeader?: boolean;
  initialBalance: number;
  balance: number;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalRecord {
  id: string;
  voucherNumber: string; // e.g. "001-BO2601" or "JV-2026-11-001"
  date: string;
  month: number;
  referenceNumber: string; // No. Ref Dokumen (BKK, BKM, INV, SPK)
  description: string;
  unit: BusinessUnit;
  lines: JournalLine[];
  isAdjustment?: boolean; // True jika Jurnal Penyesuaian (AJP)
  postedAt?: string;
}

export interface FixedAsset {
  id: string;
  assetCode: string;
  name: string;
  acquisitionDate: string;
  usefulLifeMonths: number;
  acquisitionCost: number;
  salvageValue?: number;
  accumulatedDepreciation: number;
  monthlyDepreciation: number;
  bookValue: number;
  depreciationAccount: string; // e.g. "6-4015 Beban Penyusutan Peralatan & Aset"
  accumulatedAccount: string; // e.g. "1-7005 Akumulasi Penyusutan Peralatan"
  unitLocation?: string;
}

export interface WorksheetRow {
  accountCode: string;
  accountName: string;
  normalBalance: 'Debit' | 'Kredit';
  category: string;
  trialDebit: number;
  trialCredit: number;
  adjDebit: number;
  adjCredit: number;
  adjTrialDebit: number;
  adjTrialCredit: number;
  incomeDebit: number;
  incomeCredit: number;
  balanceDebit: number;
  balanceCredit: number;
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

