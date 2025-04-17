<template>
    <div class="header">
      <SearchComp />
      <div class="header-buttons">
        <img src="@/assets/img/services/phone-icon.svg" alt="Иконка телефона" class="icon" />
        <img src="@/assets/img/services/tg-icon.svg" alt="Иконка телеграма" class="icon" />
        <img src="@/assets/img/services/email-icon.svg" alt="Иконка почты" class="icon" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts" >
  import SearchComp from "@/components/services/SearchComp.vue"
  </script>
  
  <style lang="scss" scoped>
  .header{
    width:100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1vw;
    padding-left: 0.7vw;
  }
  
  .header-buttons {
    display: flex;
    gap: 2vw;
  
    img {
      width: 2vw;
      cursor: pointer;
  
      &:hover {
        filter: brightness(0.1) invert(0.3);
      }
    }
  }
  </style>