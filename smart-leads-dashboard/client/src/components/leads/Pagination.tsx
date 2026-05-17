import { PaginationMeta } from '../../types/lead.types';
import Button from '../ui/Button';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
      <p className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
