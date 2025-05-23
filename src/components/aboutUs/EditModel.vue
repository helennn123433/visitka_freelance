<template>
  <div class="auth-model">
    <div class="auth-model__card">
      <div class="auth-model__card__title">
        <h3>Редактирование</h3>
      </div>
      <div class="auth-model__card__inputs">
        <input
          placeholder="логин"
          type="text"
          class="input"
        >
        <input
          type="password"
          placeholder="пароль"
          class="input"
        >
      </div>
      <div class="auth-model__card__btns">
        <MyButton class="btn">
          Назад
        </MyButton>
        <MyButton class="btn">
          Вход
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MyButton from "@/components/ui/MyButton.vue";
</script>

<style lang="scss" scoped>
.auth-model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;

  &__card {
    display: flex;
    flex-direction: column;
    width: 20%;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 10px;

    &__title {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    &__btns {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}

.input {
  width: 70%;
  height: 100%;
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.btn {
  height: 30%;
  width: 40%;
  padding: 5px;
}

@media screen and (max-width: 767px) {
  .auth-model {
    &__card {
      width: 40%;
    }
  }
}

@media screen and (max-width: 425px) {
  .auth-model {
    &__card {
      width: 50%;
    }
  }
}
</style>