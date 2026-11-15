import type { ReactNode } from 'react';

type StatusTagProps = {
  status: 'available' | 'partial' | 'unavailable';
  children: ReactNode;
};

const statusStyles = {
  available: 'border-forest bg-forest-soft text-forest',
  partial: 'border-line-strong bg-surface text-ink-2',
  unavailable: 'border-line-strong bg-surface text-warning',
};

export default function StatusTag({ status, children }: StatusTagProps) {
  return (
    <span
      className={`inline-flex max-w-full items-start rounded border px-2.5 py-1 text-left text-sm font-semibold ${statusStyles[status]}`}
    >
      {children}
    </span>
  );
}
