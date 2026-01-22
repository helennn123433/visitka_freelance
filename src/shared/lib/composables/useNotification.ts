import { reactive, onUnmounted } from 'vue';

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

  const state = reactive<NotificationState>({
    visible: false,
    message: '',
    type: 'success',
  });

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const show = (msg: string, notificationType: 'success' | 'error' = 'success') => {
    clearTimer();
    state.message = msg;
    state.type = notificationType;
    state.visible = true;

    const duration = notificationType === 'error' ? errorDuration : successDuration;
    timeoutId = setTimeout(() => {
      state.visible = false;
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
    state.visible = false;
  };

  onUnmounted(clearTimer);

  return {
    state,
    show,
    showSuccess,
    showError,
    hide,
  };
}
