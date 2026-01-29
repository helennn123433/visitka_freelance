<template>
  <div class="card">
    <div v-if="isEditing">
      <input
        v-model="editableUpper"
        class="edit-input"
        @blur="updateStat"
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
        @blur="updateStat"
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
import { ref, watch } from 'vue';
import type { Stats } from '@entities/stats';

const props = defineProps<{
  stat: Stats;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  'status-update': [payload: Stats];
}>();

const editableUpper = ref(props.stat.upper);
const editableLower = ref(props.stat.lower);

watch(() => props.stat, (newStat) => {
  editableUpper.value = newStat.upper;
  editableLower.value = newStat.lower;
}, { deep: true });

const updateStat = async () => {
  try {
    const statData = {
      id: props.stat.id,
      upper: editableUpper.value || '',
      lower: editableLower.value || ''
    };

    emit('status-update', statData);
  } catch (error) {
    console.error('Ошибка обновления статистики:', error);
    editableUpper.value = props.stat.upper || '';
    editableLower.value = props.stat.lower || '';
  }
};
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
