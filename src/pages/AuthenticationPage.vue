<template>
  <div class="auth-model">
    <NotificationComp
      :visible="showNotification"
      :error-message="notificationMessage"
      @close="showNotification = false"
    />
    <div class="auth-model__card">
      <div class="auth-model__card__title">
        <h3>Авторизация</h3>
      </div>
      <div class="auth-model__card__inputs">
        <input
          v-model="login"
          placeholder="логин"
          type="text"
          class="input"
        >
        <div class="password-wrapper">
          <input
            v-model="password"
            :type="passwordFieldType"
            placeholder="пароль"
            class="input password"
          >
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
import { ref } from "vue";
import router from "@/router";
import {useAuthStore} from "@/store/authStore";
import MyButton from '@/components/ui/MyButton.vue'
import NotificationComp from "@/components/notifications/NotificationComp.vue";
import { Icons } from "@/assets/img/Icons";
import apiClient from "@/network/connection";
import axios from "axios";

const passwordFieldType = ref('password')
const loading = ref(false)

const authStore = useAuthStore()
let login = ref<string>("");
let password = ref<string>("");
const showNotification = ref(false)
const notificationMessage = ref('')

const backToHome = () => {
  router.push('/')
}

const showError = (message: string) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => showNotification.value = false, 5000)
}

const checkInputAndConfirm = async () => {
  if (!login.value || !password.value) {
    return showError("Введите данные для авторизации");
  }

  loading.value = true;

  try {
    const response = await apiClient.post('http://localhost:8081/auth/sign-in', {
      username: login.value,
      password: password.value
    });

    const token = response.data.token;
    if (!token) throw new Error('Токен не получен от сервера');

    localStorage.setItem('auth_token', token);
    authStore.login({ 
      login: login.value, 
      password: password.value,
      token: token 
    });

    router.push('/');

  } catch (error: unknown) {
    console.error('Ошибка авторизации:', error);
    showError(getAuthErrorMessage(error));
  } finally {
    loading.value = false;
  }
};

const getAuthErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Неизвестная ошибка. Попробуйте позже.";
  }

  const { response, code } = error;
  const status = response?.status;

  if (status === 403) {
    return (code === 'NETWORK_ERR' || !response) 
      ? "CORS ошибка. Сервер не разрешает запросы с этого домена."
      : "Неверные логин или пароль";
  }

  if (status === 401) return "Неверные логин или пароль";
  if (status === 404) return "Сервер авторизации недоступен. Проверьте настройки API.";
  if (status === 400) return "Некорректные данные";
  
  if (code === 'NETWORK_ERROR' || !response) {
    return "Сервер недоступен. Проверьте подключение.";
  }

  return response?.data?.message || "Ошибка авторизации. Попробуйте позже.";
};

const switchVisibility = () => {
  passwordFieldType.value =
    passwordFieldType.value === 'password' ? 'text' : 'password'
}
</script>

<style lang="scss" scoped>
.auth-model{
  width: 94vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;

  &__card{
    display: flex;
    flex-direction: column;
    width: 20%;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 10px;
    margin-top: 50px;

    &__title{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    &__btns{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}
.icon{
  height: 20px;
}
.input {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.auth-model__card__inputs > input,
.password-wrapper {
  width: 70%;
  margin: 5px;
}

.password-wrapper {
  position: relative;
  width: 70%;
}

.input.password {
  width: 100%;
  padding-right: 40px; /* добавляем место под глаз */
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
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

.btn{
  height: 30%;
  width: 40%;
  padding: 5px;
}

@media screen and (max-width: 767px) {
  .auth-model{
    &__card{
      width: 40%;
    }
  }
}
@media screen and (max-width: 425px) {
  .auth-model{
    &__card{
      width: 50%;
    }
  }
}
</style>