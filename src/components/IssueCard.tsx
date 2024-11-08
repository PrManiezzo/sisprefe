import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { Issue } from '../types';
import StatusBadge from './StatusBadge';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{issue.title}</h3>
        <StatusBadge status={issue.status} />
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>
      
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">
            {issue.location.address || 
              `${issue.location.latitude.toFixed(6)}, ${issue.location.longitude.toFixed(6)}`}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {issue.images.length > 0 && (
        <div className="mt-4 flex -space-x-2 overflow-hidden">
          {issue.images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Imagem ${index + 1} do problema`}
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          ))}
          {issue.images.length > 3 && (
            <div className="flex items-center justify-center h-12 w-12 rounded-full border-2 border-white bg-gray-100 text-sm text-gray-500">
              +{issue.images.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}