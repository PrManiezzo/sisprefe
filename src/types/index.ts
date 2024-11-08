export type IssueCategory = 'road' | 'lighting' | 'garbage' | 'infrastructure' | 'other';
export type UserRole = 'admin' | 'employee' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  role?: UserRole;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'pending' | 'analyzing' | 'inProgress' | 'resolved';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  category: IssueCategory;
  images: string[];
}