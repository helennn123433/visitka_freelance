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
    <FileInput v-model="form.image" />
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Service } from '@entities/service';
import { FormDialog, FormInput, FileInput } from '@shared/ui/dialog';
import { required, positiveNumber, validateForm } from '@shared/lib';

const props = defineProps<{
  currentData: Service;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: Service & { imageFile?: File | null }];
}>();

const isOpen = ref(true);

const form = reactive<{
  title: string;
  price: number;
  image: File | null;
}>({
  title: props.currentData.title,
  price: props.currentData.price,
  image: null
});


const errors = reactive({
  title: '',
  price: ''
});

watch(() => props.currentData, (newVal) => {
  form.title = newVal.title;
  form.price = newVal.price;
  form.image = null;
});

const validate = (): boolean => {
  const { isValid, errors: validationErrors } = validateForm(
    { title: form.title, price: form.price, image: form.image },
    {
      title: [required('Название услуги обязательно')],
      price: [positiveNumber('Цена должна быть положительным числом')],
    }
  );

  errors.title = validationErrors.title || '';
  errors.price = validationErrors.price || '';

  return isValid;
};

const handleSubmit = () => {
  if (!validate()) return;

  emit('save', {
    ...props.currentData,
    title: form.title,
    price: Number(form.price),
    imageFile: form.image
  });
};

const handleClose = () => {
  emit('close');
};
</script>
