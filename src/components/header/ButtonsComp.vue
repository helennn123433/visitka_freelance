<template>
  <div class="header-buttons">
    <my-button
      v-if="authStore.isAuthenticated"
      class="auth-button"
      @click="authStore.logout"
    >
      Выйти
    </my-button>
    <img
      v-else
      :src="Icons.Account"
      alt="Иконка телефона"
      class="icon account-icon"
      @click="authStore.changeAdminModel"
    >
    <img
      :src="Icons.Phone"
      alt="Иконка телефона"
      title="Позвонить"
      class="icon phone-icon"
      @click="handlePhoneClick" 
    >
    <img
      :src="Icons.Telegram"
      alt="Иконка телеграма"
      class="icon"
      title="Написать в Telegram"
      @click="handleTelegramClick"
    >
    <img
      :src="Icons.Email"
      alt="Иконка почты"
      class="icon"
      title="Написать email"
      @click="handleEmailClick"
    >
  </div>
</template>

<script setup lang="ts" >
  import { Icons } from "@/assets/img/Icons";
  import {useAuthStore} from "@/store/authStore";
  import MyButton from "@/components/ui/MyButton.vue";
  const authStore = useAuthStore()

  const handlePhoneClick = () => {
    window.location.href = 'tel:+79650778987'; // Формат номера для звонка
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/frtarget', '_blank'); // Открытие Telegram в новой вкладке
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:alexpysenkov@gmail.com'; // Формат для почтового клиента
  };
</script>

<style lang="scss" scoped>
.header-buttons {
  display: flex;
  gap: 2vw;

  img {
    width: 2vw;
    cursor: pointer;

    &:hover {
      filter: brightness(0.1) invert(0.3);
    }
    &.phone-icon {
      width: 1.7vw;
    }
    &.account-icon {
      width: 2.5vw;
    }
  }
}
.auth-button{
  width: 90px;
  height: 50px;
}

@media (max-width: 768px) {
  .header-buttons {
      gap: 10vw;
      img {
          width: 25px;
          &.phone-icon {
            width: 20px;
          }
          &.account-icon {
            width: 30px;
          }
      }
  }
}
</style>