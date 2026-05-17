import { FormEvent, useState, useEffect } from 'react';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types/lead.types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const emptyForm: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  notes: '',
};

export default function LeadForm({
  lead,
  onSubmit,
  onCancel,
  isLoading = false,
}: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        required
      />
      <Select
        label="Status"
        options={statusOptions}
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value as LeadStatus })
        }
      />
      <Select
        label="Source"
        options={sourceOptions}
        value={form.source}
        onChange={(e) =>
          setForm({ ...form, source: e.target.value as LeadSource })
        }
        error={errors.source}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
