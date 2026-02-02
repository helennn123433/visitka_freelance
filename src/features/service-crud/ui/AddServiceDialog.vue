<template>
  <FormDialog
    v-model="isOpen"
    title="Добавить новую услугу"
    submit-text="Добавить"
    cancel-text="Назад"
    :loading="isLoading"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <FormInput
      v-model="form.title"
      label="Название"
      placeholder="Введите название услуги"
      required
      :error="errors.title"
    />
    <FormInput
      v-model="form.price"
      label="Цена"
      type="number"
      placeholder="Введите цену"
      :min="1"
      required
      :error="errors.price"
    />
    <FileInput
      v-model="image"
      required
      placeholder="Нажмите, чтобы загрузить фото"
    />
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useServiceStore } from '@entities/service';
import { FormDialog, FileInput, FormInput } from '@shared/ui/dialog';
import { required, positiveNumber, validateForm as validateFormUtil } from '@shared/lib';

const serviceStore = useServiceStore();

const isOpen = ref(true);
const isLoading = ref(false);
const image = ref<File | null>(null);

const form = reactive({
  title: '',
  price: 0,
});

const errors = reactive({
  title: '',
  price: '',
});

const emit = defineEmits<{
  'toggle-dialog': [];
  'service-added': [];
  success: [];
  error: [message: string];
}>();

const validateForm = (): boolean => {
  const { isValid, errors: validationErrors } = validateFormUtil(
    { title: form.title, price: form.price },
    {
      title: [required('Название услуги обязательно')],
      price: [positiveNumber('Цена должна быть положительным числом')]
    }
  );

  errors.title = validationErrors.title || '';
  errors.price = validationErrors.price || '';

  if (!image.value) {
    return false;
  }

  return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('image', image.value as File);

    await serviceStore.addService({
      formData,
      params: {
        title: form.title,
        price: form.price,
      },
    });
    emit('service-added');
    emit('success');
    handleClose();
  } catch (err: unknown) {
    console.error('Ошибка добавления услуги:', err);
    const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка';
    emit('error', errorMsg);
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  form.title = '';
  form.price = 0;
  image.value = null;
  errors.title = '';
  errors.price = '';
  emit('toggle-dialog');
};
</script>
