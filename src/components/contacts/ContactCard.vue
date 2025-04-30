<template>
  <div class="contact-card">
    <img
      :src="contact.icon"
      :alt="contact.title"
      class="contact-card__icon"
    >
    <h3 class="contact-card__title">
      <a href="#">
        {{ contact.title }}
      </a>
    </h3>
    <p class="contact-card__subtitle">
      {{ contact.subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Contact } from '@/interfaces/contacts/Contact'

defineProps<{
  contact: Contact
}>()
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.contact-card {
  background-color: $light-grey;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  &__title {
    color: $black;
    margin: 0;
  }
  &__subtitle {
    color: $grey;
    margin-bottom: 0;
  }
	
  @media (min-width: 1600px) {
    padding: 1rem;
    &__icon {
      width: 60px;
      height: 60px;
      margin-bottom: 1rem;
    }
    &__title {
      font-size: 1.5rem;
    }
    &__subtitle {
      font-size: 1rem;
      margin-top: 0.8rem;
    }
  }
  @media (min-width: 768px) and (max-width: 1600px) {
    padding: 0.5rem;
    &__icon {
      width: 40px;
      height: 40px;
      margin-bottom: 0.5rem;
    }
    &__title {
      font-size: 1rem;
    }
    &__subtitle {
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }
  }
  @media (max-width: 768px) {
    padding: 0.3rem;
    &__icon {
      width: 32px;
      height: 32px;
      margin-bottom: 0.3rem;
    }
    &__title {
      font-size: 1rem;
    }
    &__subtitle {
      font-size: 0.7rem;
      margin-top: 0.1rem;
    }
  }
}
</style>
