import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
      <span className="text-red-700">{message}</span>
    </div>
  );
}