import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIssues } from '../api/issues';
import { BarChart3, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Issue, IssueCategory } from '../types';

const categoryLabels: Record<IssueCategory, string> = {
  road: 'Problemas na Via',
  lighting: 'Iluminação',
  garbage: 'Lixo',
  infrastructure: 'Infraestrutura',
  other: 'Outros',
};

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: getIssues,
  });

  const filteredIssues = selectedCategory === 'all'
    ? issues
    : issues.filter(issue => issue.category === selectedCategory);

  const stats = {
    total: issues.length,
    pending: issues.filter(issue => issue.status === 'pending').length,
    inProgress: issues.filter(issue => issue.status === 'inProgress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
  };

  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Relatos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Relatos por Categoria</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as IssueCategory | 'all')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas as Categorias</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total de Relatos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Porcentagem
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoryLabels[category as IssueCategory]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((count / stats.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}