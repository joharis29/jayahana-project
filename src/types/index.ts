export type BusinessUnit = 'ME_CORE' | 'STARLITE_FTTH' | 'OVERHEAD_OPERASIONAL';

export type UserRole = 
  | 'FIELD_TECH'
  | 'SITE_SPV'
  | 'PROCUREMENT'
  | 'DIVISION_HEAD'
  | 'FINANCE_CASHIER'
  | 'ACCOUNTING_TAX'
  | 'DIRECTOR'
  | 'SUPERADMIN';

export type RequestType = 'CASH_ADVANCE' | 'PURCHASE_REQUISITION' | 'REIMBURSEMENT';

export type ApprovalStatus = 
  | 'DRAFT'
  | 'PENDING_SPV'
  | 'PENDING_HEAD'
  | 'PENDING_FINANCE'
  | 'PENDING_DIRECTOR'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISBURSED'
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

export interface BudgetRequest {
  id: string;
  requestNumber: string;
  title: string;
  unit: BusinessUnit;
  costCenterId: string;
  requesterName: string;
  requesterRole: UserRole;
  requestType: RequestType;
  totalAmount: number;
  status: ApprovalStatus;
  items: BudgetRequestItem[];
  purpose: string;
  createdAt: string;
  disbursedAt?: string;
  settledAt?: string;
}

export interface ExpenseRealization {
  id: string;
  requestId: string;
  receiptNumber: string;
  vendorName: string;
  totalActualAmount: number;
  differenceAmount: number; // positive = refund to cashier, negative = additional reimbursement
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
