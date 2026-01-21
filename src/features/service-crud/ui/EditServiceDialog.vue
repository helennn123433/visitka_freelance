<template>
  <FormDialog
    v-model="isOpen"
    title="Редактирование услуги"
    submit-text="Сохранить"
    cancel-text="Отмена"
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
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Service } from '@entities/service';
import { FormDialog, FormInput } from '@shared/ui/dialog';
import { required, positiveNumber, isUrl, validateForm } from '@shared/lib';

const props = defineProps<{
  currentData: Service;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: Service];
}>();

const isOpen = ref(true);

const form = reactive({
  title: props.currentData.title,
  price: props.currentData.price,
  image: props.currentData.image
});

const errors = reactive({
  title: '',
  price: '',
  image: ''
});

watch(() => props.currentData, (newVal) => {
  form.title = newVal.title;
  form.price = newVal.price;
  form.image = newVal.image;
});

const validate = (): boolean => {
  const { isValid, errors: validationErrors } = validateForm(
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

const handleSubmit = () => {
  if (!validate()) return;

  emit('save', {
    ...props.currentData,
    title: form.title,
    price: Number(form.price),
    image: form.image
  });
};

const handleClose = () => {
  emit('close');
};
</script>
