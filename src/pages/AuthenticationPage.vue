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
          @click="checkInputAndConfirm"
        >
          Вход
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

const passwordFieldType = ref('password')

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

const checkInputAndConfirm = () => {
  if (login.value === "admin" && password.value === "admin") {
    authStore.login({ login: login.value, password: password.value });
    router.push('/')
  } else if (login.value === "" || password.value === "") {
    showError("Введите данные для авторизации")
  } else {
    showError("Неверные логин или пароль")
  }
}

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