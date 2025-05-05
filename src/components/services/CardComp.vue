<template>
  <div class="card">
    <!-- Иконка настроек -->
    <svg 
      class="settings-icon"
      @click="openEditModal"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
    >
      <path 
        d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
      />
    </svg>

    <!-- Иконка мусорки -->
    <svg
      class="delete-icon"
      @click="openDeleteModal"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M3 6l3 18h12l3-18h-18zm5 2h1v12h-1v-12zm4 0h1v12h-1v-12zm4 0h1v12h-1v-12zm3-4v2h-14v-2h4.789l.807-1.243.004-.007.009-.003h4.801l.009.003.807 1.243h4.789z"/>
    </svg>

    <!-- Картинка услуги -->
    <img
      :src="service.image"
      :alt="service.title"
      class="image"
    >

    <!-- Цена и заголовок -->
    <div class="price">от {{ service.price }} Р</div>
    <div class="title">{{ service.title }}</div>

    <!-- Модальные окна -->
    <EditCard
      v-if="isEditModalOpen"
      :current-data="service"
      @close="closeEditModal"
      @save="handleSave"
    />

    <DeleteCard
      v-if="isDeleteModalOpen"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { Service } from '@/interfaces/services/Service'
import EditCard from '@/components/services/EditCard.vue'
import DeleteCard from '@/components/services/DeleteCard.vue'

const props = defineProps<{
  service: Service
}>()

const emit = defineEmits(['updated'])

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleSave = async (updatedData: Service) => {
  try {
    const numericId = Number(updatedData.id)
    console.log('Удаляемый ID:', numericId)
    const response = await axios.put(
      `http://localhost:3004/services/${numericId}`,
      { ...updatedData, id: numericId }
    )

    if (response.status === 200) {
      emit('updated')
      closeEditModal()
    }
  } catch (error) {
    alert('Ошибка при сохранении изменений')
  }
}

const handleDeleteConfirm = async () => { 
  try {
    const numericId = Number(props.service.id)
    console.log('Удаляемый ID:', numericId)
    const response = await axios.delete(
      `http://localhost:3004/services/${numericId}`
    )

    if (response.status === 200) {
      emit('updated')
      closeDeleteModal()
    }
  } catch (error) {
    alert('Ошибка при удалении услуги: ' + error.message)
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

.image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.settings-icon,
.delete-icon {
  position: absolute;
  top: 5%;
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  z-index: 20;
  fill: $white;
  transition: transform 0.3s ease;
}

.settings-icon {
  left: 5%;
}

.delete-icon {
  left: 12%;
}

.settings-icon:hover{
  transform: rotate(90deg) scale(1.2);
}

.delete-icon:hover {
  transform: scale(1.2);
}

.card {
  flex: 0 0 48.5%;
  position: relative;
  color: $white;
  width: auto;
  overflow: hidden;
  border-radius: 2.5vw;
  cursor: pointer;
  img {
    transition: opacity 0.3s ease;
  }
  .price {
    position: absolute;
    display: flex;
    align-items: center; 
    justify-content: center; 
    top: 5%;
    right: 5%;
    background-color: $blue;
    color: $white;
    border-radius: 1.5vw;
    font-weight: bold;
    font-size: 1vw;
    padding: 1.5vw 1vw;
    z-index: 10;
    transition: background-color 0.3s ease;
  }
  .title {
    position: absolute;
    bottom: 7%;
    left: 7%;
    z-index: 10;
    color: $white;
    font-weight: bold;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 2.5vw;
  }
  .price, .title {
    transition: transform 0.3s ease, font-size 0.3s ease;
  }
}

@media(max-width: 650px) {
  .settings-icon,
  .delete-icon {
    width: 4vw;
    height: 4vw;
    top: 3%;
    left: 3%;
  }
  .card {
    border-radius: 5vw;
    flex: 0 0 100%;
    margin-bottom: 2vw;
    .title {
      font-size: 6vw;
    }
    .price {
      font-size: 3vw;
      padding: 3vw 2vw;
      border-radius: 3.4vw;
    }
  }
  .card:last-of-type {
    margin-bottom: 0;
  }
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: $blue; 
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::after {
  opacity: 0.5; 
}

.card:hover .price {
  background-color: transparent;
  transform: translateX(1vw) scale(1.2);
}

.card:hover .title {
  transform: translateX(-1vw) scale(1.2);
}
</style>