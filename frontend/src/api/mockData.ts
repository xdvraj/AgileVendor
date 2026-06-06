import type { ActivityLog, Approval, Invoice, PurchaseOrder, Report, Rfq, RfqQuote, Vendor } from '@/types';

export const vendors: Vendor[] = [
  {
    id: 'V-1024',
    name: 'Northwind Industrial',
    category: 'Raw Materials',
    status: 'Active',
    contactName: 'Samantha Reed',
    email: 'samantha@northwind.example',
    phone: '+1 (312) 555-0188',
    location: 'Chicago, IL',
    score: 92,
    onTimeRate: '96%',
    totalSpend: 480000,
    pendingRfqs: 2,
    lastUpdated: '2026-06-05'
  },
  {
    id: 'V-1038',
    name: 'Harbor Freight Systems',
    category: 'Warehousing',
    status: 'Review',
    contactName: 'Leo Hampton',
    email: 'leo@harborfreight.example',
    phone: '+1 (713) 555-0191',
    location: 'Houston, TX',
    score: 78,
    onTimeRate: '88%',
    totalSpend: 215000,
    pendingRfqs: 1,
    lastUpdated: '2026-06-03'
  },
  {
    id: 'V-1044',
    name: 'Atlas Office Supply',
    category: 'Office & Facilities',
    status: 'Pending',
    contactName: 'Mina Shah',
    email: 'mina@atlasoffice.example',
    phone: '+1 (646) 555-0126',
    location: 'New York, NY',
    score: 85,
    onTimeRate: '91%',
    totalSpend: 124000,
    pendingRfqs: 3,
    lastUpdated: '2026-06-04'
  },
  {
    id: 'V-1059',
    name: 'Summit Packaging Co.',
    category: 'Packaging',
    status: 'Active',
    contactName: 'Jordan Miles',
    email: 'jordan@summitpack.example',
    phone: '+1 (206) 555-0147',
    location: 'Seattle, WA',
    score: 94,
    onTimeRate: '98%',
    totalSpend: 368000,
    pendingRfqs: 1,
    lastUpdated: '2026-06-02'
  }
];

export const rfqs: Rfq[] = [
  {
    id: 'RFQ-3001',
    title: 'Bulk corrugated packaging refresh',
    category: 'Packaging',
    issueDate: '2026-06-01',
    dueDate: '2026-06-12',
    status: 'Open',
    budget: 125000,
    requester: 'Procurement Team',
    vendorIds: ['V-1059', 'V-1044'],
    itemCount: 6
  },
  {
    id: 'RFQ-3002',
    title: 'Warehouse equipment service contract',
    category: 'Warehousing',
    issueDate: '2026-05-28',
    dueDate: '2026-06-09',
    status: 'Awaiting Quotes',
    budget: 86000,
    requester: 'Operations',
    vendorIds: ['V-1038', 'V-1024'],
    itemCount: 4
  },
  {
    id: 'RFQ-3003',
    title: 'Steel fasteners annual sourcing',
    category: 'Raw Materials',
    issueDate: '2026-05-24',
    dueDate: '2026-06-07',
    status: 'Evaluation',
    budget: 210000,
    requester: 'Manufacturing',
    vendorIds: ['V-1024', 'V-1059', 'V-1044'],
    itemCount: 9
  }
];

export const rfqQuotes: Record<string, RfqQuote[]> = {
  'RFQ-3001': [
    { vendorId: 'V-1059', price: 119500, leadTimeDays: 8, score: 91, terms: 'Net 30' },
    { vendorId: 'V-1044', price: 121000, leadTimeDays: 10, score: 87, terms: 'Net 45' }
  ],
  'RFQ-3002': [
    { vendorId: 'V-1038', price: 84300, leadTimeDays: 14, score: 82, terms: 'Net 30' },
    { vendorId: 'V-1024', price: 85750, leadTimeDays: 11, score: 89, terms: 'Net 30' }
  ],
  'RFQ-3003': [
    { vendorId: 'V-1024', price: 205000, leadTimeDays: 12, score: 92, terms: 'Net 45' },
    { vendorId: 'V-1059', price: 209000, leadTimeDays: 9, score: 94, terms: 'Net 30' },
    { vendorId: 'V-1044', price: 214500, leadTimeDays: 13, score: 84, terms: 'Net 30' }
  ]
};

