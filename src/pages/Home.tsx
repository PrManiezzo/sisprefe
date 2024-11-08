import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Clock, CheckCircle, ArrowRight, Camera, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin, isEmployee } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      navigate('/admin');
    } else if (isEmployee) {
      navigate('/dashboard');
    } else {
      navigate('/reports/new');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Transforme Nossa Cidade
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Participe ativamente reportando problemas urbanos. 
              Juntos podemos criar uma cidade melhor para todos.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold bg-white text-primary-600 hover:bg-primary-50 transition-all duration-200 transform hover:scale-105"
            >
              {isAuthenticated ? 'Criar Novo Relato' : 'Começar Agora'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Processo simples e eficiente para resolver problemas urbanos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Camera}
              title="1. Registre"
              description="Fotografe e descreva o problema encontrado na cidade"
              color="primary"
            />
            <FeatureCard
              icon={MapPin}
              title="2. Localize"
              description="Use o GPS para marcar a localização exata do problema"
              color="accent"
            />
            <FeatureCard
              icon={Users}
              title="3. Acompanhe"
              description="Receba atualizações sobre o status do seu relato"
              color="secondary"
            />
            <FeatureCard
              icon={CheckCircle}
              title="4. Resolução"
              description="Acompanhe a resolução do problema pela prefeitura"
              color="primary"
            />
          </div>
        </div>
      </div>

      {/* Role Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Para Cada Perfil</h2>
            <p className="text-xl text-gray-600">Funcionalidades específicas para cada tipo de usuário</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard
              title="Cidadão"
              features={[
                "Criar novos relatos",
                "Acompanhar seus relatos",
                "Receber atualizações",
                "Adicionar fotos e localização"
              ]}
              color="primary"
            />
            <RoleCard
              title="Funcionário"
              features={[
                "Visualizar todos os relatos",
                "Atualizar status",
                "Encaminhar problemas",
                "Gerenciar ocorrências"
              ]}
              color="accent"
            />
            <RoleCard
              title="Administrador"
              features={[
                "Gestão completa do sistema",
                "Gerenciar usuários",
                "Relatórios e estatísticas",
                "Configurações avançadas"
              ]}
              color="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
  };

  return (
    <div className="relative group">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${color}-600 to-${color}-700 transform group-hover:translate-y-1 transition-transform duration-200`}></div>
      <div className="relative p-6 bg-white rounded-2xl shadow-xl transform group-hover:-translate-y-1 transition-all duration-200">
        <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} text-white mb-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  features: string[];
  color: 'primary' | 'secondary' | 'accent';
}

function RoleCard({ title, features, color }: RoleCardProps) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
  };

  return (
    <div className="relative group">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[color]} transform group-hover:translate-y-1 transition-transform duration-200`}></div>
      <div className="relative p-8 bg-white rounded-2xl shadow-xl transform group-hover:-translate-y-1 transition-all duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <CheckCircle className="h-5 w-5 text-accent-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}