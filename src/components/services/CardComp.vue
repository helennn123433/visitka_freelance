<template>
  <div class="card" id=image.id>
    <div
      v-if="authStore.isAuthenticated"
      class="adminCard"
    >
      <img 
        class="settings-icon"
        :src="Icons.Gear"
        alt="шестерёнка"
        @click="openEditModal"
      >
      <img 
        class="delete-icon"
        :src="Icons.Trash"
        alt="мусорка"
        @click="openDeleteModal"
      >
    </div>
    <img
      :src="image.image"
      class="image"
    >
    <div class="price">
      {{ `от ${image.price} Р/час` }}
    </div>
    <div class="title">
      {{ image.title }}
    </div>

    <EditCard
      v-if="isEditModalOpen"
      :current-data="image"
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
import axios from 'axios';
import { ref } from 'vue';
import { Icons } from "@/assets/img/Icons";
import { useAuthStore } from "@/store/authStore";
import DeleteCard from '@/components/services/DeleteCard.vue';
import EditCard from "@/components/services/EditCard.vue";

const authStore = useAuthStore()
  
const props = defineProps<{
  image: { id: number; title: string; price: string; image: string; };
}>();

const emit = defineEmits(['updated'])  

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

const handleDeleteConfirm = async () => { 
  try {
    const response = await axios.delete(
      `http://localhost:3004/services/${props.image.id}`
    )

    if (response.status === 200) {
      emit('updated')
      closeDeleteModal()
    }
  } catch (error) {
    alert('Ошибка при удалении услуги: ' + error.message)
  }
}
const handleSave = async (updatedData: image) => {
  try {
    const response = await axios.put(
      `http://localhost:3004/services/${updatedData.id}`,
      { ...updatedData}
    )

    if (response.status === 200) {
      emit('updated')
      closeEditModal()
    }
  } catch (error) {
    alert('Ошибка при сохранении изменений')
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/colors.scss';
  .image {
    width: 100%; // Изображения занимают всю ширину контейнера
    height: 100%;
    background-size: cover; // Изображение будет масштабироваться с сохранением пропорций
    background-position: center; // Центрируем изображение
    position: relative;
    overflow: hidden;
  }

  .card {
    flex: 0 0 48.5%;
    position: relative;
    color: $white;
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
      background-color: $blue;
      color: $white;
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
      color: $white;
      font-weight: bold;
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
        background-color: transparent; /* Убираем фон при наведении */
        transform: translateX(2vw) scale(1.2); /* Двигаем вправо */
      }
    
      .card:hover .title {
        transform: translateX(-2vw) scale(1.2); /* Двигаем влево */
      }
    }
    .card:last-of-type {
      margin-bottom: 0;
    }

    .delete-icon {
      width: 6vw;
      height: 6vw;
      top: 9%;
      left: 15%;
    }
  }
  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: $blue; 
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
    background-color: transparent; /* Убираем фон при наведении */
    transform: translateX(1vw) scale(1.05); /* Двигаем вправо */
  }

  .card:hover .title {
    transform: translateX(-1vw) scale(1.05); /* Двигаем влево */
  }

</style>
