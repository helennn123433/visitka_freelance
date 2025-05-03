<template>
  <div class="auth-model">
    <div class="auth-model__card">
      <div class="auth-model__card__title">
        <h3>Authentication</h3>
      </div>
      <div class="auth-model__card__inputs">
        <input 
          v-model="login"
          placeholder="login"
          type="text"
          class="input"
        >
        <input
          v-model="password"
          type="password"
          placeholder="password" 
          class="input"
        >
      </div>
      <div class="auth-model__card__btns">
        <MyButton 
          class="btn"
          @click="authStore.changeAdminModel"
        >
          BACK
        </MyButton>
        <MyButton
          class="btn"
          @click="checkAuth"
        >
          LOG IN
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyButton from "@/components/ui/MyButton.vue";
import {useAuthStore} from "@/store/authStore";
import { ref } from "vue";

const authStore = useAuthStore()
let login = ref<string>("");
let password = ref<string>("");

//TODO может Логику if лучше потом вынести в стор
const checkAuth = () => {
  if(login.value === "admin" || password.value === "admin") {
    authStore.login({login: login.value, password: password.value})
    authStore.changeAdminModel();
  }
}

</script>

<style lang="scss" scoped>
.auth-model{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  &__card{
    display: flex;
    flex-direction: column;
    width: 20%;
    height: 30%;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 10px;

    &__title{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    &__btns{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
}

.input{
  width: 70%;
  height: 100%;
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  background-color: white;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.btn{
  height: 30%;
  width: 40%;
}
</style>