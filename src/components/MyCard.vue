<template>
  <div>
    <div class="bigText"><slot name="upper"></slot></div>
    <div class="lowText"><slot name="lower"></slot></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.bigText {
  font-size: 60px;
  font-weight: 700;
}
.lowText {
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0;
}
</style>
