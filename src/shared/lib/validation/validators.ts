export type ValidationRule<T> = (_value: T) => string | null;

export const required = (message = 'Поле обязательно для заполнения'): ValidationRule<string> => {
  return (value: string) => {
    if (!value || !value.trim()) {
      return message;
    }
    return null;
  };
};

export const minLength = (min: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    if (value && value.length < min) {
      return message || `Минимальная длина: ${min} символов`;
    }
    return null;
  };
};

export const maxLength = (max: number, message?: string): ValidationRule<string> => {
  return (value: string) => {
    if (value && value.length > max) {
      return message || `Максимальная длина: ${max} символов`;
    }
    return null;
  };
};

export const positiveNumber = (message = 'Значение должно быть положительным числом'): ValidationRule<number> => {
  return (value: number) => {
    if (value === undefined || value === null || isNaN(value) || value <= 0) {
      return message;
    }
    return null;
  };
};

export const isUrl = (message = 'Некорректный URL'): ValidationRule<string> => {
  return (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };
};

export const isEmail = (message = 'Некорректный email'): ValidationRule<string> => {
  return (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  };
};

export function validate<T>(value: T, rules: ValidationRule<T>[]): string | null {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
}

export interface FormErrors {
  [key: string]: string;
}

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: { [K in keyof T]?: ValidationRule<T[K]>[] }
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};
  let isValid = true;

  for (const key in schema) {
    const rules = schema[key];
    if (rules) {
      const error = validate(data[key], rules);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}
