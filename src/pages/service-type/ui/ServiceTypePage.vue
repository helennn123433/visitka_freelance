<template>
  <div class="serviceTypePage">
    <Breadcrumbs :items="breadcrumbItems" />
    <div class="header-section">
      <MyHeader class="header">
        <span>{{ subserviceTitle.toUpperCase() }}</span>
      </MyHeader>
      <div class="container">
        <MyButton
          v-if="authStore.isAuthenticated"
          type="button"
          class="btn"
          @click="showAddDialog = true"
        >
          + Добавить пример
        </MyButton>
      </div>
    </div>

    <div class="content">
      <div class="cards-field">
        <div v-if="examples.length > 0" class="cards-grid">
          <div
            v-for="example in examples"
            :key="example.id"
            class="card"
            @mouseenter="hoveredExample = example.id"
            @mouseleave="hoveredExample = null"
          >
            <img
              :src="example.image"
              :alt="'Example ' + example.id"
              class="image"
            />
            <div
              v-if="authStore.isAuthenticated && hoveredExample === example.id"
              class="admin-controls"
            >
              <div class="icon-container">
                <div
                  class="icon-background"
                  @click.stop="openEditModal(example)"
                >
                  <img
                    class="settings-icon"
                    :src="Icons.Gear"
                    alt="шестерёнка"
                    title="Редактировать"
                  />
                </div>
              </div>
              <div class="icon-container">
                <div
                  class="icon-background"
                  @click.stop="openDeleteModal(example)"
                >
                  <img
                    class="delete-icon"
                    :src="Icons.Trash"
                    alt="мусорка"
                    title="Удалить"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p v-if="isLoading">Загрузка...</p>
          <p v-else>Примеры работ не найдены</p>
        </div>
      </div>
    </div>

    <AddExampleDialog
      v-if="showAddDialog && typeId"
      :type-id="typeId"
      @close="showAddDialog = false"
      @created="handleExampleCreated"
    />

    <EditExampleDialog
      v-if="showEditDialog"
      :example-data="selectedExample"
      :subservice-id="subserviceId"
      @close="closeEditDialog"
      @updated="handleExampleUpdated"
    />

    <DeleteExampleDialog
      v-if="showDeleteDialog"
      :item-id="selectedExampleId"
      :item-image="selectedExampleImage"
      :type-id="selectedTypeId"
      @confirm="handleDeleteExample"
      @cancel="closeDeleteDialog"
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MyHeader } from "@shared/ui/header";
import { MyButton } from "@shared/ui/button";
import { Icons } from "@shared/ui/icons";
import { NotificationComp } from "@shared/ui/notification";
import { Breadcrumbs, type BreadcrumbItem } from "@shared/ui/breadcrumbs";
import { useNotification } from "@shared/lib";
import { useServiceStore } from "@entities/service";
import { useSubserviceStore } from "@entities/subservice";
import { useExampleStore } from "@entities/example";
import type { Example } from "@entities/example";
import { useAuthStore } from "@features/auth";
import {
  AddExampleDialog,
  EditExampleDialog,
  DeleteExampleDialog,
} from "@features/example-crud";

const route = useRoute();
const router = useRouter();
const serviceStore = useServiceStore();
const subserviceStore = useSubserviceStore();
const exampleStore = useExampleStore();
const authStore = useAuthStore();
const notification = useNotification();

const serviceId = ref<string>(route.params.serviceId as string);
const typeId = ref<string>(route.params.typeId as string);
const subserviceId = ref<string>(route.params.subserviceId as string);
const serviceTitle = ref<string>((route.query.serviceTitle as string) || "");
const subserviceTitle = ref<string>(
  (route.query.subserviceTitle as string) || "",
);

const isLoading = ref(true);
const examples = ref<Example[]>([]);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const hoveredExample = ref<string | null>(null);

const selectedExampleId = ref<string>("");
const selectedExampleImage = ref<string>("");
const selectedTypeId = ref<string>("");

const selectedExample = ref<Example | null>(null);

const subservice = computed(() => {
  return subserviceStore.getSubserviceById(subserviceId.value);
});

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: "Услуги", to: "/" },
  { label: serviceTitle.value, onClick: () => router.back() },
  { label: subserviceTitle.value },
]);

const loadExamples = async () => {
  try {
    examples.value = await exampleStore.fetchExamplesByTypeId(typeId.value);
  } catch (error) {
    console.error("Ошибка загрузки примеров:", error);
  }
};

const handleExampleCreated = async () => {
  notification.showSuccess("Пример успешно добавлен");
  await loadExamples();
};

const openDeleteModal = (example: Example) => {
  selectedExampleId.value = example.id;
  selectedExampleImage.value = example.image;
  selectedTypeId.value = example.typeId;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  selectedExampleId.value = "";
  selectedExampleImage.value = "";
  selectedTypeId.value = "";
};

const handleDeleteExample = async (data: {
  itemId: string;
  typeId: string;
}) => {
  try {
    await exampleStore.deleteExample(data.typeId, data.itemId);
    notification.showSuccess("Пример успешно удален");
    await loadExamples();
    closeDeleteDialog();
  } catch (error) {
    console.error("Ошибка при удалении примера:", error);
    notification.showError("Не удалось удалить пример");
  }
};

const openEditModal = (example: Example) => {
  selectedExample.value = example;
  showEditDialog.value = true;
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  selectedExample.value = null;
};

const handleExampleUpdated = async () => {
  notification.showSuccess("Пример успешно обновлен");
  await loadExamples();
  closeEditDialog();
};

onMounted(async () => {
  if (!subserviceId.value || !serviceId.value) {
    await router.push("/services");
    return;
  }

  try {
    if (subserviceStore.subservices.length === 0) {
      await subserviceStore.fetchSubservices();
    }

    if (!typeId.value && subservice.value?.types &&subservice.value.types.length > 0) {
      typeId.value = subservice.value.types[0].id;
    }

    if (!serviceTitle.value || !subserviceTitle.value) {
      const foundSubservice = subservice.value;
      if (foundSubservice) {
        subserviceTitle.value = foundSubservice.title;

        const service = serviceStore.getServiceById(serviceId.value);
        if (service) {
          serviceTitle.value = service.title;
        }
      }
    }

    if (typeId.value) {
      await loadExamples();
    }
  } catch (error) {
    console.error("Ошибка при инициализации страницы:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
$white: #ffffff;
$blue: #0652ff;

.serviceTypePage {
  display: flex;
  flex-direction: column;
  background-color: $white;
  padding: 1vw 1.5vw 1.5vw;
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
  display: flex;
  flex-wrap: wrap;
  gap: 1.5vw;
  justify-content: center;
  width: 100%;
  padding: 10px;
}

.card {
  width: 240px;
  height: 240px;
  overflow: hidden;
  position: relative;
  box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.2);
}

.admin-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-background {
  width: 1.5vw;
  height: 1.5vw;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.delete-icon {
  width: 1vw;
  height: 1vw;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.delete-icon:hover {
  transform: scale(1.1);
}

.settings-icon {
  width: 1vw;
  height: 1vw;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
  transform-origin: center;
}

.icon-background:hover .settings-icon {
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

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.container {
  display: flex;
  justify-content: end;
}

.btn {
  margin: 0 10px 20px 0;
}
@media (min-width: 1921px) {
  .card {
    width: 10vw;
    height: 10vw;
  }
  .about-us-header span {
    font-size: clamp(40px, 5vw, 100px);
  }
}
@media (max-width: 768px) {
  .serviceTypePage {
    padding: 1rem;
  }

  .card {
    width: 90%;
  }
}
</style>
