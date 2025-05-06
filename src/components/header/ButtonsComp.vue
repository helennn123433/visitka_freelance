<template>
      <div class="header-buttons">
        <img
          :src="Icons.Account"
          alt="Иконка телефона"
          class="icon account-icon"
          @click="authStore.changeAdminModel"
        >
        <img
          :src="Icons.Phone"
          alt="Иконка телефона"
          class="icon phone-icon"
        >
        <img
          :src="Icons.Telegram"
          alt="Иконка телеграма"
          class="icon"
        >
        <img
          :src="Icons.Email"
          alt="Иконка почты"
          class="icon"
        >
      </div>
  </template>
  
  <script setup lang="ts" >
    import { Icons } from "@/assets/img/Icons";
    import {useAuthStore} from "@/store/authStore";
    const authStore = useAuthStore()
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

  @media (max-width: 768px) {
    .header-buttons {
        gap: 10vw;
        img {
            width: 25px;
            &.phone-icon {  
              width: 20px; 
            }
        }
    }
  }
  </style>