export interface DialogProps {
  modelValue: boolean;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlay?: boolean;
  centered?: boolean;
}

export interface ConfirmDialogProps {
  modelValue: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export interface FormDialogProps {
  modelValue: boolean;
  title: string;
  size?: 'small' | 'medium' | 'large';
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  loading?: boolean;
  closeOnOverlay?: boolean;
}

export interface FormInputProps {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
}
