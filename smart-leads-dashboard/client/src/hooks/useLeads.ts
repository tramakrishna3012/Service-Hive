import { useState, useEffect, useCallback } from 'react';
import { fetchLeads } from '../api/leadsApi';
import { Lead, LeadFilters, PaginationMeta } from '../types/lead.types';
import { useDebounce } from './useDebounce';
import { useLeadsStore } from '../store/leadsSlice';

export const useLeads = (filters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setStorePagination = useLeadsStore((s) => s.setPagination);

  const debouncedSearch = useDebounce(filters.search ?? '', 400);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchLeads({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(response.data);
      setPagination(response.pagination);
      setStorePagination(response.pagination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch leads';
      setError(message);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.status,
    filters.source,
    filters.sort,
    filters.page,
    filters.limit,
    debouncedSearch,
    setStorePagination,
  ]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return { leads, pagination, isLoading, error, refetch: loadLeads };
};
