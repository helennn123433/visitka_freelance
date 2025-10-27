<template>
  <div class="card">
    <div v-if="isEditing">
      <input
        v-model="editableUpper"
        class="edit-input"
        @blur="updateUpper"
      >
    </div>
    <div
      v-else
      class="bigText"
    >
      {{ props.stat.upper }}
    </div>
    <div v-if="isEditing">
      <input
        v-model="editableLower"
        class="edit-input"
        @blur="updateLower"
      >
    </div>
    <div
      v-else
      class="lowText"
    >
      {{ props.stat.lower }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import apiClient from '@/network/connection';
import { Stats } from "@/interfaces/aboutUs/Stats";

const props = defineProps<{
  stat: Stats,
  isEditing: boolean
}>()

/* eslint-disable */
const emits = defineEmits<{
  (e: 'statusUpdate', payload: Stats): void
}>()

const editableUpper = ref(props.stat.upper)
const editableLower = ref(props.stat.lower)

watch(() => props.stat, (newStat) => {
  editableUpper.value = newStat.upper
  editableLower.value = newStat.lower
}, { deep: true })

const updateUpper = async () => {
  try {
    const upperValue = editableUpper.value === null ? "" : editableUpper.value;
    
    const response = await apiClient.patch(`/AboutUs/${props.stat.id}/upper`, {
      value: upperValue
    });

    
    emits('statusUpdate', {
      id: props.stat.id,
      upper: upperValue,
      lower: editableLower.value
    });
    
  } catch (error: any) {
    if (error.response) {
      console.error('Данные ошибки:', error.response.data);
    }
    editableUpper.value = props.stat.upper;
  }
}

const updateLower = async () => {
  try {
    const response = await apiClient.patch(`/AboutUs/${props.stat.id}/lower`, {
      value: editableLower.value
    });
    
    emits('statusUpdate', {
      id: props.stat.id,
      upper: editableUpper.value,
      lower: editableLower.value
    });
    
  } catch (error: any) {
    if (error.response) {
      console.error('Данные ошибки:', error.response.data);
    }
    editableLower.value = props.stat.lower;
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bigText {
  font-size: clamp(2rem, 8vw, 3.75rem);
  font-weight: 700;
  text-align: center;
}

.lowText {
  font-size: clamp(0.75rem, 2.5vw, 0.875rem);
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
}
.adminCard {
  display: flex;
  justify-content: end;
  width: 80%;
}

@media (max-width: 480px) {
  .bigText {
    font-size: 36px;
    text-align: center;
  }
  
  .lowText {
    font-size: 14px;
    line-height: 1.3;
    text-align: center;
  }
  
  .edit-input {
    max-width: 120px;
    padding: 6px;
  }
}
</style>