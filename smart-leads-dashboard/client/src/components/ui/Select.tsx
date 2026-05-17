import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-slate-300 focus:border-indigo-500'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
