<template>
  <div
    :id="image.id.toString()"
    class="card"
  >
    <div
      v-if="authStore.isAuthenticated"
      class="adminCard"
    >
      <img 
        class="settings-icon"
        :src="Icons.Gear"
        alt="шестерёнка"
        @click.stop="openEditModal"
      >
      <img 
        class="delete-icon"
        :src="Icons.Trash"
        alt="мусорка"
        @click.stop="openDeleteModal"
      >
    </div>
    <img
      :src="image.image"
      class="image"
    >
    <div
      v-if="hasPrice"
      class="price"
    >
      {{ `от ${'price' in image ? image.price : ''} Р/час` }}
    </div>
    <div class="title">
      {{ image.title }}
    </div>

    <EditCard
      v-if="isEditModalOpen && hasPrice"
      :current-data="image"
      @close="closeEditModal"
      @save="handleSave"
    />
    <DeleteCard
      v-if="isDeleteModalOpen"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <NotificationComp 
      v-if="showNotification"
      :visible="showNotification"
      :error-message="notificationMessage"
      @close="closeNotification"
    />
  </div>
</template>

<script setup lang="ts">
import axios, { isAxiosError } from 'axios';
import { ref, computed } from 'vue';
import { Icons } from "@/assets/img/Icons";
import { useAuthStore } from "@/store/authStore";
import DeleteCard from '@/components/services/DeleteCard.vue';
import EditCard from "@/components/services/EditCard.vue";
import NotificationComp from '../notifications/NotificationComp.vue';
import type { Image } from '@/interfaces/services/Image';

const props = defineProps<{
  image: Image; // Используем Image вместо CardImage
  showPrice?: boolean;
}>();

const hasPrice = computed(() => {
  if (props.showPrice === false) return false;
  return 'price' in props.image && typeof props.image.price === 'number';
});

const showNotification = ref(false);
const notificationMessage = ref('');

const closeNotification = () => {
  showNotification.value = false;
};

const authStore = useAuthStore()

const emit = defineEmits(['updated', 'success', 'error']); 

const isDeleteModalOpen = ref(false)
const isEditModalOpen = ref(false)

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const handleDeleteConfirm = async (e:Event) => {
  e?.stopPropagation()
  try {
    const response = await axios.delete(
      `/api/services/${props.image.id}`
    )
    if (response.status === 200) {
      emit('updated')
      closeDeleteModal()
      emit('success');
    }
  } catch (error: unknown) {
    let errorMsg = 'Неизвестная ошибка';
    
    if (isAxiosError(error)) {
      errorMsg = `Ошибка ${error.response?.status || 'нет кода'}: ${error.response?.data?.error || error.message}`;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }

    closeDeleteModal()
    emit('error', errorMsg); 
  }
}

const handleSave = async (updatedData: Image) => {
  try {
    const response = await axios.put(
      `/api/services/${updatedData.id}`,
      { ...updatedData}
    )

    if (response.status === 200) {
      emit('updated')
      closeEditModal()
      emit('success');
    }
  } catch (error: unknown) {
     let errorMsg = 'Неизвестная ошибка';
    
    if (isAxiosError(error)) {
      errorMsg = `Ошибка ${error.response?.status || 'нет кода'}: ${error.response?.data?.error || error.message}`;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }
    
    closeEditModal()
    emit('error', errorMsg);
  }
};
</script>

<style lang="scss" scoped>
@use '../../styles/colors.scss';
.image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.card {
  flex: 0 0 48.5%;
  position: relative;
  color: colors.$white;
  width: auto;
  overflow: hidden;
  border-radius: 3vw;
  cursor: pointer;
  img{
    transition: opacity 0.3s ease;
  }
  .price {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 5%;
    right: 5%;
    background-color: colors.$blue;
    color: colors.$white;
    border-radius: 1.5vw;
    font-weight: bold;
    font-size: 1vw;
    padding: 1.5vw 1vw;
    z-index: 10;
    transition: background-color 0.3s ease;
  }
  .title{
    position: absolute;
    bottom: 7%;
    left: 7%;
    z-index: 10;
    color: colors.$white;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 2.5vw;
  }
  .price, .title {
    transition: transform 0.3s ease, font-size 0.3s ease;
  }
  .delete-icon {
    position: absolute;
    top: 8%;
    left: 12%;
    width: 2vw;
    height: 2vw;
    cursor: pointer;
    z-index: 20;
    filter: brightness(0) invert(1);
    transition: transform 0.3s ease;
  }

  .delete-icon:hover {
    transform: scale(1.2);
  }
}

.settings-icon{
  position: absolute;
  top: 9%;
  left: 5%;
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  z-index: 20;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.settings-icon:hover {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}

@media(max-width: 800px){
  .settings-icon {
    width: 4vw;
    height: 4vw;
    top: 9%;
    left: 3%;
  }
  .adminCard .delete-icon {
    width: 5vw;
    height: 5vw;
    top: 8%;
    left: 12%;
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
    .card:hover .price {
      background-color: transparent;
      transform: translateX(2vw) scale(1.2);
    }

    .card:hover .title {
      transform: translateX(-2vw) scale(1.2);
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
  background-color: colors.$blue;
  opacity: 0;
  transition: opacity 0.3s ease;  //анимация для заливки при наведении
}

.card:hover::after {  //анимация при наведении
  opacity: 0.5;
  .price{
    background-color: none;
  }
}

.card:hover .price {
  background-color: transparent;
  transform: translateX(1vw) scale(1.05);
}

.card:hover .title {
  transform: translateX(-1vw) scale(1.05);
}
</style>
