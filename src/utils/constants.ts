export const ISSUE_CATEGORIES = [
  { value: 'road', label: 'Problemas na Via' },
  { value: 'lighting', label: 'Iluminação' },
  { value: 'garbage', label: 'Lixo' },
  { value: 'infrastructure', label: 'Infraestrutura' },
  { value: 'other', label: 'Outros' },
] as const;

export const STATUS_STEPS = [
  { status: 'pending', label: 'Pendente' },
  { status: 'analyzing', label: 'Em Análise' },
  { status: 'inProgress', label: 'Em Andamento' },
  { status: 'resolved', label: 'Resolvido' },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB