<template>
  <div 
    class="dialog-overlay" 
    @click.self="handleClose"
  >
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>

      <form @submit.prevent="handleSubmit">
        <div 
          v-if="availableTypes.length > 0" 
          class="form-group"
        >
          <label>Тип:</label>
          <select
            v-model="formData.typeId"
            required
            :class="{ error: !formData.typeId && showValidation }"
          >
            <option 
              value="" 
              disabled
            >
              Выберите тип
            </option>
            <option
              v-for="type in availableTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.title }}
            </option>
          </select>
          <span 
            v-if="!formData.typeId && showValidation" 
            class="error-message"
          >
            Обязательное поле
          </span>
        </div>

        <FormInput 
          v-model="formData.title" 
          label="Заголовок" 
          required 
          placeholder="Например: Современный интерьер" 
        />

        <FormInput 
          v-model="formData.description" 
          label="Описание" 
          required 
          placeholder="Краткое описание проекта" 
        />

        <FormInput 
          v-model.number="formData.price" 
          label="Цена" 
          type="number" 
          required 
        />

        <div class="form-group">
          <label class="label">Изображение</label>
          <FileInput v-model="formData.imageFile" />
          <small 
            v-if="!formData.imageFile" 
            class="hint"
          >
            Оставьте пустым, чтобы не менять текущее фото
          </small>
        </div>

        <div class="dialog-actions">
          <MyButton
            type="submit"
            :disabled="isLoading || !hasChanges"
            class="btn"
          >
            {{ isLoading ? "Сохранение..." : "Сохранить изменения" }}
          </MyButton>
          <MyButton 
            type="button" 
            class="btn" 
            @click="handleClose"
          >
            Отмена
          </MyButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useExampleStore, type Example } from "@entities/example";
import { useSubserviceStore } from "@entities/subservice";
import { MyButton } from "@shared/ui/button";
import { FormInput, FileInput } from "@/shared/ui/dialog";

interface Props {
  exampleData: Example;
  subserviceId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [updatedExample: Example];
}>();

const exampleStore = useExampleStore();
const subserviceStore = useSubserviceStore();
const isLoading = ref(false);
const showValidation = ref(false);
const imageError = ref(false);

const formData = ref({
  typeId: props.exampleData.typeId,
  title: props.exampleData.title || "",
  description: props.exampleData.description || "",
  price: props.exampleData.price || 0,
  imageFile: null as File | null,
});

const dialogTitle = computed(() => "Редактировать пример работы");

const hasChanges = computed(() => {
  return (
    formData.value.typeId !== props.exampleData.typeId ||
    formData.value.title !== (props.exampleData.title || "") ||
    formData.value.description !== (props.exampleData.description || "") ||
    formData.value.price !== (props.exampleData.price || 0) ||
    formData.value.imageFile !== null
  );
});

const availableTypes = computed(() => {
  return subserviceStore.getSubserviceById(props.subserviceId)?.types || [];
});

const handleClose = () => {
  emit("close");
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    await exampleStore.updateExample(props.exampleData.id, {
        id: props.exampleData.id,
        typeId: formData.value.typeId,
        title: formData.value.title,
        description: formData.value.description,
        price: formData.value.price,
        image: formData.value.imageFile
      },
    props.exampleData.typeId);

    emit("updated");
    emit("close");
  } catch (error) {
    alert("Ошибка при сохранении");
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => formData.value.image,
  () => {
    imageError.value = false;
  },
);
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error,
.form-group select.error {
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

.preview-info {
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
}

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 0.5rem 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
