<template>
  <div class="contact-card">
    <img
      :src="Icons[contact.icon as keyof typeof Icons]"
      :alt="contact.title"
      class="contact-card__icon"
    >
    <h3 class="contact-card__title">
      <template v-if="isEditing">
        <input
          v-model="editableTitle"
          class="contact-card__input"
          @input="emitUpdate"
        >
      </template>
      <template v-else>
        <a href="#">
          {{ contact.title }}
        </a>
      </template>
    </h3>
    <p class="contact-card__subtitle">
      <template v-if="isEditing">
        <input
          v-model="editableSubtitle"
          class="contact-card__input"
          @input="emitUpdate"
        >
      </template>
      <template v-else>
        {{ contact.subtitle }}
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import { Contact } from '@/interfaces/contacts/Contact'
  import { Icons } from "@/assets/img/Icons"
  //тип ключей:
  //type IconKey = keyof typeof Icons

  const props = defineProps<{
    contact: Contact
    isEditing: boolean
  }>()

  /* eslint-disable */
  const emits = defineEmits<{
    (e: 'contact-update', payload: Contact): void
  }>()


  const editableTitle = ref(props.contact.title)
  const editableSubtitle = ref(props.contact.subtitle)

  watch(() => props.contact, (newContact) => {
    editableTitle.value = newContact.title
    editableSubtitle.value = newContact.subtitle
  }, { deep: true })

  function emitUpdate() {
    emits('contact-update', {
      id: props.contact.id,
      icon: props.contact.icon,
      title: editableTitle.value,
      subtitle: editableSubtitle.value
    })
  }
</script>

<style lang="scss" scoped>
@use '../../styles/colors.scss';

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.contact-card__input {
  width: 100%;
  font: inherit;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.contact-card {
  background-color: colors.$light-grey;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  &__title {
    color: colors.$black;
    margin: 0;
  }
  &__subtitle {
    color: colors.$grey;
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
