import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIssue } from '../api/issues';
import { useGeolocation } from '../hooks/useGeolocation';
import { ISSUE_CATEGORIES } from '../utils/constants';
import { convertToBase64, validateImageFile } from '../utils/imageHelpers';
import type { IssueFormData } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { Camera, MapPin } from 'lucide-react';

export default function CreateReport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { location, error: locationError, getLocation, isLoading: isLoadingLocation } = useGeolocation();
  const [formData, setFormData] = React.useState<IssueFormData>({
    title: '',
    description: '',
    category: 'other',
    images: [],
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const mutation = useMutation({
    mutationFn: (data: IssueFormData & { location: { latitude: number; longitude: number } }) => createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      navigate('/reports');
    },
    onError: (error: Error) => {
      setError(error.message || 'Erro ao criar relato. Tente novamente.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location) {
      setError('Por favor, forneça a localização do problema.');
      return;
    }

    mutation.mutate({
      ...formData,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.some(file => !validateImageFile(file))) {
      setError('Por favor, envie apenas imagens (JPG, PNG ou GIF).');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedImages = await Promise.all(files.map(convertToBase64));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      setError('Erro ao processar as imagens. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (mutation.isPending || isUploading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Relato</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {(error || locationError) && <ErrorMessage message={error || locationError || ''} />}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título do Problema
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {ISSUE_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <button
            type="button"
            onClick={getLocation}
            disabled={isLoadingLocation}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
            {location ? 'Localização Obtida' : 'Obter Localização'}
          </button>
          {location && (
            <p className="mt-2 text-sm text-gray-500">
              Latitude: {location.latitude.toFixed(6)}, Longitude: {location.longitude.toFixed(6)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos do Problema
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Adicionar fotos</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Foto ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="sr-only">Remover</span>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || !location}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {mutation.isPending ? 'Enviando...' : 'Criar Relato'}
          </button>
        </div>
      </form>
    </div>
  );
}