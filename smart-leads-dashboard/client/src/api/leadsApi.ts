import axiosInstance from './axiosInstance';
import {
  Lead,
  LeadFilters,
  LeadFormData,
  LeadsResponse,
} from '../types/lead.types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const buildParams = (filters: LeadFilters): Record<string, string | number> => {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    sort: filters.sort ?? 'latest',
  };
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  return params;
};

export const fetchLeads = async (
  filters: LeadFilters
): Promise<LeadsResponse> => {
  const { data } = await axiosInstance.get<LeadsResponse>('/leads', {
    params: buildParams(filters),
  });
  return data;
};

export const fetchLeadById = async (id: string): Promise<Lead> => {
  const { data } = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
  return data.data;
};

export const createLead = async (payload: LeadFormData): Promise<Lead> => {
  const { data } = await axiosInstance.post<ApiResponse<Lead>>(
    '/leads',
    payload
  );
  return data.data;
};

export const updateLead = async (
  id: string,
  payload: Partial<LeadFormData>
): Promise<Lead> => {
  const { data } = await axiosInstance.put<ApiResponse<Lead>>(
    `/leads/${id}`,
    payload
  );
  return data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/leads/${id}`);
};

export const exportLeadsCSV = async (filters: LeadFilters): Promise<Blob> => {
  const { data } = await axiosInstance.get<Blob>('/leads/export', {
    params: buildParams(filters),
    responseType: 'blob',
  });
  return data;
};

export const fetchDashboardStats = async (): Promise<{
  total: number;
  new: number;
  qualified: number;
  lost: number;
  recent: Lead[];
}> => {
  const [allRes, newRes, qualifiedRes, lostRes, recentRes] = await Promise.all([
    axiosInstance.get<LeadsResponse>('/leads', { params: { limit: 1, page: 1 } }),
    axiosInstance.get<LeadsResponse>('/leads', {
      params: { status: 'New', limit: 1, page: 1 },
    }),
    axiosInstance.get<LeadsResponse>('/leads', {
      params: { status: 'Qualified', limit: 1, page: 1 },
    }),
    axiosInstance.get<LeadsResponse>('/leads', {
      params: { status: 'Lost', limit: 1, page: 1 },
    }),
    axiosInstance.get<LeadsResponse>('/leads', {
      params: { limit: 5, page: 1, sort: 'latest' },
    }),
  ]);

  return {
    total: allRes.data.pagination.total,
    new: newRes.data.pagination.total,
    qualified: qualifiedRes.data.pagination.total,
    lost: lostRes.data.pagination.total,
    recent: recentRes.data.data,
  };
};
