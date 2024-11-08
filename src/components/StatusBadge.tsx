import React from 'react';
import type { Issue } from '../types';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
  analyzing: { color: 'bg-primary-100 text-primary-800', label: 'Em Análise' },
  inProgress: { color: 'bg-secondary-100 text-secondary-800', label: 'Em Andamento' },
  resolved: { color: 'bg-accent-100 text-accent-800', label: 'Resolvido' },
} as const;

interface StatusBadgeProps {
  status: Issue['status'];
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}