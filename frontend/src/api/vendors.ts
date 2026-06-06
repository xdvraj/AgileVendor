import apiClient from '@/api/client';
import type { BackendVendorStatus, Vendor, VendorStatus } from '@/types';

type BackendVendor = {
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
  createdAt: string;
  updatedAt: string;
};

type VendorResponse = {
  success: boolean;
  message?: string;
  data: BackendVendor;
};

type VendorsResponse = {
  success: boolean;
  count: number;
  data: BackendVendor[];
};

export type VendorFormInput = {
  name: string;
  category: string;
  status: VendorStatus;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  gstNumber: string;
};

const vendorStatusLabels: Record<BackendVendorStatus, VendorStatus> = {
  active: 'Active',
  inactive: 'Inactive',
  blacklisted: 'Blacklisted'
};

const backendStatusByLabel: Record<VendorStatus, BackendVendorStatus> = {
  Active: 'active',
  Inactive: 'inactive',
  Blacklisted: 'blacklisted',
  Pending: 'inactive',
  Review: 'inactive'
};

const mapVendor = (vendor: BackendVendor): Vendor => ({
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
  lastUpdated: vendor.updatedAt,
  gstNumber: vendor.gstNumber || '',
  rating: vendor.rating ?? 0,
  address: vendor.address || '',
  backendStatus: vendor.status
});

export const fetchVendors = async () => {
  const response = await apiClient.get<VendorsResponse>('/vendors');
  return response.data.data.map(mapVendor);
};

export const fetchVendorById = async (id: string) => {
  const response = await apiClient.get<VendorResponse>(`/vendors/${id}`);
  return mapVendor(response.data.data);
};

export const createVendor = async (vendor: VendorFormInput) => {
  const response = await apiClient.post<VendorResponse>('/vendors', {
    companyName: vendor.name,
    contactPerson: vendor.contactName,
    email: vendor.email,
    phone: vendor.phone,
    gstNumber: vendor.gstNumber || undefined,
    category: vendor.category || undefined,
    address: vendor.location || undefined,
    status: backendStatusByLabel[vendor.status]
  });

  return mapVendor(response.data.data);
};
