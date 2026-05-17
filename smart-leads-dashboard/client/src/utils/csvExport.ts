import { Lead } from '../types/lead.types';

export const exportToCSV = (leads: Lead[], filename = 'leads.csv'): void => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.status,
    l.source,
    new Date(l.createdAt).toLocaleDateString(),
  ]);
  const csvContent = [headers, ...rows]
    .map((r) =>
      r
        .map((cell) =>
          String(cell).includes(',') ? `"${String(cell).replace(/"/g, '""')}"` : cell
        )
        .join(',')
    )
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
