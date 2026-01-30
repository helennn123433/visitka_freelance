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
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@features/auth';
import { Icons } from '@shared/ui/icons';
import { MyButton } from '@shared/ui/button';
import { API_CONFIG } from '@shared/config';
import { apiClient } from '@shared/api';

const { endpoints } = API_CONFIG;

const authStore = useAuthStore();
const contacts = ref([]);


const phone = computed(() => getContactByIcon('PhoneBlue')?.title);
const telegram = computed(() => getContactByIcon('TelegramBlue')?.title);
const email = computed(() => getContactByIcon('EmailBlue')?.title);


const loadContacts = async () => {
  try {
    const response = await apiClient.get(endpoints.contacts);
    contacts.value = response.data.contacts;
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
};

const getContactByIcon = (icon: string) =>
  contacts.value.find(c => c.icon === icon);


const handlePhoneClick = () => {
  if (!phone.value) return;
  window.location.href = `tel:${phone.value.replace(/\D/g, '')}`;
};

const handleTelegramClick = () => {
  if (!telegram.value) return;
  window.open(`https://t.me/${telegram.value.replace('@', '')}`, '_blank');
};

const handleEmailClick = () => {
  if (!email.value) return;
  window.location.href = `mailto:${email.value}`;
};

onMounted(() => {
  loadContacts();
})
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
