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
        <template v-if="!isEditing">
          <img
            class="icon"
            :src="Icons.Pencil"
            alt="adminIcon"
            @click="toggleEdit"
          >
        </template>
        <template v-else>
          <img
            class="icon"
            :src="Icons.ContentSave"
            alt="adminIcon"
            @click="saveEdit"
          >
        </template>
      </div>
    </div>
    <div class="contacts__description">
      <template v-if="isEditing">
        <textarea
          v-model="editableDescription"
          class="contacts__description__input"
          rows="4"
          @blur="updateDescription"
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
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@features/auth';
import type { Contact } from '@entities/contact';
import ContactCard from './ContactCard.vue';
import { NotificationComp } from '@shared/ui/notification';
import { Icons } from '@shared/ui/icons';
import { apiClient, adminClient } from '@shared/api';
import { API_CONFIG } from '@shared/config';

const { endpoints } = API_CONFIG;
const authStore = useAuthStore();

const isEditing = ref(false);
const flagError = ref(0);
const textError = ref('Нельзя оставлять пустые поля!');
const showError = ref(false);
const description = ref('');
const editableDescription = ref('');
const contacts = ref<Contact[]>([]);

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated && isEditing.value) {
    isEditing.value = false;
    editableDescription.value = description.value;
  }
});

const loadContacts = async () => {
  try {
    const response = await apiClient.get(endpoints.contacts);
    const data = response.data;
    description.value = data.description;
    contacts.value = data.contacts;
    editableDescription.value = data.description;
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
};

const toggleEdit = () => {
  flagError.value = 0;

  contacts.value.forEach((input) => {
    if (input.title === '' || input.subtitle === '') {
      flagError.value = 1;
    }
  });

  const descToCheck = isEditing.value ? editableDescription.value : description.value;
  if (!descToCheck.trim()) {
    flagError.value = 1;
  }

  if (flagError.value === 1) {
    showError.value = true;
    textError.value = 'Нельзя оставлять пустые поля!';
  } else {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
      editableDescription.value = description.value;
    }
  }
};

const updateContact = async (updatedContact: Contact) => {
  const index = contacts.value.findIndex(c => c.id === updatedContact.id);
  if (index !== -1) {
    contacts.value[index] = { ...updatedContact };

    try {
      await adminClient.put(`${endpoints.admin.contacts}/${updatedContact.id}`, {
        id: updatedContact.id,
        icon: updatedContact.icon,
        title: updatedContact.title,
        subtitle: updatedContact.subtitle
      });
    } catch (error) {
      console.error('Ошибка обновления контакта:', error);
      await loadContacts();
    }
  }
};

const updateDescription = async () => {
  try {
    const newDescription = editableDescription.value.trim();

    if (!newDescription) {
      showError.value = true;
      textError.value = 'Описание не может быть пустым';
      editableDescription.value = description.value;
      return;
    }

    await adminClient.put(`${endpoints.admin.contacts}/description`, newDescription, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    description.value = newDescription;
  } catch (error) {
    console.error('Ошибка обновления описания:', error);
    editableDescription.value = description.value;
  }
};

const saveEdit = async () => {
  try {
    if (editableDescription.value !== description.value) {
      await updateDescription();
    }

    isEditing.value = false;
  } catch (error) {
    console.error('Ошибка сохранения изменений:', error);
  }
};

onMounted(async () => {
  await loadContacts();
});
</script>

<style lang="scss" scoped>
$blue: #0652FF;
$white: #FFFFFF;

.header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
}

.icon {
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
  filter: invert(25%) sepia(98%) saturate(2158%) hue-rotate(220deg) brightness(103%) contrast(104%);
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

.contacts__description__input {
  width: 100%;
  font: inherit;
  padding: 8px;
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
