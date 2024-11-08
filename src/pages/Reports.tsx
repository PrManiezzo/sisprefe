import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIssues } from '../api/issues';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PlusCircle } from 'lucide-react';

export default function Reports() {
  const { data: issues, isLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: getIssues,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Erro ao carregar os relatos." />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Relatos</h1>
        <Link
          to="/reports/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Novo Relato
        </Link>
      </div>

      {!issues?.length ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Você ainda não possui nenhum relato.</p>
          <Link
            to="/reports/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Criar Primeiro Relato
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <Link key={issue.id} to={`/reports/${issue.id}`}>
              <IssueCard issue={issue} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}