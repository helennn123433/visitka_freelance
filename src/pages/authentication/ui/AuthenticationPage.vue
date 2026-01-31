<template>
  <div class="auth-model">
    <NotificationComp
      :visible="showNotification"
      :message="notificationMessage"
      type="error"
      @close="showNotification = false"
    />
    <div class="auth-model__card">
      <div class="auth-model__card__title">
        <h3>Авторизация</h3>
      </div>
      <div class="auth-model__card__inputs">
        <FormInput
          v-model="login"
          placeholder="логин"
          type="text"
        />
        <div class="password-wrapper">
          <FormInput
            v-model="password"
            :type="passwordFieldType"
            placeholder="пароль"
          />
          <span
            class="switch-visibility"
            @click="switchVisibility"
          >
            <span v-if="passwordFieldType === 'password'">
              <img
                class="icon"
                :src="Icons.Eye"
                alt="eyeIcon"
              >
            </span>
            <span v-else>
              <img
                class="icon"
                :src="Icons.EyeBlock"
                alt="closedEyeIcon"
              >
            </span>
          </span>
        </div>
      </div>
      <div class="auth-model__card__btns">
        <MyButton
          class="btn"
          @click="backToHome"
        >
          Назад
        </MyButton>
        <MyButton
          class="btn"
          :type="'submit'"
          :disabled="loading"
          @click="checkInputAndConfirm"
        >
          {{ loading ? 'Загрузка...' : 'Вход' }}
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@features/auth';
import { MyButton } from '@shared/ui/button';
import { FormInput } from '@/shared/ui/dialog';
import { NotificationComp } from '@shared/ui/notification';
import { Icons } from '@shared/ui/icons';
import { apiClient } from '@shared/api';
import type { AxiosError } from 'axios';
import axios from 'axios';

const router = useRouter();
const passwordFieldType = ref('password');
const loading = ref(false);

const authStore = useAuthStore();
const login = ref<string>('');
const password = ref<string>('');
const showNotification = ref(false);
const notificationMessage = ref('');

const backToHome = () => {
  router.push('/');
};

const showError = (message: string) => {
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => showNotification.value = false, 5000);
};

const checkInputAndConfirm = async () => {
  if (login.value === '' || password.value === '') {
    showError('Введите данные для авторизации');
    return;
  }

  loading.value = true;

  try {
    const response = await apiClient.post('/auth/login', {
      login: login.value,
      password: password.value
    }, {
      withCredentials: false
    });

    const token = response.data.accessToken;

    if (!token) {
      throw new Error('Токен не получен от сервера');
    }

    localStorage.setItem('auth_token', token);

    authStore.login({
      login: login.value,
      password: password.value,
      token: token
    });

    await router.push('/');

  } catch (error: unknown) {
    console.error('Ошибка авторизации:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;

      if (axiosError.response?.status === 403) {
        if (axiosError.code === 'NETWORK_ERR' || !axiosError.response) {
          showError('CORS ошибка. Сервер не разрешает запросы с этого домена.');
        } else {
          showError('Неверные логин или пароль');
        }
      }
      if (axiosError.response?.status === 401) {
        showError('Неверные логин или пароль');
      } else if (axiosError.response?.status === 404) {
        showError('Сервер авторизации недоступен. Проверьте настройки API.');
      } else if (axiosError.response?.status === 400) {
        showError('Некорректные данные');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        showError('Сервер недоступен. Проверьте подключение.');
      } else {
        const serverMessage = axiosError.response?.data?.message;
        showError(serverMessage || 'Ошибка авторизации. Попробуйте позже.');
      }
    } else if (error instanceof Error) {
      showError(error.message || 'Неизвестная ошибка');
    } else {
      showError('Неизвестная ошибка. Попробуйте позже.');
    }
  } finally {
    loading.value = false;
  }
};

const switchVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'password' ? 'text' : 'password';
};
</script>

<style lang="scss" scoped>
.auth-model {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .auth-model__card__inputs > :deep(.form-input), 
  .password-wrapper {
    width: 100%; 
  }
  &__card {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    min-width: 200px;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 24px;

    &__title {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 15px;
    }

    &__btns {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}

.icon {
  height: 20px;
}

.password-wrapper {
  position: relative;
}

.switch-visibility {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #888;
  user-select: none;
}

.btn {
  height: 30%;
  width: 40%;
  padding: 5px;
}
@media screen and (max-width: 480px) {
  .auth-model {
    padding: 10px;
    
    &__card {
      width: 70%;
      padding: 10px;
    }
  }
}
</style>
