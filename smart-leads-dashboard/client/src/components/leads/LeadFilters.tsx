import { LeadFilters as Filters, LeadSource, LeadStatus, SortOrder } from '../../types/lead.types';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface LeadFiltersProps {
  filters: Filters;
  onChange: (filters: Partial<Filters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export default function LeadFilters({
  filters,
  onChange,
  searchValue,
  onSearchChange,
}: LeadFiltersProps) {
  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        placeholder="Search by name or email..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        label="Status"
        options={statusOptions}
        value={filters.status ?? ''}
        onChange={(e) =>
          onChange({ status: e.target.value as LeadStatus | '' })
        }
      />
      <Select
        label="Source"
        options={sourceOptions}
        value={filters.source ?? ''}
        onChange={(e) =>
          onChange({ source: e.target.value as LeadSource | '' })
        }
      />
      <Select
        label="Sort"
        options={sortOptions}
        value={filters.sort ?? 'latest'}
        onChange={(e) => onChange({ sort: e.target.value as SortOrder })}
      />
    </div>
  );
}
