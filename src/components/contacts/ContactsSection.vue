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
      <button class="ok" @click="saveEdit">
        OK
      </button>
        
        <!--<img
          class="icon"
          :src="Icons.Pencil"
          alt="adminIcon"
        >-->
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
        @contactUpdate="updateContact"
      />
    </div>
  </div> 
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import ContactCard from './ContactCard.vue'
  import { Contact } from '@/interfaces/contacts/Contact'
  import { Icons } from "@/assets/img/Icons"
  import { useAuthStore } from "@/store/authStore"

  const authStore = useAuthStore()

  const isEditing = ref(false)
  const description = ref('')
  const contacts = ref<Contact[]>([])

  onMounted(async () => {
    const res = await fetch('http://localhost:3000/api/data')
    const data = await res.json()
    description.value = data.description
    contacts.value = data.contacts
    console.log(description.value)
    console.log(contacts.value)
  })

  function toggleEdit() {
    isEditing.value = !isEditing.value
  }

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
    await fetch('http://localhost:3000/api/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: description.value,
        contacts: contacts.value,
      }),
    })

    toggleEdit()
  }

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
  cursor: pointer;
}

.ok{
  background: none;
  border: none;
  color: black;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin: 10px;
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
  border: 1px solid #ccc;
  border-radius: 4px;
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
