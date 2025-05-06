<template>
      <div class="header-buttons">
        <img src="@/assets/img/services/phone-icon.svg" alt="Иконка телефона" class="icon phone-icon" />
        <img src="@/assets/img/services/tg-icon.svg" alt="Иконка телеграма" class="icon" />
        <img src="@/assets/img/services/email-icon.svg" alt="Иконка почты" class="icon" />
      </div>
  </template>
  
  <script setup lang="ts" >

  </script>
  
  <style lang="scss" scoped>
  .header-buttons {
    display: flex;
    gap: 2vw;
  
    img {
      width: 2vw;
      cursor: pointer;
  
      &:hover {
        filter: brightness(0.1) invert(0.3);
      }
      &.phone-icon {  
        width: 1.7vw; 
      }
    }
  }
  </style>