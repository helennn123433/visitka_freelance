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
  color: #ffffff;
  width: 30vw;
  font-size: 16px;
  font-weight: 500;
  height: 5vh;
  padding-right: 6px;
  padding-left: 6px;
}

.btn:hover {
  background-color: #082f8b;
}
</style>
