<template>
  <div class="main">
    <div class="sidebar__main">
      <div>
        <div class="logo__main">
          <img class="img_n31" src="./images/H31.svg" alt="Logo_H31" />
        </div>
        <button class="btn" @click="toggleIcon('info')">
          <img
            class="img_plz"
            src="./images/info.svg"
            alt="info"
            :class="{ active: activeIcon === 'info' }"
          />
          <span class="btn-text">О нас</span>
        </button>
        <button class="btn" @click="toggleIcon('list')">
          <img
            class="img_plz"
            src="./images/list.svg"
            alt="list"
            :class="{ active: activeIcon === 'list' }"
          />
          <span class="btn-text">Услуги</span>
        </button>
        <button class="btn" @click="toggleIcon('email')">
          <img
            class="img_plz"
            src="./images/email.svg"
            alt="email"
            :class="{ active: activeIcon === 'email' }"
          />
          <span class="btn-text">Контакты</span>
        </button>
      </div>
      <div class="btn_bottom">
        <button class="btn_discount">
          <img class="img_discount" src="./images/light.svg" alt="light" />
          <span class="btn-text"> Получить скидку <b>25%</b> </span>
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
  margin: 1.5vw 1.5vw 0 1.5vw;
}

.logo__main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 2vh 2vh 2vh;
  margin-top: 1vh;
}
.img_n31 {
  max-width: 100%;
  height: auto;
}

.img_plz.active {
  filter: brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(2476%)
    hue-rotate(214deg) brightness(100%) contrast(105%);
}

.sidebar__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30vw;
  height: 93vh;
  max-width: 30vh;
  min-width: 8vh;
  background-color: white;
  border-radius: 32px;
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
  background-color: #eff0f2;
  border: 0 solid white;
  color: black;
}

.btn:focus {
  background-color: #eff0f2;
  border: 0 solid white;
  color: black;
}

.btn-text {
  font-size: 18px;
}

.btn_discount {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1.2vh 0 1.2vh 0;
  background-color: #0652ff;
  border: 0 solid white;
  color: #ffffff;
  font-size: 16px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
}
.btn_discount:hover {
  background-color: #0652aa;
}

.btn_bottom {
  padding: 1vh;
}

.img_plz {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  margin-left: 12px;
}

.img_discount {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}

.btn {
  font-size: 21px;
  padding: 1.5vh;
}

.btn_discount {
  font-size: 1vw;
}

@media (max-width: 1440px) {
  .img_plz {
    width: 30px;
    height: 30px;
    margin-right: 12px;
  }
  .btn {
    font-size: 15px;
    padding: 0.9vh;
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
    margin-right: 0;
  }

  .btn {
    justify-content: center;
  }
}
</style>
