<template>
  <div class="card">
    <div class="bigText">
      {{ upper }}
    </div>
    <div class="lowText">
      {{ lower }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  upper: { type: [String, Number], required: true },
  lower: { type: String, required: true }
});
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
