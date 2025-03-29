<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.btn {
  font-family: 'Inter_normal', sans-serif;
  border-radius: 32px;
  background-color: #0652ff;
  border: none;
  color: #ffffff;
  padding: 14.5px 85.6px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #082f8b;
}
</style>
