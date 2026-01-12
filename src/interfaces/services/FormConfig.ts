// interfaces/FormConfig.ts
export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'textarea' | 'select';
  required?: boolean;
  validation?: (value: any) => string | null;
  placeholder?: string;
  options?: Array<{ value: any; label: string }>; // Для select
}

export interface EntityConfig {
  name: string;
  fields: FormField[];
  api: {
    create: (data: Record<string, any>) => Promise<any>;
    update: (id: string, data: Record<string, any>) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  getDisplayName?: (entity: Record<string, any>) => string; // Функция для получения отображаемого имени
  getImageUrl?: (entity: Record<string, any>) => string; // Функция для получения URL изображения
}