import { LeadStatus } from '../../types/lead.types';

interface BadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 ring-blue-200',
  Contacted: 'bg-amber-100 text-amber-800 ring-amber-200',
  Qualified: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Lost: 'bg-red-100 text-red-800 ring-red-200',
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
