<template>
  <button class="about__us__btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.about__us__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25vh;
  font-family: 'Inter_normal', sans-serif;
  border-radius: 32px;
  background-color: #0652ff;
  border: none;
  color: #ffffff;
  font-size: 16px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #082f8b;
}
</style>
