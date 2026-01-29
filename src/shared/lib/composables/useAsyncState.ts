import { ref, type Ref } from 'vue';

export interface AsyncState<T> {
  data: Ref<T>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  execute: <R>(_fn: () => Promise<R>, _errorMessage?: string) => Promise<R>;
  clearError: () => void;
  reset: () => void;
}

export function useAsyncState<T>(initialValue: T): AsyncState<T> {
  const data = ref<T>(initialValue) as Ref<T>;
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const execute = async <R>(
    fn: () => Promise<R>,
    errorMessage = 'Произошла ошибка'
  ): Promise<R> => {
    try {
      error.value = null;
      isLoading.value = true;
      return await fn();
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      error.value = message;
      console.error(errorMessage, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    data.value = initialValue;
    error.value = null;
    isLoading.value = false;
  };

  return {
    data,
    isLoading,
    error,
    execute,
    clearError,
    reset
  };
}
