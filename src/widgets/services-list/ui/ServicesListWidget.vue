<template>
  <div class="container">
    <div class="header">
      <div>УСЛУГИ</div>
    </div>
    <div
      v-if="authStore.isAuthenticated"
      class="container__header"
    >
      <MyButton
        class="container__btn"
        @click="toggleDialog"
      >
        Добавить
      </MyButton>
    </div>
    <AddServiceDialog
      v-if="isDialogOpen"
      @toggle-dialog="toggleDialog"
      @service-added="handleServiceUpdate"
      @success="() => notification.showSuccess('Услуга успешно добавлена')"
      @error="notification.showError"
    />
    <EditServiceDialog
      v-if="editingItem"
      :current-data="editingItem"
      @close="closeEditModal"
      @save="handleSaveService"
    />
    <ConfirmDialog
      v-model="isDeleteDialogOpen"
      title="Удаление услуги"
      :message="`Вы уверены, что хотите удалить услугу '${deletingItem?.title}'?`"
      confirm-text="Удалить"
      cancel-text="Отмена"
      variant="danger"
      @confirm="handleDeleteService"
      @cancel="closeDeleteModal"
    />
    <div class="cards-field">
      <ServiceCard
        v-for="service in searchStore.filteredServices"
        :key="service.id"
        :service="{
          id: service.id,
          title: service.title,
          image: service.image,
          price: service.price
        }"
        :show-price="true"
        :show-admin-controls="authStore.isAuthenticated"
        @updated="handleServiceUpdate"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @success="() => notification.showSuccess('Операция выполнена')"
        @error="notification.showError"
        @click="goToService(service)"
      />
    </div>
    <NotificationComp
      :visible="notification.state.visible"
      :message="notification.state.message"
      :type="notification.state.type"
      @close="notification.hide"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@features/auth';
import { useSearchStore } from '@features/search';
import { useServiceStore, ServiceCard } from '@entities/service';
import type { Service } from '@entities/service';
import { AddServiceDialog, EditServiceDialog } from '@features/service-crud';
import { ConfirmDialog } from '@shared/ui/dialog';
import { MyButton } from '@shared/ui/button';
import { NotificationComp } from '@shared/ui/notification';
import { emitter, useNotification } from '@shared/lib';

const isDialogOpen = ref(false);
const editingItem = ref<Service | null>(null);
const deletingItem = ref<Service | null>(null);
const isDeleteDialogOpen = ref(false);

const router = useRouter();
const searchStore = useSearchStore();
const serviceStore = useServiceStore();
const authStore = useAuthStore();
const notification = useNotification();

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const openEditModal = (image: Service) => {
  editingItem.value = { ...image };
};

const closeEditModal = () => {
  editingItem.value = null;
};

const openDeleteModal = (service: Service) => {
  deletingItem.value = { ...service };
  isDeleteDialogOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteDialogOpen.value = false;
  deletingItem.value = null;
};

const handleDeleteService = async () => {
  const serviceToDelete = deletingItem.value;
  if (!serviceToDelete) return;

  closeDeleteModal();

  try {
    await serviceStore.deleteService(serviceToDelete.id);
    notification.showSuccess('Услуга успешно удалена');
    await serviceStore.fetchServices();
  } catch (error) {
    console.error('Ошибка удаления услуги:', error);
    notification.showError('Не удалось удалить услугу');
  }
};

const handleSaveService = async (updatedData: Service) => {
  try {
    await serviceStore.updateService(updatedData.id, {
      title: updatedData.title,
      price: updatedData.price,
      image: updatedData.image,
    });

    notification.showSuccess('Услуга успешно обновлена');
    closeEditModal();
    await serviceStore.fetchServices();
  } catch (error) {
    console.error('Ошибка обновления услуги:', error);
    notification.showError('Не удалось обновить услугу');
  }
};

const handleServiceUpdate = async () => {
  await serviceStore.fetchServices();
  emitter.emit('section-loaded');
};

const goToService = (service: Service) => {
  router.push({
    name: 'service',
    params: { serviceId: service.id },
  });
};

onMounted(async () => {
  try {
    await serviceStore.fetchServices();
  } catch (error) {
    notification.showError('Не удалось загрузить услуги');
  }
  await nextTick();
  emitter.emit('section-loaded');
});
</script>

<style lang="scss" scoped>
$white: #FFFFFF;
$blue: #0652FF;

.container {
  display: flex;
  flex-direction: column;
  background-color: $white;
  padding: 1.5vw;

  &__header {
    display: flex;
    justify-content: end;
  }

  &__btn {
    width: 150px;
    height: 40px;
    margin: 0 10px 10px 0;
  }

  &__btn:hover {
    background-color: #082f8b;
  }
}

.cards-field {
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5vw;
  justify-content: space-between;
  align-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
  line-height: 100%;
  width: 100%;
  color: $blue;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  padding-bottom: 16px;
}

@media (max-width: 767px) {
  .cards-field {
    gap: 0;
    justify-content: center;
  }

  .container {
    border-radius: 0;
    box-shadow: none;
  }
}

@media (max-width: 450px) {
  .header {
    flex-direction: column;
    gap: 3vw;
    margin-bottom: 3vw;

    .header-buttons {
      margin-right: 0;
    }

    img {
      width: 3vw;
    }
  }
}
</style>
