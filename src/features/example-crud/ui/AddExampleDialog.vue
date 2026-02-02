<template>
  <div 
    class="dialog-overlay" 
    @click.self="handleClose"
  >
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>
      <div 
        v-if="!typeInfo" 
        class="error-state"
      >
        <p>Тип не найден</p>
      </div>

      <form 
        v-else 
        @submit.prevent="handleSubmit"
      >
        <div>
          <p>
            Добавить пример для типа: <strong> {{ typeInfo.title }} </strong>
          </p>
        </div>

        <FormInput
          v-model="formData.title"
          label="Название проекта"
          placeholder="Введите название"
          :required="true"
          :error="showValidation && !formData.title ? 'Обязательное поле' : ''"
        />

        <FormInput
          v-model="formData.description"
          label="Описание"
          placeholder="Краткое описание работы"
          :required="true"
          :error="showValidation && !formData.description ? 'Обязательное поле' : ''"
        />

        <FormInput
          v-model.number="formData.price"
          type="number"
          label="Цена"
          placeholder="0"
          :required="true"
          :min="0"
          :error="showValidation && formData.price <= 0 ? 'Укажите цену' : ''"
        />

        <div class="form-group">
          <label>Изображение:</label>
          <FileInput 
            v-model="formData.file" 
          />
          <span 
            v-if="!formData.file && showValidation" 
            class="error-message"
          >
            Обязательное поле
          </span>
        </div>

        <div class="dialog-actions">
          <MyButton 
            type="button" 
            class="btn" 
            @click="handleClose"
          >
            Отмена
          </MyButton>
          <MyButton 
            type="submit" 
            :disabled="isLoading" 
            class="btn"
          >
            {{ isLoading ? "Добавление..." : "Добавить" }}
          </MyButton>
        </div>
      </form>

      <NotificationComp
        :visible="notification.state.visible"
        :message="notification.state.message"
        :type="notification.state.type"
        @close="notification.hide"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useExampleStore } from '@entities/example';
import { useSubserviceStore, type SubserviceType } from '@entities/subservice';
import { MyButton } from '@shared/ui/button';
import { NotificationComp } from '@shared/ui/notification';
import { useNotification } from '@shared/lib';
import { FileInput, FormInput } from '@/shared/ui/dialog';

interface Props {
  typeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
}>();

const exampleStore = useExampleStore();
const subserviceStore = useSubserviceStore();
const notification = useNotification();
const isLoading = ref(false);
const showValidation = ref(false);

const formData = ref({
  title: "",
  description: "",
  price: 0,
  file: null as File | null,
});

const dialogTitle = computed(() => "Добавить пример работы");

const typeInfo = computed<SubserviceType | null>(() => {
  for (const subservice of subserviceStore.subservices) {
    const foundType = subservice.types?.find((t) => t.id === props.typeId);
    if (foundType) return foundType;
  }
  return null;
});

const validate = () => {
  showValidation.value = true;
  return (
    formData.value.title.trim() !== "" &&
    formData.value.description.trim() !== "" &&
    formData.value.price > 0 &&
    formData.value.file !== null
  );
};

const handleClose = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (!validate()) {
    notification.showError("Заполните все обязательные поля");
    return;
  }

  if (!props.typeId) {
    notification.showError("Ошибка: ID типа не указан");
    return;
  }

  isLoading.value = true;
  try {
    await exampleStore.addExample({
      typeId: props.typeId,
      title: formData.value.title,
      description: formData.value.description,
      price: formData.value.price,
      image: formData.value.file as File,
    });

    emit("created");
    emit("close");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Ошибка при создании";
    notification.showError(message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 25vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .dialog {
    width: 80vw;
  }
}

.error-state {
  text-align: center;
  padding: 20px;
  color: #ff6b6b;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.preview-section {
  margin: 20px 0;
}

.preview-image {
  margin-top: 10px;
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-error {
  color: #ff6b6b;
  padding: 20px;
  text-align: center;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 0.5rem 1rem;
}
</style>
