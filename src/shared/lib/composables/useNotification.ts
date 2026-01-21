import { ref, onUnmounted } from 'vue';

export interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

export interface UseNotificationOptions {
  successDuration?: number;
  errorDuration?: number;
}

export function useNotification(options: UseNotificationOptions = {}) {
  const { successDuration = 2000, errorDuration = 5000 } = options;

  const visible = ref(false);
  const message = ref('');
  const type = ref<'success' | 'error'>('success');
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const show = (msg: string, notificationType: 'success' | 'error' = 'success') => {
    clearTimer();
    message.value = msg;
    type.value = notificationType;
    visible.value = true;

    const duration = notificationType === 'error' ? errorDuration : successDuration;
    timeoutId = setTimeout(() => {
      visible.value = false;
    }, duration);
  };

  const showSuccess = (msg = 'Операция выполнена успешно') => {
    show(msg, 'success');
  };

  const showError = (msg: string) => {
    show(msg, 'error');
  };

  const hide = () => {
    clearTimer();
    visible.value = false;
  };

  onUnmounted(clearTimer);

  return {
    visible,
    message,
    type,
    show,
    showSuccess,
    showError,
    hide,
  };
}
