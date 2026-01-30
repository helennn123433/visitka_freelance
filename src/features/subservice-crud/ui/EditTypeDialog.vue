<template>
  <div
    class="dialog-overlay"
    @click.self="handleClose"
  >
    <div class="dialog">
      <h3>Редактировать тип</h3>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Название типа:</label>
          <input
            v-model="formData.title"
            required
            placeholder="Введите название типа"
            :class="{ 'error': !formData.title && showValidation }"
          >
          <span
            v-if="!formData.title && showValidation"
            class="error-message"
          >
            Обязательное поле
          </span>
        </div>

        <div class="form-group">
          <label>URL изображения:</label>
          <FileInput v-model="imageFile"/>
          <span
            v-if="!imageFile && showValidation"
            class="error-message"
          >
            Обязательное поле
          </span>
        </div>

        <div class="dialog-actions">
          <MyButton
            type="submit"
            :disabled="isLoading"
            class="btn"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </MyButton>
          <MyButton
            type="button"
            class="btn"
            @click="$emit('close')"
          >
            Отмена
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
import { useSubserviceStore, type SubserviceType } from '@entities/subservice';
import { MyButton } from '@shared/ui/button';
import { FileInput } from '@shared/ui/dialog';
import { NotificationComp } from '@shared/ui/notification';
import { useNotification } from '@shared/lib';

interface Props {
  typeData: SubserviceType;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const subserviceStore = useSubserviceStore();
const notification = useNotification();
const isLoading = ref(false);
const showValidation = ref(false);

const formData = ref({
  title: props.typeData.title,
  serviceId: props.typeData.serviceId
});

const imageFile = ref<File | null>(null);

const subserviceId = computed(() => {
  return subserviceStore.getSubserviceIdByTypeId(props.typeData.id || '') || '';
});

const validateForm = (): boolean => {
  showValidation.value = true;
  if (!formData.value.title.trim() || !imageFile.value) {
    notification.showError('Заполните все обязательные поля');
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    notification.showError('Заполните все обязательные поля');
    return;
  }

  isLoading.value = true;

  try {
    if (!subserviceId.value) {
      throw new Error('Не удалось определить родительскую подуслугу');
    }
    const formDataToSend = new FormData();
    formDataToSend.append('image', imageFile.value as File);

      await subserviceStore.updateSubserviceType(props.typeData.id!, formDataToSend, formData.value.title.trim());
      emit('updated');
      emit('close');
  } catch (error) {
    console.error('Ошибка при редактировании типа:', error);
    notification.showError(error instanceof Error ? error.message : 'Произошла ошибка при сохранении');
  } finally {
    isLoading.value = false;
  }
};
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
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

.dialog-actions {
  display: flex;
  justify-content: space-evenly;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 0.5rem 1rem;
}
</style>
