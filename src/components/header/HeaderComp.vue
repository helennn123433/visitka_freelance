<template>
  <div class="header_container">
    <div class="header">
      <SearchComp />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchComp from '@/components/header/SearchComp.vue'
import { Icons } from "@/assets/img/Icons";
import {useAuthStore} from "@/store/authStore";

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
@import '../../styles/colors.scss';

.header_container {
  position: sticky;
  top: 1.5vw;
  z-index: 800;
  padding: 1vw 2vw 1vw 1vw;
  margin: 1.5vw 1.5vw 0 0.5vw;
  border: 2px solid #eff0f2;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  background: white;
  transition: background-color 0.3s ease;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    &.phone-icon {
      width: 1.7vw;
    }
    &.account-icon {
      width: 2.5vw;
    }
  }
}
</style>
