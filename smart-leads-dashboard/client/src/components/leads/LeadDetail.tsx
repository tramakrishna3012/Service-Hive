import { Lead } from '../../types/lead.types';
import { formatDateTime } from '../../utils/formatDate';
import Badge from '../ui/Badge';

interface LeadDetailProps {
  lead: Lead;
}

export default function LeadDetail({ lead }: LeadDetailProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{lead.name}</h2>
          <p className="text-slate-600">{lead.email}</p>
        </div>
        <Badge status={lead.status} />
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-slate-500">Source</dt>
          <dd className="mt-1 text-slate-900">{lead.source}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Status</dt>
          <dd className="mt-1">
            <Badge status={lead.status} />
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Created By</dt>
          <dd className="mt-1 text-slate-900">
            {lead.createdBy.name} ({lead.createdBy.email})
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Created At</dt>
          <dd className="mt-1 text-slate-900">{formatDateTime(lead.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
          <dd className="mt-1 text-slate-900">{formatDateTime(lead.updatedAt)}</dd>
        </div>
        {lead.notes ? (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-900">{lead.notes}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
