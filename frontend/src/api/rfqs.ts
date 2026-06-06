import apiClient from '@/api/client';
import type { BackendVendorStatus, Rfq, RfqStatus, Vendor } from '@/types';

type BackendAssignedVendor = {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber?: string;
  category?: string;
  address?: string;
  status: BackendVendorStatus;
  rating?: number;
};

type BackendUser = {
  _id: string;
  name: string;
  email: string;
};

type BackendRfqItem = {
  productName: string;
  description?: string;
  quantity: number;
  unit?: string;
};

type BackendRfq = {
  _id: string;
  rfqNumber: string;
  title: string;
  category?: string;
  description?: string;
  items: BackendRfqItem[];
  budgetTarget?: number;
  issueDate?: string;
  deadline: string;
  status: BackendRfqStatus;
  assignedVendors: BackendAssignedVendor[];
  createdBy?: BackendUser;
  createdAt: string;
  updatedAt: string;
};

type BackendRfqStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'CLOSED'
  | 'UNDER_REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PO_CREATED';

type RfqResponse = {
  success: boolean;
  message?: string;
  data: BackendRfq;
};

type RfqsResponse = {
  success: boolean;
  count: number;
  data: BackendRfq[];
};

export type RfqFormInput = {
  title: string;
  category: string;
  budget: number;
  issueDate: string;
  dueDate: string;
  scopeSummary: string;
  assignedVendorIds: string[];
};

const vendorStatusLabels: Record<BackendVendorStatus, Vendor['status']> = {
  active: 'Active',
  inactive: 'Inactive',
  blacklisted: 'Blacklisted'
};

const rfqStatusLabels: Record<BackendRfqStatus, RfqStatus> = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  CLOSED: 'Closed',
  UNDER_REVIEW: 'Under Review',
  APPROVAL_PENDING: 'Approval Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PO_CREATED: 'PO Created'
};

const mapAssignedVendor = (vendor: BackendAssignedVendor): Vendor => ({
  id: vendor._id,
  name: vendor.companyName,
  category: vendor.category || 'Unassigned',
  status: vendorStatusLabels[vendor.status],
  contactName: vendor.contactPerson,
  email: vendor.email,
  phone: vendor.phone,
  location: vendor.address || 'Not provided',
  score: Math.round((vendor.rating ?? 0) * 20),
  onTimeRate: 'N/A',
  totalSpend: 0,
  pendingRfqs: 0,
  lastUpdated: '',
  gstNumber: vendor.gstNumber || '',
  rating: vendor.rating ?? 0,
  address: vendor.address || '',
  backendStatus: vendor.status
});

const mapRfq = (rfq: BackendRfq): Rfq => ({
  id: rfq.rfqNumber || rfq._id,
  backendId: rfq._id,
  title: rfq.title,
  category: rfq.category || rfq.items[0]?.productName || 'General',
  issueDate: rfq.issueDate || rfq.createdAt,
  dueDate: rfq.deadline,
  status: rfqStatusLabels[rfq.status],
  budget: rfq.budgetTarget ?? 0,
  requester: rfq.createdBy?.name || 'Workspace User',
  vendorIds: rfq.assignedVendors.map((vendor) => vendor._id),
  itemCount: rfq.items.length,
  description: rfq.description || '',
  assignedVendorDetails: rfq.assignedVendors.map(mapAssignedVendor)
});

export const fetchRfqs = async () => {
  const response = await apiClient.get<RfqsResponse>('/rfqs');
  return response.data.data.map(mapRfq);
};

export const fetchRfqById = async (id: string) => {
  const response = await apiClient.get<RfqResponse>(`/rfqs/${id}`);
  return mapRfq(response.data.data);
};

export const createRfq = async (rfq: RfqFormInput) => {
  const response = await apiClient.post<RfqResponse>('/rfqs', {
    title: rfq.title,
    category: rfq.category || undefined,
    description: rfq.scopeSummary || undefined,
    budgetTarget: rfq.budget || 0,
    issueDate: rfq.issueDate || undefined,
    deadline: rfq.dueDate,
    status: 'OPEN',
    assignedVendors: rfq.assignedVendorIds,
    items: [
      {
        productName: rfq.category || rfq.title,
        description: rfq.scopeSummary || undefined,
        quantity: 1,
        unit: 'lot'
      }
    ]
  });

  return mapRfq(response.data.data);
};
