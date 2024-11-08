import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIssue, updateIssueStatus } from '../api/issues';
import { AlertTriangle, Clock, MapPin, CheckCircle } from 'lucide-react';
import type { Issue } from '../types';

const statusSteps = [
  { status: 'pending', label: 'Pendente', icon: AlertTriangle },
  { status: 'analyzing', label: 'Em Análise', icon: Clock },
  { status: 'inProgress', label: 'Em Andamento', icon: Clock },
  { status: 'resolved', label: 'Resolvido', icon: CheckCircle },
] as const;

export default function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: issue, isLoading, error } = useQuery({
    queryKey: ['issue', id],
    queryFn: () => getIssue(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Issue['status'] }) =>
      updateIssueStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
    },
  });

  if (isLoading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erro ao carregar o relato.</div>;
  if (!issue) return <div className="text-center py-8">Relato não encontrado.</div>;

  const handleStatusUpdate = (newStatus: Issue['status']) => {
    mutation.mutate({ id: issue.id, status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                {
                  pending: 'bg-yellow-100 text-yellow-800',
                  analyzing: 'bg-blue-100 text-blue-800',
                  inProgress: 'bg-purple-100 text-purple-800',
                  resolved: 'bg-green-100 text-green-800',
                }[issue.status]
              }`}>
                {
                  {
                    pending: 'Pendente',
                    analyzing: 'Em Análise',
                    inProgress: 'Em Andamento',
                    resolved: 'Resolvido',
                  }[issue.status]
                }
              </span>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{issue.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Localização</h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>
                    Latitude: {issue.location.latitude.toFixed(6)}<br />
                    Longitude: {issue.location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações</h3>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>
                    Criado em: {new Date(issue.createdAt).toLocaleDateString()}<br />
                    Atualizado em: {new Date(issue.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {issue.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Imagens</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {issue.images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image}
                        alt={`Imagem ${index + 1} do problema`}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Atualizar Status</h3>
              <div className="flex flex-wrap gap-3">
                {statusSteps.map(({ status, label }) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={issue.status === status || mutation.isPending}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        issue.status === status
                          ? 'bg-blue-600 text-white cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}