export const approvals: Approval[] = [
  {
    id: 'APR-820',
    type: 'Vendor Onboarding',
    subject: 'Atlas Office Supply qualification',
    requester: 'Nina Patel',
    submittedAt: '2026-06-05',
    priority: 'Medium',
    status: 'In Review'
  },
  {
    id: 'APR-821',
    type: 'RFQ Award',
    subject: 'Award RFQ-3003 to Northwind Industrial',
    requester: 'Marcus Chen',
    submittedAt: '2026-06-04',
    priority: 'High',
    status: 'Queued'
  },
  {
    id: 'APR-822',
    type: 'Budget Change',
    subject: 'Increase packaging budget by 8%',
    requester: 'Olivia Torres',
    submittedAt: '2026-06-02',
    priority: 'Low',
    status: 'Approved'
  }
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-7102',
    vendorName: 'Northwind Industrial',
    total: 145000,
    status: 'Released',
    deliveryDate: '2026-06-18',
    owner: 'Marcus Chen'
  },
  {
    id: 'PO-7103',
    vendorName: 'Summit Packaging Co.',
    total: 96000,
    status: 'Partially Received',
    deliveryDate: '2026-06-10',
    owner: 'Sofia James'
  },
  {
    id: 'PO-7104',
    vendorName: 'Atlas Office Supply',
    total: 28500,
    status: 'Draft',
    deliveryDate: '2026-06-22',
    owner: 'Nina Patel'
  }
];

export const invoices: Invoice[] = [
  {
    id: 'INV-4408',
    vendorName: 'Northwind Industrial',
    amount: 38500,
    dueDate: '2026-06-14',
    status: 'Due Soon',
    poNumber: 'PO-7102'
  },
  {
    id: 'INV-4409',
    vendorName: 'Summit Packaging Co.',
    amount: 61200,
    dueDate: '2026-06-08',
    status: 'Current',
    poNumber: 'PO-7103'
  },
  {
    id: 'INV-4410',
    vendorName: 'Harbor Freight Systems',
    amount: 22000,
    dueDate: '2026-06-01',
    status: 'Overdue',
    poNumber: 'PO-7088'
  }
];

export const activityLogs: ActivityLog[] = [
  {
    id: 'ACT-1001',
    actor: 'Marcus Chen',
    action: 'approved',
    target: 'PO-7102 release',
    timestamp: '2026-06-05T11:10:00Z',
    channel: 'Workflow'
  },
  {
    id: 'ACT-1002',
    actor: 'Samantha Reed',
    action: 'submitted quote for',
    target: 'RFQ-3003',
    timestamp: '2026-06-05T09:35:00Z',
    channel: 'Vendor Portal'
  },
  {
    id: 'ACT-1003',
    actor: 'Nina Patel',
    action: 'created vendor profile',
    target: 'Atlas Office Supply',
    timestamp: '2026-06-04T16:20:00Z',
    channel: 'Vendor Master'
  }
];

export const reports: Report[] = [
  {
    id: 'REP-21',
    name: 'Spend by Category',
    description: 'Tracks monthly procurement spend across sourcing categories.',
    updatedAt: '2026-06-05',
    owner: 'Finance Ops',
    type: 'Analytics'
  },
  {
    id: 'REP-22',
    name: 'Supplier Risk Snapshot',
    description: 'Highlights compliance, quality, and delivery risk trends.',
    updatedAt: '2026-06-03',
    owner: 'Vendor Management',
    type: 'Risk'
  },
  {
    id: 'REP-23',
    name: 'Approval Cycle Time',
    description: 'Measures throughput for procurement and finance approvals.',
    updatedAt: '2026-06-02',
    owner: 'Shared Services',
    type: 'Operations'
  }
];

export const getVendorById = (id: string) => vendors.find((vendor) => vendor.id === id);
export const getRfqById = (id: string) => rfqs.find((rfq) => rfq.id === id);
