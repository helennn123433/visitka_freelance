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
    <FormInput
      v-model="form.image"
      label="Изображение"
      placeholder="URL изображения"
      :error="errors.image"
    />
  </FormDialog>

  <NotificationComp
    v-if="showNotification"
    :visible="showNotification"
    :error-message="notificationMessage"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useServiceStore } from '@entities/service';
import { FormDialog, FormInput } from '@shared/ui/dialog';
import { NotificationComp } from '@shared/ui/notification';
import { required, positiveNumber, isUrl, validateForm as validateFormUtil } from '@shared/lib';

const serviceStore = useServiceStore();

const isOpen = ref(true);
const isLoading = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');

const form = reactive({
  title: '',
  price: 0,
  image: ''
});

const errors = reactive({
  title: '',
  price: '',
  image: ''
});

const emit = defineEmits<{
  'toggle-dialog': [];
  'service-added': [];
  success: [];
  error: [message: string];
}>();

const validateForm = (): boolean => {
  const { isValid, errors: validationErrors } = validateFormUtil(
    { title: form.title, price: form.price, image: form.image },
    {
      title: [required('Название услуги обязательно')],
      price: [positiveNumber('Цена должна быть положительным числом')],
      image: [isUrl('Некорректный URL изображения')]
    }
  );

  errors.title = validationErrors.title || '';
  errors.price = validationErrors.price || '';
  errors.image = validationErrors.image || '';

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await serviceStore.addService({
      title: form.title,
      price: Number(form.price),
      image: form.image
    });

    emit('service-added');
    emit('success');
    handleClose();
  } catch (err: unknown) {
    console.error('Ошибка добавления услуги:', err);
    const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка';
    notificationMessage.value = errorMsg;
    showNotification.value = true;
    emit('error', errorMsg);
  } finally {
    isLoading.value = false;
  }
};

const handleClose = () => {
  form.title = '';
  form.price = 0;
  form.image = '';
  errors.title = '';
  errors.price = '';
  errors.image = '';
  emit('toggle-dialog');
};
</script>
