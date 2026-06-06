export type NavItem = {
  label: string;
  to: string;
  icon: string;
};

export type VendorStatus = 'Active' | 'Pending' | 'Review';
export type RfqStatus = 'Open' | 'Awaiting Quotes' | 'Evaluation' | 'Awarded';
export type ApprovalPriority = 'Low' | 'Medium' | 'High';
export type ApprovalStatus = 'Queued' | 'In Review' | 'Approved';
export type InvoiceStatus = 'Current' | 'Due Soon' | 'Overdue' | 'Paid';
export type PurchaseOrderStatus = 'Draft' | 'Released' | 'Partially Received' | 'Completed';

export type Vendor = {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  score: number;
  onTimeRate: string;
  totalSpend: number;
  pendingRfqs: number;
  lastUpdated: string;
};

export type Rfq = {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  dueDate: string;
  status: RfqStatus;
  budget: number;
  requester: string;
  vendorIds: string[];
  itemCount: number;
};

export type RfqQuote = {
  vendorId: string;
  price: number;
  leadTimeDays: number;
  score: number;
  terms: string;
};

export type Approval = {
  id: string;
  type: string;
  subject: string;
  requester: string;
  submittedAt: string;
  priority: ApprovalPriority;
  status: ApprovalStatus;
};

export type PurchaseOrder = {
  id: string;
  vendorName: string;
  total: number;
  status: PurchaseOrderStatus;
  deliveryDate: string;
  owner: string;
};

export type Invoice = {
  id: string;
  vendorName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  poNumber: string;
};

export type ActivityLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  channel: string;
};

export type Report = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  owner: string;
  type: string;
};
