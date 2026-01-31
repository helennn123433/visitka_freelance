<template>
  <div
    class="dialog-overlay"
    @click.self="handleClose"
  >
    <div class="dialog">
      <h3>{{ dialogTitle }}</h3>

      <div
        v-if="mode === 'create-subservice'"
        class="form-section"
      >
        <div class="form-group">
          <label>Создание новой подуслуги для сервиса:
            <strong>{{ serviceId }}</strong>
          </label>
        </div>
        <div class="info-text">
          <p>Подуслуга будет создана с указанными ниже типами</p>
        </div>
      </div>

      <div class="types-section">
        <div class="section-header">
          <h4>{{ typesTitle }}</h4>
          <MyButton
            v-if="mode === 'create-subservice'"
            type="button"
            class="add-type-btn"
            @click="addTypeField"
          >
            + Добавить тип
          </MyButton>
        </div>

        <div
          v-for="(type, index) in typesData"
          :key="index"
          class="type-row"
        >
          <div class="type-fields">
            <div class="form-group">
              <label>Название типа {{ index + 1 }}:</label>
              <input
                v-model="type.title"
                required
                placeholder="Введите название типа"
                :class="{ 'error': !type.title && showValidation }"
              >
              <span
                v-if="!type.title && showValidation"
                class="error-message"
              >
                Обязательное поле
              </span>
            </div>
            <div class="form-group">
              <FileInput v-model="type.image" />
              <span
                v-if="!type.image && showValidation"
                class="error-message"
              >
                Обязательное поле
              </span>
            </div>
          </div>

          <div class="type-actions">
            <button
              v-if="typesData.length > 1"
              type="button"
              class="remove-btn"
              title="Удалить тип"
              @click="removeTypeField(index)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <MyButton
          type="button"
          class="go_back_btn"
          @click="handleClose"
        >
          Отмена
        </MyButton>
        <MyButton
          type="submit"
          :disabled="isLoading"
          class="conf_btn"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSubserviceStore, type Subservice } from '@entities/subservice';
import { FileInput } from '@shared/ui/dialog';
import { MyButton } from '@shared/ui/button';

interface TypeFormData {
  title: string;
  image: File | null;
  serviceId: string;
}

interface Props {
  serviceId: string;
  subserviceId?: string;
  mode: 'create-subservice' | 'add-types';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [subservice: Subservice];
  added: [];
}>();

const subserviceStore = useSubserviceStore();

const typesData = ref<TypeFormData[]>([
  {
    title: '',
    image: null,
    serviceId: props.serviceId
  }
]);

const isLoading = ref(false);
const showValidation = ref(false);

const dialogTitle = computed(() => {
  return props.mode === 'create-subservice'
    ? 'Создать подуслугу'
    : 'Добавить тип в подуслугу';
});

const typesTitle = computed(() => {
  return props.mode === 'create-subservice'
    ? 'Добавьте типы (минимум один)'
    : 'Новый тип';
});

const submitButtonText = computed(() => {
  if (isLoading.value) {
    return props.mode === 'create-subservice' ? 'Создание...' : 'Добавление...';
  }
  return props.mode === 'create-subservice' ? 'Создать подуслугу' : 'Добавить тип';
});

const addTypeField = () => {
  typesData.value.push({
    title: '',
    image: null,
    serviceId: props.serviceId
  });
};

const removeTypeField = (index: number) => {
  if (typesData.value.length > 1) {
    typesData.value.splice(index, 1);
  }
};

const handleClose = () => {
  emit('close');
};

const validateForm = (): boolean => {
  showValidation.value = true;

  const isValid = typesData.value.every(type =>
    type.title.trim() !== '' &&
    type.serviceId.trim() !== ''
  );

  return isValid;
};

const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return;
    }

    isLoading.value = true;
    
    if (props.mode === 'create-subservice') {
      const subservice = await createSubserviceWithTypes();
      emit('created', subservice);
    } else {
      if (!props.subserviceId) {
        throw new Error('ID подуслуги не указан');
      }

      await addTypesToSubservice();
      emit('added');
    }

    emit('close');
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error instanceof Error ? error.message : 'Произошла ошибка');
  } finally {
    isLoading.value = false;
    showValidation.value = false;
  }
};

const createSubserviceWithTypes = async (): Promise<Subservice> => {
  try {
    const typesToAdd = typesData.value;

    const subservice = await subserviceStore.addSubservice({
      types: typesToAdd
    });

    return subservice;
  } catch (error) {
    console.error('Ошибка в createSubserviceWithTypes:', error);
    throw error;
  }
};

const addTypesToSubservice = async () => {
  if (!props.subserviceId) {
    throw new Error('ID подуслуги не указан');
  }

  for (const type of typesData.value) {
    try {
      await subserviceStore.addSubserviceType(props.subserviceId, {
        title: type.title,
        image: type.image,
        serviceId: type.serviceId
      });
    } catch (error) {
      console.error('Ошибка при добавлении типа:', error);
      throw error;
    }
  }
};

watch(() => props.serviceId, (newId) => {
  typesData.value = typesData.value.map(type => ({
    ...type,
    serviceId: newId
  }));
}, { immediate: true });

watch(typesData, () => {
  if (showValidation.value) {
    showValidation.value = false;
  }
}, { deep: true });

</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 80%;
  max-width: 650px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
@media (min-width: 768px) {
  .dialog {
    width: 70vw;
    padding: 32px;
  }
}

@media (min-width: 1200px) {
  .dialog {
    width: 500px;
  }
}
.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.types-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.info-text {
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  color: #0066cc;
}

.type-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.type-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-actions {
  display: flex;
  align-items: flex-start;
}

.remove-btn {
  width: 1.5vw;
  height: 1.5vw;
  border: none;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background: #ff5252;
}

.add-type-btn {
  margin: 0;
  padding: 1.2vh;
}

.conf_btn {
  padding: 0.5rem 1rem;
}

.go_back_btn {
  padding: 0.5rem 1rem;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 95%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #ff6b6b;
}

.form-group input.error:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.25);
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.disabled-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #666;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>
