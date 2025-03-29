<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.btn {
  border-radius: 32px;
  background-color: #0652ff;
  border-color: #0652ff;
  color: #ffffff;
  width: clamp(200px, 40vw, 400px);
  height: clamp(45px, 6vh, 60px);
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 500;
  padding-right: 6px;
  padding-left: 6px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.btn:hover {
  background-color: #082f8b;
}
</style>
