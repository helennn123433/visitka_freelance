<template>
  <div class="servicePage">
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="header-section">
      <MyHeader class="header">
        <span>{{ serviceTitle.toUpperCase() }}</span>
      </MyHeader>

      <div
        v-if="authStore.isAuthenticated"
        class="admin-actions"
      >
        <MyButton
          class="btn"
          :disabled="!serviceId"
          @click="handleAddButtonClick"
        >
          {{ buttonText }}
        </MyButton>

        <MyButton
          v-if="hasSubservices"
          variant="danger"
          class="btn__delete"
          @click="openDeleteSubserviceDialog"
        >
          Удалить все подуслуги
        </MyButton>
      </div>
    </div>
    <div class="content">
      <div
        v-if="types.length > 0"
        class="cards-grid"
      >
        <ServiceCard
          v-for="type in filteredTypes"
          :key="type.id"
          :service="{
            id: type.id,
            title: type.title,
            image: type.image,
            price: undefined
          }"
          :show-admin-controls="authStore.isAuthenticated"
          :show-price="false"
          :is-subservice-type="true"
          :subservice-id="getSubserviceIdForType(type.id)"
          @edit="openEditDialog"
          @click="goToTypeExamples(type)"
          @delete="openDeleteSubserviceTypeDialog(type.id)"
        />
      </div>
      <div v-else>
        <p v-if="searchStore.isLoading">
          Загрузка...
        </p>
        <p v-else>
          Услуги не найдены
        </p>
      </div>
    </div>

    <SubserviceDialog
      v-if="showDialog"
      :service-id="serviceId"
      :subservice-id="selectedSubserviceId"
      :mode="dialogMode"
      @close="closeDialog"
      @created="handleSubserviceCreated"
      @added="handleTypesAdded"
    />

    <EditTypeDialog
      v-if="editingType"
      :type-data="editingType"
      @close="closeEditDialog"
      @updated="handleTypeUpdated"
    />

    <DeleteConfirmationDialog
      v-if="showDeleteSubserviceDialog"
      type="subservice"
      :item-id="currentSubservice?.subserviceId || ''"
      @confirm="handleDeleteSubserviceConfirm"
      @cancel="closeDeleteSubserviceDialog"
    />

    <DeleteConfirmationDialog
      v-if="showDeleteSubserviceTypeDialog"
      type="type"
      :item-id="currentTypeId || ''"
      :subservice-id="currentSubservice?.subserviceId || ''"
      @confirm="handleDeleteSubserviceTypeConfirm"
      @cancel="closeDeleteSubserviceTypeDialog"
    />
    <NotificationComp
      :visible="notification.state.visible"
      :message="notification.state.message"
      :type="notification.state.type"
      @close="notification.hide"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@features/search';
import { useAuthStore } from '@features/auth';
import { useServiceStore, ServiceCard } from '@entities/service';
import { useSubserviceStore } from '@entities/subservice';
import type { SubserviceType } from '@entities/subservice';
import { SubserviceDialog, EditTypeDialog, DeleteConfirmationDialog } from '@features/subservice-crud';
import { MyHeader } from '@shared/ui/header';
import { MyButton } from '@shared/ui/button';
import { NotificationComp } from '@shared/ui/notification';
import { Breadcrumbs, type BreadcrumbItem } from '@shared/ui/breadcrumbs';
import { useNotification } from '@shared/lib';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();
const serviceStore = useServiceStore();
const subserviceStore = useSubserviceStore();
const authStore = useAuthStore();
const notification = useNotification();

const serviceId = ref<string>(route.params.serviceId as string);
const serviceTitle = ref<string>(route.query.title as string || '');

const editingType = ref<SubserviceType | null>(null);
const showDeleteSubserviceDialog = ref(false);
const showDeleteSubserviceTypeDialog = ref(false);

const types = computed(() => {
  return subserviceStore.getTypesByServiceId(serviceId.value);
});

const filteredTypes = computed(() => {
  if (!searchStore.searchInput.trim()) {
    return types.value;
  }

  const searchTerm = searchStore.searchInput.toLowerCase();
  return types.value.filter(type =>
    type.title.toLowerCase().includes(searchTerm)
  );
});

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Услуги', to: '/' },
  { label: serviceTitle.value }
]);

const openEditDialog = (type: SubserviceType) => {
  editingType.value = { ...type };
};

const closeEditDialog = () => {
  editingType.value = null;
};

const currentSubservice = computed(() => {
  const subservices = subserviceStore.getSubservicesByServiceId(serviceId.value);
  return subservices.length > 0 ? subservices[0] : null;
});
let currentTypeId = null;

const openDeleteSubserviceDialog = () => {
  if (!currentSubservice.value) {
    notification.showError('Подуслуга не найдена');
    return;
  }

  showDeleteSubserviceDialog.value = true;
};

const openDeleteSubserviceTypeDialog = (type_id: string) => {
  if (!currentSubservice.value) {
    notification.showError('Подуслуга не найдена');
    return;
  }
  currentTypeId = type_id;
  showDeleteSubserviceTypeDialog.value = true;
};

const closeDeleteSubserviceDialog = () => {
  showDeleteSubserviceDialog.value = false;
};

const closeDeleteSubserviceTypeDialog = () => {
  showDeleteSubserviceTypeDialog.value = false;
};

