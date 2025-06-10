<template>
  <div class="card">
    <div v-if="isEditing">
      <input
        v-model="editableUpper"
        @input="emitUpdate"
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
        @input="emitUpdate"
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
import { defineProps, ref } from "vue";
import { Stats } from "@/interfaces/aboutUs/Stats";

const props = defineProps<{
  stat: Stats,
  isEditing: boolean
}>()

/* eslint-disable */
const emits = defineEmits<{
  (e: 'statusUpdate', payload: Stats): void
}>()

const editableUpper =ref(props.stat.upper)
const editableLower = ref(props.stat.lower)

const emitUpdate = () => {
  emits('statusUpdate', {
    id: props.stat.id,
    upper: editableUpper.value,
    lower: editableLower.value
  })
}

</script>

<style lang="scss" scoped>
.bigText {
  font-size: clamp(2rem, 8vw, 3.75rem);
  font-weight: 700;
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
    text-align: left;
  }
  .lowText {
    font-size: 14px;
    line-height: 1.3;
    text-align: left;
  }
}
</style>
