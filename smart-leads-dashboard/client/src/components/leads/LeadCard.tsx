import { Link } from 'react-router-dom';
import { Lead } from '../../types/lead.types';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  return (
    <Link
      to={`/leads/${lead._id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-slate-900">{lead.name}</h3>
          <p className="text-sm text-slate-500">{lead.email}</p>
        </div>
        <Badge status={lead.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{lead.source}</span>
        <span>{formatDate(lead.createdAt)}</span>
      </div>
    </Link>
  );
}
