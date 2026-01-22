<template>
  <div class="form-input">
    <label
      v-if="label"
      :for="inputId"
      class="form-input__label"
    >
      {{ label }}
      <span
        v-if="required"
        class="form-input__required"
      >*</span>
    </label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      class="form-input__field"
      :class="{ 'form-input__field--error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span
      v-if="error"
      class="form-input__error"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FormInputProps } from '@shared/types';

const props = withDefaults(defineProps<FormInputProps>(), {
  label: '',
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  error: '',
  min: undefined,
  max: undefined
});

defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const inputId = computed(() => `input-${props.label?.toLowerCase().replace(/\s/g, '-')}-${Math.random().toString(36).slice(2, 9)}`);
</script>

<style lang="scss" scoped>
.form-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    text-align: left;
  }

  &__required {
    color: #ff4444;
  }

  &__field {
    width: 100%;
    padding: 10px 12px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #0652ff;
      box-shadow: 0 0 0 3px rgba(6, 82, 255, 0.1);
    }

    &--error {
      border-color: #ff4444;

      &:focus {
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
      }
    }

    &::placeholder {
      color: #999;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  &__error {
    font-size: 0.75rem;
    color: #ff4444;
    text-align: left;
  }
}
</style>
