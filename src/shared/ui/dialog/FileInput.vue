<template>
  <div class="form-file">
    <input
      ref="fileInput"
      type="file"
      class="form-file__input"
      @change="onFileChange"
    >
  </div>

  <div
    class="form-file__dropzone"
    @click="fileInput?.click()"
  >
    <span v-if="!preview">
      Выберите файл
    </span>

    <img
      v-else
      :src="preview"
      alt="Preview"
      class="form-file__preview"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  'update:modelValue': [file: File | null];
}>();

const fileInput = ref();
const preview = ref<string | null>(null);

const onFileChange = () => {
  const file = fileInput.value?.files?.[0] ?? null;

  emit('update:modelValue', file);

  if (!file) {
    preview.value = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

</script>

<style lang="scss" scoped>
.form-file {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
  }

  &__required {
    color: #ff4444;
  }

  &__input {
    display: none;
  }

  &__dropzone {
    width: 100%;
    min-height: 140px;
    border: 1px dashed #ddd;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: #999;
    transition: border-color 0.2s, background-color 0.2s;

    &:hover {
      border-color: #0652ff;
      background-color: rgba(6, 82, 255, 0.04);
    }
  }

  &__preview {
    max-width: 100%;
    max-height: 220px;
    object-fit: contain;
    border-radius: 8px;
  }
}

</style>