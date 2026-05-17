import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import LeadCard from '../components/leads/LeadCard';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { fetchDashboardStats } from '../api/leadsApi';
import { Lead } from '../types/lead.types';

interface Stats {
  total: number;
  new: number;
  qualified: number;
  lost: number;
  recent: Lead[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch {
        setError('Failed to load dashboard stats');
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const greeting =
    user?.role === 'admin'
      ? `Welcome back, ${user.name}! You have full admin access.`
      : `Welcome back, ${user?.name}! Manage your sales pipeline.`;

  const statCards = stats
    ? [
        { label: 'Total Leads', value: stats.total, color: 'bg-indigo-500' },
        { label: 'New', value: stats.new, color: 'bg-blue-500' },
        { label: 'Qualified', value: stats.qualified, color: 'bg-emerald-500' },
        { label: 'Lost', value: stats.lost, color: 'bg-red-500' },
      ]
    : [];

  return (
    <PageWrapper title="Dashboard">
      <p className="mb-6 text-slate-600">{greeting}</p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className={`h-1 ${card.color}`} />
                <div className="p-5">
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
              <Link
                to="/leads"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all →
              </Link>
            </div>
            {stats && stats.recent.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.recent.map((lead) => (
                  <LeadCard key={lead._id} lead={lead} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                No leads yet.{' '}
                <Link to="/leads" className="text-indigo-600 hover:underline">
                  Add your first lead
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