const handleDeleteSubserviceConfirm = async (data: { itemId: string }) => {
  try {
    const { itemId } = data;

    if (!itemId) {
      throw new Error('ID подуслуги не указан');
    }

    await subserviceStore.deleteSubservice(itemId);
    notification.showSuccess('Подуслуга успешно удалена');

    await subserviceStore.fetchSubservices();
  } catch (error) {
    console.error('Ошибка удаления подуслуги:', error);
    notification.showError(error instanceof Error ? error.message : 'Ошибка удаления подуслуги');
  } finally {
    closeDeleteSubserviceDialog();
  }
};

const handleDeleteSubserviceTypeConfirm = async (data: { itemId: string, subserviceId: string}) => {
  try {
    const { itemId, subserviceId } = data;

    if (!itemId) {
      throw new Error('ID подуслуги не указан');
    }

    await subserviceStore.deleteSubserviceType(subserviceId, itemId);
    notification.showSuccess('Подуслуга успешно удалена');

    await subserviceStore.fetchSubservices();
  } catch (error) {
    console.error('Ошибка удаления подуслуги:', error);
    notification.showError(error instanceof Error ? error.message : 'Ошибка удаления подуслуги');
  } finally {
    closeDeleteSubserviceTypeDialog();
  }
};

const getSubserviceIdForType = (typeId: string): string => {
  const subserviceId = subserviceStore.getSubserviceIdByTypeId(typeId);

  if (!subserviceId) {
    console.error(`Не удалось найти subserviceId для typeId: ${typeId}`);
  }

  return subserviceId || '';
};

const handleTypeUpdated = () => {
  notification.showSuccess('Тип успешно обновлен');
  closeEditDialog();
};

const goToTypeExamples = (type: SubserviceType) => {
  router.push({
    name: 'subservice-examples',
    params: {
      serviceId: serviceId.value,
      typeId: type.id,
      subserviceId: getSubserviceIdForType(type.id),
    },
    query: {
      serviceTitle: serviceTitle.value,
      subserviceTitle: type.title
    }
  });
};

const hasSubservices = computed(() => {
  const subservices = subserviceStore.getSubservicesByServiceId(serviceId.value);
  return subservices.length > 0;
});

const buttonText = computed(() => {
  return hasSubservices.value ? 'Добавить тип' : 'Создать подуслугу';
});

const dialogMode = computed(() => {
  return hasSubservices.value ? 'add-types' : 'create-subservice';
});

const selectedSubserviceId = computed(() => {
  if (hasSubservices.value) {
    const subservices = subserviceStore.getSubservicesByServiceId(serviceId.value);
    return subservices[0]?.subserviceId;
  }
  return undefined;
});

const showDialog = ref(false);

const handleAddButtonClick = async () => {
  if (serviceStore.services.length === 0) {
    try {
      await serviceStore.fetchServices();
    } catch (error) {
      notification.showError('Ошибка загрузки услуг');
      return;
    }
  }

  const service = serviceStore.getServiceById(serviceId.value);
  if (!service) {
    notification.showError('Сервис не найден');
    return;
  }

  if (hasSubservices.value && subserviceStore.subservices.length === 0) {
    try {
      await subserviceStore.fetchSubservices();
    } catch (error) {
      notification.showError('Ошибка загрузки подуслуг');
      return;
    }
  }

  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const handleSubserviceCreated = () => {
  notification.showSuccess('Подуслуга успешно создана');
  subserviceStore.fetchSubservices();
  closeDialog();
};

const handleTypesAdded = () => {
  notification.showSuccess('Типы успешно добавлены');
  subserviceStore.fetchSubservices();
  closeDialog();
};

onMounted(async () => {
  try {
    if (serviceStore.services.length === 0) {
      await serviceStore.fetchServices();
    }

    await subserviceStore.fetchSubservices();

    if (!serviceTitle.value) {
      const service = serviceStore.getServiceById(serviceId.value);
      if (service) {
        serviceTitle.value = service.title;
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    notification.showError('Ошибка загрузки данных');
  }
});

watch(() => route.params.serviceId, (newId) => {
  serviceId.value = newId as string;
  if (route.query.title) {
    serviceTitle.value = route.query.title as string;
  }
}, { immediate: true });
</script>

<style scoped lang="scss">
$white: #FFFFFF;
$blue: #0652FF;

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.servicePage {
  display: flex;
  flex-direction: column;
  background-color: $white;
  padding: 1.5vw;
  padding-top: 1vw;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.content {
  width: 100%;

  p {
    font-size: 1.4rem;
    text-align: center;
    font-weight: 500;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
}

.cards-grid {
  overflow: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 3vw, 32px);
  row-gap: clamp(16px, 1.5vw, 48px);
  justify-items: center;
}
@media (max-width: 767px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 0px;
  }
}
.btn {
  margin: 0 10px 20px 0;

  &__delete:hover {
    background-color: #082f8b;
  }
}

.btn__delete {
  margin: 0 10px 20px 10px;
}

.admin-actions {
  display: flex;
  justify-content: end;
}

@media (max-width: 768px) {
  .servicePage {
    padding: 1rem;
  }
}

@media (max-width: 450px) {
  .header {
    flex-direction: column;
    gap: 3vw;
    margin-bottom: 3vw;
  }
}

@media (min-width: 1921px) {
  .about-us-header
    span {
      font-size: clamp(40px, 5vw, 100px);
    }
}
</style>
