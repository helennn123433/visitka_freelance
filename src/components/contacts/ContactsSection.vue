<template>
  <div class="contacts">
    <div class="header">
      <h2 class="contacts__title">
        КОНТАКТЫ
      </h2>
      <div
        v-if="authStore.isAuthenticated"
        class="adminCard"
      >
        <img
          class="icon"
          :src="Icons.Pencil"
          alt="adminIcon"
        >
      </div>
    </div>
    <p class="contacts__description">
      Наша команда работает над проектами удаленно. Мы готовы обсуждать все вопросы онлайн, организовывать митинги, а
      также договариваться о личной встрече в Санкт-Петербурге. Для общения с заказчиками мы используем Telegram и
      другие удобные виды связи.
    </p>
    <div class="contacts__list">
      <ContactCard
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
      />
    </div>
  </div> 
</template>

<script setup lang="ts">
import ContactCard from './ContactCard.vue'
import { Icons } from "@/assets/img/Icons";
import { contacts } from '@/data/contacts'
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

.header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
}

.icon {
  width: 30px;
  height: 30px;
}

.contacts {
  margin: 0;
  background-color: $white;
}

.contacts__title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  color: $blue;
  margin-top: 0;
}

.contacts__description {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin-bottom: 2rem;
  font-weight: 500;
}

.contacts__list {
  display: grid;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
  @media (min-width: 1200px) and (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.7rem;
  }
}
</style>
