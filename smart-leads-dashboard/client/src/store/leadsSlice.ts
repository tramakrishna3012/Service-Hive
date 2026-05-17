import { create } from 'zustand';
import { Lead, LeadFilters, PaginationMeta } from '../types/lead.types';

interface LeadsStore {
  filters: LeadFilters;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  pagination: PaginationMeta | null;
  setPagination: (pagination: PaginationMeta | null) => void;
}

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

export const useLeadsStore = create<LeadsStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  pagination: null,
  setPagination: (pagination) => set({ pagination }),
}));
