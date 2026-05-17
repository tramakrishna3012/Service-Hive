import { Link } from 'react-router-dom';
import { Lead } from '../../types/lead.types';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export default function LeadTable({
  leads,
  isLoading,
  onEdit,
  onDelete,
}: LeadTableProps) {
  const { user, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <span className="mb-4 text-5xl" aria-hidden>
          📭
        </span>
        <h3 className="text-lg font-medium text-slate-900">No leads found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your filters or add a new lead.
        </p>
      </div>
    );
  }

  const canEdit = (lead: Lead) =>
    isAdmin || lead.createdBy._id === user?._id;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                {lead.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {lead.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge status={lead.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {lead.source}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                {formatDate(lead.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex justify-end gap-2">
                  <Link to={`/leads/${lead._id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                  {canEdit(lead) && (
                    <Button variant="secondary" size="sm" onClick={() => onEdit(lead)}>
                      Edit
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(lead._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
