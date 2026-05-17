import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import LeadDetail from '../components/leads/LeadDetail';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { fetchLeadById, updateLead } from '../api/leadsApi';
import { Lead, LeadFormData } from '../types/lead.types';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchLeadById(id);
        setLead(data);
      } catch {
        setError('Lead not found');
        toast.error('Failed to load lead');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const canEdit =
    lead && (isAdmin || lead.createdBy._id === user?._id);

  const handleUpdate = async (data: LeadFormData) => {
    if (!id) return;
    setFormLoading(true);
    try {
      const updated = await updateLead(id, data);
      setLead(updated);
      setEditOpen(false);
      toast.success('Lead updated successfully');
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
          : 'Failed to update lead';
      toast.error(message);
    } finally {
      setFormLoading(false);
    }
  };

  const headerAction = (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={() => navigate('/leads')}>
        ← Back to Leads
      </Button>
      {canEdit && (
        <Button onClick={() => setEditOpen(true)}>Edit Lead</Button>
      )}
    </div>
  );

  return (
    <PageWrapper title="Lead Details" action={headerAction}>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error || !lead ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error ?? 'Lead not found'}
        </div>
      ) : (
        <LeadDetail lead={lead} />
      )}

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Lead"
        size="lg"
      >
        {lead && (
          <LeadForm
            lead={lead}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            isLoading={formLoading}
          />
        )}
      </Modal>
    </PageWrapper>
  );
}
