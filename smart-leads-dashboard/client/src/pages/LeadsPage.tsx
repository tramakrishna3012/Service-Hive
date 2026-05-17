import { useState } from 'react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Pagination from '../components/leads/Pagination';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { useLeadsStore } from '../store/leadsSlice';
import {
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../api/leadsApi';
import { downloadBlob } from '../utils/csvExport';
import { Lead, LeadFormData } from '../types/lead.types';

export default function LeadsPage() {
  const { isAdmin } = useAuth();
  const { filters, setFilters } = useLeadsStore();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const { leads, pagination, isLoading, error, refetch } = useLeads({
    ...filters,
    search: searchInput,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setFilters({ search: value, page: 1 });
  };

  const handleOpenCreate = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLead(null);
  };

  const handleSubmit = async (data: LeadFormData) => {
    setFormLoading(true);
    try {
      if (editingLead) {
        await updateLead(editingLead._id, data);
        toast.success('Lead updated successfully');
      } else {
        await createLead(data);
        toast.success('Lead created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String(err.response.data.message)
          : 'Failed to save lead';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      refetch();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String(err.response.data.message)
          : 'Failed to delete lead';
      toast.error(message);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const blob = await exportLeadsCSV({
        ...filters,
        search: searchInput,
      });
      downloadBlob(blob, 'leads.csv');
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setExportLoading(false);
    }
  };

  const headerAction = (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={handleExport}
        isLoading={exportLoading}
      >
        Export CSV
      </Button>
      {isAdmin && <Button onClick={handleOpenCreate}>Add Lead</Button>}
    </div>
  );

  return (
    <PageWrapper title="Leads" action={headerAction}>
      <div className="space-y-6">
        <LeadFilters
          filters={filters}
          onChange={setFilters}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters({ page })}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
        size="lg"
      >
        <LeadForm
          lead={editingLead}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={formLoading}
        />
      </Modal>
    </PageWrapper>
  );
}
