<template>
  <div class="contacts">
    <div class="header">
      <h2 class="contacts__title">
        КОНТАКТЫ
      </h2>
      <div
        v-if="authStore.isAuthenticated && !isEditing"
        class="adminCard"
        @click="toggleEdit"
      >
        <img
          class="icon"
          :src="Icons.Pencil"
          alt="adminIcon"
        >
      </div>
      <div
        v-if="isEditing"  
      >
        <img
          class="icon"
          :src="Icons.ContentSave"
          alt="adminIcon"
          @click="saveEdit"
        >
      </div>
    </div>
    <div class="contacts__description">
      <template v-if="isEditing">
        <textarea 
          v-model="description"
          class="contacts__description__input"
          rows="4"
        />
      </template>
      <template v-else>
        <p>{{ description }}</p>
      </template>
    </div>
    <div class="contacts__list">
      <ContactCard
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        :is-editing="isEditing"
        @contact-update="updateContact"
      />
    </div>

    <NotificationComp 
      :visible="showError" 
      :error-message="textError" 
      @close="showError = false" 
    />
  </div> 
</template>

<script setup lang="ts">
  import { ref, onMounted, watch} from 'vue'
  import { useAuthStore } from "@/store/authStore"
  import { Contact } from '@/interfaces/contacts/Contact'
  import ContactCard from './ContactCard.vue'
  import NotificationComp from '../notifications/NotificationComp.vue';
  import { Icons } from "@/assets/img/Icons"

  const authStore = useAuthStore()

  const isEditing = ref(false)
  const flagError = ref(0)
  const textError = ref('Нельзя оставлять пустые поля!')
  const showError = ref(false)
  const description = ref('')
  const contacts = ref<Contact[]>([])

  watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (!isAuthenticated) {
      saveEdit();
    }
  });

  onMounted(async () => {
    const res = await fetch('/api/contacts')
    const data = await res.json()
    description.value = data.description
    contacts.value = data.contacts
  })

  const toggleEdit = () => {
    flagError.value = 0;

    contacts.value.forEach((input) => {
      if (input.title === '' || input.subtitle === '') {
        flagError.value = 1;
        return;
      }
    });

    if (description.value === '') {
      flagError.value = 1;
    }

    if (flagError.value === 1) {
      showError.value = true;
    } else {
      isEditing.value = !isEditing.value;
    }
  };


  function updateContact(updatedContact: Contact){
    const index = contacts.value.findIndex(c => c.id === updatedContact.id)
    if (index !== -1){
      contacts.value[index] = {
        ...contacts.value[index],
        ...updatedContact
      }
    }
  }


  async function saveEdit() {
    await fetch('/api/contacts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: description.value,
        contacts: contacts.value,
      }),
    })
    isEditing.value = false;
  }

</script>

<style lang="scss" scoped>
@use '../../styles/colors.scss';

.header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
}

.icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
  filter: invert(25%) sepia(98%) saturate(2158%) hue-rotate(220deg) brightness(103%) contrast(104%);
}

.contacts {
  margin: 0;
  background-color: colors.$white;
}

.contacts__title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  color: colors.$blue;
  margin-top: 0;
}

.contacts__description {
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin-bottom: 2rem;
  font-weight: 500;
}

.contacts__description__input {
  width: 100%;
  font: inherit;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  border: none;   
  outline: none;  
  box-sizing: border-box;  
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
