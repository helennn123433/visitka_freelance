<template>
  <div
    :id="imageId"
    class="card"
    @click="handleCardClick"
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
      :src="image.image || ''"
      class="image"
    >
    <div
      v-if="hasPrice"
      class="price"
    >
      {{ `от ${imagePrice} Р/час` }}
    </div>
    <div class="title">
      {{ image.title || 'Без названия' }}
    </div>

    <DeleteCard
      v-if="isDeleteModalOpen"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <DeleteConfirmationDialog
      v-if="isDeleteModalOpen && isSubserviceType"
      type="type"
      :item-title="image.title"
      :item-id="image.id"
      :subservice-id="subserviceId"
      @confirm="handleDeleteTypeConfirm"
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
import { ref, computed } from 'vue';
import { useAuthStore } from "@/store/authStore";
import { useSearchingStore } from "@/store/searchingStore";
import type { Image } from '@/interfaces/services/Image';
import DeleteCard from '@/components/services/DeleteCard.vue';
import NotificationComp from '../notifications/NotificationComp.vue';
import DeleteConfirmationDialog from '@/components/subservices/DeleteConfirmationDialog.vue';
import { Icons } from "@/assets/img/Icons";

const searchStore = useSearchingStore();
const authStore = useAuthStore();

const props = defineProps<{
  image: Image;
  showPrice?: boolean;
  isSubserviceType?: boolean;
  subserviceId?: string;
  serviceId?: string;
}>();

const imageId = computed(() => props.image?.id?.toString() || 'unknown');
const imagePrice = computed(() => props.image?.price || 0);

const hasPrice = computed(() => {
  if (props.showPrice === false) return false;
  return props.image && 'price' in props.image && typeof props.image.price === 'number';
});

const showNotification = ref(false);
const notificationMessage = ref('');

const closeNotification = () => {
  showNotification.value = false;
};

const emit = defineEmits(['updated', 'success', 'error', 'edit', 'delete', 'click']);
const isDeleteModalOpen = ref(false)

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const openEditModal = () => {
  emit('edit', props.image);
}

const handleCardClick = () => {
  emit('click', props.image);
}

const handleDeleteConfirm = async () => {
  try {
    await searchStore.deleteService(props.image.id);
    emit('success');
    emit('updated');
  } catch (error) {
    console.error('Ошибка удаления услуги:', error);
    const errorMsg = error instanceof Error ? error.message : 'Не удалось удалить услугу';
    emit('error', errorMsg);
    showNotification.value = true;
    notificationMessage.value = errorMsg;
  } finally {
    closeDeleteModal();
  }
};

const handleDeleteTypeConfirm = async (data: any) => {
  try {
    const typeId = data?.itemId;
    const subserviceId = data?.subserviceId || props.subserviceId;
  
    console.log('Итоговые ID для отправки:', { typeId, subserviceId });
  
    if (!typeId || !subserviceId) {
      console.error('Не хватает данных для удаления:', { typeId, subserviceId });
      return;
    }
    
    await searchStore.deleteSubserviceType(subserviceId, typeId);
    emit('success');
    emit('updated');
  } catch (error) {
    console.error('Ошибка удаления типа:', error);
    const errorMsg = error instanceof Error ? error.message : 'Не удалось удалить тип';
    emit('error', errorMsg);
    showNotification.value = true;
    notificationMessage.value = errorMsg;
  } finally {
    closeDeleteModal();
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