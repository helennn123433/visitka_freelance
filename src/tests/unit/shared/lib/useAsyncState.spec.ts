import { useAsyncState } from '@shared/lib/composables/useAsyncState';

describe('useAsyncState', () => {
  it('инициализируется с начальным значением', () => {
    const { data, isLoading, error } = useAsyncState<string>('initial');

    expect(data.value).toBe('initial');
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('устанавливает isLoading во время выполнения', async () => {
    const { isLoading, execute } = useAsyncState<number>(0);

    const promise = execute(async () => {
      expect(isLoading.value).toBe(true);
      return 42;
    });

    await promise;
    expect(isLoading.value).toBe(false);
  });

  it('возвращает результат успешного выполнения', async () => {
    const { execute } = useAsyncState<number>(0);

    const result = await execute(async () => {
      return 42;
    });

    expect(result).toBe(42);
  });

  it('устанавливает ошибку при неудачном выполнении', async () => {
    const { error, execute } = useAsyncState<number>(0);
    const errorMessage = 'Test error';

    try {
      await execute(async () => {
        throw new Error(errorMessage);
      }, 'Custom error message');
    } catch (e) {
      // Ожидаем, что ошибка будет выброшена
    }

    expect(error.value).toBe(errorMessage);
  });

  it('очищает ошибку с помощью clearError', async () => {
    const { error, clearError, execute } = useAsyncState<number>(0);

    try {
      await execute(async () => {
        throw new Error('Test error');
      });
    } catch (e) {
      // Ожидаем ошибку
    }

    expect(error.value).toBeTruthy();
    clearError();
    expect(error.value).toBeNull();
  });

  it('сбрасывает состояние с помощью reset', async () => {
    const initialValue = 'initial';
    const { data, error, isLoading, reset, execute } = useAsyncState<string>(initialValue);

    try {
      await execute(async () => {
        throw new Error('Test error');
      });
    } catch (e) {
      // Ожидаем ошибку
    }

    reset();

    expect(data.value).toBe(initialValue);
    expect(error.value).toBeNull();
    expect(isLoading.value).toBe(false);
  });
});
