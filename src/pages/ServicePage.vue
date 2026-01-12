<template>
  <div class="servicePage">
    <div class="breadCrumps">
      <router-link 
        to="/" 
        class="breadCrumps__services"
      >
        УСЛУГИ
      </router-link>
      <div class="breadCrumps__separator">
        »
      </div>
      <div class="breadCrumps__serviceType">
        {{ serviceTitle.toUpperCase() }}
      </div>
    </div>
    <div class="header-section">
      <MyHeader class="header">
        <span>{{ serviceTitle.toUpperCase() }}</span>
      </MyHeader>

      <div v-if="authStore.isAuthenticated" class="admin-actions">
        <my-button @click="handleAddButtonClick" class="btn" :disabled="!serviceId">
          {{ buttonText }}
        </my-button>

        <my-button 
              v-if="hasSubservices" 
              @click="openDeleteSubserviceDialog" 
              variant="danger"
              class="btn__delete"
            >
              Удалить подуслугу
        </my-button>
      </div>
    </div>

    <div class="content">
      <div class="cards-field">
        <div v-if="types.length > 0" class="cards-grid">
         <CardComp 
          v-for="type in filteredTypes" 
          :key="type.id" 
          :image="{
            id: type.id,
            title: type.title,
            image: type.image,
            price: undefined
          }"
          :show-price="false" 
          :is-subservice-type="true"
          :subservice-id="getSubserviceIdForType(type.id)"
          @edit="openEditDialog"
          @click="goToTypeExamples(type)"
        />
        </div>
        <div v-else>
          <p v-if="searchStore.isLoading">Загрузка...</p>
          <p v-else>Услуги не найдены</p>
        </div>
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

     <NotificationComp 
      :visible="notificationVisible"
      :message="notificationMessage"
      :type="notificationType"
      @close="notificationVisible = false"
    />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchingStore } from '@/store/searchingStore';
import { useAuthStore } from '@/store/authStore';
import CardComp from '@/components/services/CardComp.vue';
import MyHeader from '@/components/ui/MyHeader.vue';
import MyButton from '@/components/ui/MyButton.vue';
import type { SubserviceType } from '@/interfaces/services/Subservices';
import EditTypeDialog from '@/components/subservices/EditTypeDialog.vue';
import DeleteConfirmationDialog from '@/components/subservices/DeleteConfirmationDialog.vue';
import NotificationComp from '@/components/notifications/NotificationComp.vue';
import SubserviceDialog from '@/components/subservices/SubserviceDialog.vue';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchingStore();
const authStore = useAuthStore();

const serviceId = ref<string>(route.params.serviceId as string);
const serviceTitle = ref<string>(route.query.title as string || '');

const editingType = ref<SubserviceType | null>(null);
const showDeleteSubserviceDialog = ref(false);

const notificationVisible = ref(false);
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error'>('success');

const types = computed(() => {
  return searchStore.getTypesByServiceId(serviceId.value);
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


const openEditDialog = (type: SubserviceType) => {
  editingType.value = { ...type };
};

const closeEditDialog = () => {
  editingType.value = null;
};

const currentSubservice = computed(() => {
  const subservices = searchStore.getSubservicesByServiceId(serviceId.value);
  return subservices.length > 0 ? subservices[0] : null;
});


const openDeleteSubserviceDialog = () => {
  if (!currentSubservice.value) {
    showNotification('Подуслуга не найдена', 'error');
    return;
  }
  
  showDeleteSubserviceDialog.value = true;
};

const closeDeleteSubserviceDialog = () => {
  showDeleteSubserviceDialog.value = false;
};

const handleDeleteSubserviceConfirm = async (data: any) => {
  try {
    const { itemId } = data;
    
    if (!itemId) {
      throw new Error('ID подуслуги не указан');
    }
    
    await searchStore.deleteSubservice(itemId);
    showNotification('Подуслуга успешно удалена', 'success');
    
    await searchStore.fetchSubservices();
  } catch (error) {
    console.error('Ошибка удаления подуслуги:', error);
    showNotification(error instanceof Error ? error.message : 'Ошибка удаления подуслуги', 'error');
  } finally {
    closeDeleteSubserviceDialog();
  }
};

const getSubserviceIdForType = (typeId: string): string => {
  const subserviceId = searchStore.getSubserviceIdByTypeId(typeId);
  
  if (!subserviceId) {
    console.error(`Не удалось найти subserviceId для typeId: ${typeId}`);
  }
  
  return subserviceId || '';
};


const handleTypeUpdated = () => {
  showNotification('Тип успешно обновлен', 'success');
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

const showNotification = (message: string, type: 'success' | 'error') => {
  notificationMessage.value = message;
  notificationType.value = type;
  notificationVisible.value = true;
  
  setTimeout(() => {
    notificationVisible.value = false;
  }, type === 'error' ? 5000 : 2000);
};

const hasSubservices = computed(() => {
  const subservices = searchStore.getSubservicesByServiceId(serviceId.value);
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
    const subservices = searchStore.getSubservicesByServiceId(serviceId.value);
    return subservices[0]?.subserviceId;
  }
  return undefined;
});

const showDialog = ref(false);

const handleAddButtonClick = async () => {
  if (searchStore.images.length === 0) {
    try {
      await searchStore.fetchServices();
    } catch (error) {
      showNotification('Ошибка загрузки услуг', 'error');
      return;
    }
  }

  const service = searchStore.getServiceById(serviceId.value);
  if (!service) {
    showNotification('Сервис не найден', 'error');
    return;
  }

  if (hasSubservices.value && searchStore.subservicesData.length === 0) {
    try {
      await searchStore.fetchSubservices();
    } catch (error) {
      showNotification('Ошибка загрузки подуслуг', 'error');
      return;
    }
  }

  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const handleSubserviceCreated = () => {
  showNotification('Подуслуга успешно создана', 'success');
  searchStore.fetchSubservices();
  closeDialog();
};

const handleTypesAdded = () => {
  showNotification('Типы успешно добавлены', 'success');
  searchStore.fetchSubservices();
  closeDialog();
};

onMounted(async () => {
  try {
    if (searchStore.images.length === 0) {
      await searchStore.fetchServices();
    }

    await searchStore.fetchSubservices();
    
    if (!serviceTitle.value) {
      const service = searchStore.getServiceById(serviceId.value);
      if (service) {
        serviceTitle.value = service.title;
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    showNotification('Ошибка загрузки данных', 'error');
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
@use '@/styles/colors.scss';

.card {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.servicePage {
  display: flex;
  flex-direction: column;
  background-color: colors.$white;
  padding: 1.5vw;
  padding-top: 1vw;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.content {
  width: 100%;
}

.cards-field {
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}

.cards-grid {
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

.breadCrumps{
  display: flex;
  padding-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  flex-wrap: wrap;

  &__services{
    color: #898989;
    cursor: pointer;
    text-decoration: none;
  }

  &__separator{
    color: #898989;
    padding: 0 10px;
  }

  &__serviceType{
    color: #0652FF;
  }
}

.btn{
  width: 150px;
  height: 40px;
  margin: 0 10px 10px 0;

  &__delete{
    width: 200px;
    height: 40px;
  }
  &__delete:hover{
    background-color: #082f8b;
  }
}

.admin-actions{
  display: flex;
  justify-content: end;
}

@media (max-width: 768px) {
  .cards-grid {
    gap: 0;
    flex-direction: column;
    align-items: center;
  }
  
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

  .breadCrumps{
    font-size: 14px;
  }
}
</style>