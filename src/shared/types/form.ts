export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'textarea' | 'select';
  required?: boolean;
  validation?: (value: unknown) => string | null;
  placeholder?: string;
  options?: Array<{ value: unknown; label: string }>;
}

export interface EntityConfig {
  name: string;
  fields: FormField[];
  api: {
    create: (data: Record<string, unknown>) => Promise<unknown>;
    update: (id: string, data: Record<string, unknown>) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
  };
  getDisplayName?: (entity: Record<string, unknown>) => string;
  getImageUrl?: (entity: Record<string, unknown>) => string;
}
