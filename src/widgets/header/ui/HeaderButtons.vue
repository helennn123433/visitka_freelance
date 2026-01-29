<template>
  <div class="header-buttons">
    <MyButton
      v-if="authStore.isAuthenticated"
      class="auth-button"
      @click="authStore.logout"
    >
      Выйти
    </MyButton>
    <img
      :src="Icons.Phone"
      alt="Иконка телефона"
      title="Позвонить"
      class="icon phone-icon"
      @click="handlePhoneClick"
    >
    <img
      :src="Icons.Telegram"
      alt="Иконка Telegram"
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

<script setup lang="ts">
import { useAuthStore } from '@features/auth';
import { Icons } from '@shared/ui/icons';
import { MyButton } from '@shared/ui/button';

const authStore = useAuthStore();

const handlePhoneClick = () => {
  window.location.href = 'tel:+79650778987';
};

const handleTelegramClick = () => {
  window.open('https://t.me/frtarget', '_blank');
};

const handleEmailClick = () => {
  window.location.href = 'mailto:alexpysenkov@gmail.com';
};
</script>

<style lang="scss" scoped>
.header-buttons {
  display: flex;
  gap: 32px;

  img {
    width: 28px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.1) invert(0.3);
    }

  }
}

.auth-button:hover {
  background-color: #082f8b;
}
@media (min-width: 1921px) {
.header-buttons {
  gap: 40px;
    img {
      width: 44px;
    }
  }
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

  .auth-button {
    width: 70px;
    height: 30px;
  }
}
</style>
