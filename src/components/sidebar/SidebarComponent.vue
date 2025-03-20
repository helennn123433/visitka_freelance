<template>
  <div class="main">
    <div class="sidecard__main">
      <div>
        <div class="logo__main">
          <img src="./images/H31.svg" class="img_n31" alt="Logo_H31">
        </div>
        <button class="btn" autofocus @click="toggleIcon('info')">
          <img src="./images/info.svg" class="img_plz" alt="info" :class="{ active: activeIcon === 'info' }">
          <span class="btn-text">О нас</span>
        </button>
        <button class="btn" @click="toggleIcon('list')">
          <img src="./images/list.svg" class="img_plz" alt="list" :class="{ active: activeIcon === 'list' }">
          <span class="btn-text">Услуги</span>
        </button>
        <button class="btn" @click="toggleIcon('email')">
          <img src="./images/email.svg" class="img_plz" alt="email" :class="{ active: activeIcon === 'email' }">
          <span class="btn-text">Контакты</span>
        </button>
      </div>
      <div class="btn_bottom">
        <button class="btn_discount">
          <img src="./images/light.svg" class="img_plz" alt="light">
          <span class="btn-text">
            Получить скидку <b>25%</b>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeIcon = ref<string | null>(null);

const toggleIcon = (iconName: string) => {
  activeIcon.value = activeIcon.value === iconName ? null : iconName;
};
</script>

<style>
.main {
  display: flex;
  flex-direction: row;
  background-color: #EFF0F2;
}

.logo__main {
  padding: 1vh;
}
.img_n31 {
  max-width: 100%;
  height: auto;
}

.img_plz {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  transition: filter 0.3s ease;
}

.img_plz.active {
  filter: brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(2476%) hue-rotate(214deg) brightness(100%) contrast(105%);
}

.sidecard__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80vh;
  width: 20vh;
  max-width: 20%;
  min-width: 20%;
  max-height: 80%;
  background-color: white;
  border-radius: 32px;
  margin: 20px;
}

.btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1vh;
  background-color: white;
  border: 0 solid white;
  color: #898989;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}
.btn:hover {
  background-color: #EFF0F2;
  border: 0 solid white;
  color: black;
}

.btn:focus{
  background-color: #EFF0F2;
  border: 0 solid white;
  color: black;
}

.btn_discount {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1vh;
  background-color: #0652FF;
  border: 0 solid white;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}
.btn_discount:hover {
  background-color: #0652AA;
}

.btn_bottom {
  padding: 1vh;
}

.img_plz {
  width: 30px;
  height: 30px;
  margin-right: 12px;
}

.btn {
  font-size: 21px;
  padding: 1vh;
}

.btn_discount {
  font-size: 21px;
}

@media (max-width: 1440px) {
  .img_plz{
    width: 30px;
    height: 30px;
    margin-right: 12px;
  }
  .btn {
    font-size: 21px;
    padding: 1vh;
  }
}

@media (max-width: 768px) {
  .img_plz {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }

  .btn {
    font-size: 14px;
    font-family: Inter,sans-serif;
    padding: 0.8vh;
  }

  .btn_discount {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .img_plz {
    display: none;
  }

  .btn {
    font-size: 12px;
    font-family: Inter,sans-serif;
    padding: 0.6vh;
  }

  .btn_discount {
    font-size: 12px;
  }
}

@media (max-width: 375px) {
  .btn-text {
    display: none;
  }

  .img_plz {
    display: flex;
    font-family: Inter,sans-serif;
    margin-right: 0;
  }

  .btn {
    justify-content: center;
  }
}
</style>