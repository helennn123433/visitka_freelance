<template>
  <div class="contact-card">
    <img
      :src="Icons[contact.icon as keyof typeof Icons]"
      :alt="contact.title"
      class="contact-card__icon"
    >
    <h3 
      class="contact-card__title" 
      @click="handleTitleClick"
    >
      <template v-if="isEditing">
        <textarea
          v-model="editableTitle"
          class="contact-card__input"
          rows="3"
          @blur="updateContact"
        />
      </template>
      <template v-else>
        <span class="title">{{ contact.title }}</span>
      </template>
    </h3>
    <p class="contact-card__subtitle">
      <template v-if="isEditing">
        <textarea
          v-model="editableSubtitle"
          class="contact-card__input"
          rows="3"
          @blur="updateContact"
        />
      </template>
      <template v-else>
        {{ contact.subtitle }}
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { Contact } from '@/interfaces/contacts/Contact'
  import { Icons } from "@/assets/img/Icons"

  const props = defineProps<{
    contact: Contact
    isEditing: boolean
  }>()

  /* eslint-disable */
  const emit = defineEmits<{
    (e: 'contact-update', payload: Contact): void
  }>()


  const editableTitle = ref(props.contact.title)
  const editableSubtitle = ref(props.contact.subtitle)

  const contactType = computed(() => {
    const icon = props.contact.icon.toLowerCase()
    if (icon.includes('phone')) return 'phone'
    if (icon.includes('mail')) return 'email'
    if (icon.includes('telegram')) return 'telegram'
    if (icon.includes('whatsapp')) return 'whatsapp'
    return null
  })

  const handleTitleClick = () => {
    if (props.isEditing) return
    
    const value = props.contact.title.trim()
    
    switch (contactType.value) {
      case 'phone':
        window.location.href = `tel:${value}`
        break
      case 'email':
        window.location.href = `mailto:${value}`
        break
      case 'telegram':
        const username = value.startsWith('@') ? value.slice(1) : value
        window.open(`https://t.me/${username}`, '_blank')
        break
      case 'whatsapp': 
        const phoneNumber = value.replace(/\D/g, '')
        window.open(`https://wa.me/${phoneNumber}`, '_blank')
        break
      default:
        console.warn('Unknown contact type:', props.contact.icon)
    }
  }

  watch(() => props.contact, (newContact) => {
    editableTitle.value = newContact.title
    editableSubtitle.value = newContact.subtitle
  }, { deep: true })

  const updateContact = async () => {
    try {
      const updatedContact = {
        ...props.contact,
        title: editableTitle.value.trim(),
        subtitle: editableSubtitle.value.trim()
      }
      
      if (!updatedContact.title || !updatedContact.subtitle) {
        editableTitle.value = props.contact.title || ''
        editableSubtitle.value = props.contact.subtitle || ''
        return
      }
      
      emit('contact-update', updatedContact)
      
    } catch (error) {
      console.error('❌ Ошибка обновления контакта:', error)
      editableTitle.value = props.contact.title || ''
      editableSubtitle.value = props.contact.subtitle || ''
    }
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
  border-radius: 8px;
  border: none;       
  outline: none;     
  box-sizing: border-box;
}

.title{
  cursor: pointer;
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
