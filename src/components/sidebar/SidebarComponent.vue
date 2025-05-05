<template>
  <div class="main">
    <div class="sidebar__main">
      <div>
        <!-- Логотип -->
        <div class="sidebar__logo">
          <div class="logo__main">
            <img class="img_n31" src="./images/H31.svg" alt="Logo_H31" />
          </div>

          <button class="close-btn" @click="$emit('close')">×</button>
        </div>
        

        <!--<div class="sidebar_btns">-->
          <!-- Кнопка "О нас" -->
          <button
            class="btn"
            :class="{ active: activeIcon === 'info' }"
            @click="toggle('info')"
          >
            <img 
              class="img_plz" 
              src="./images/info.svg" 
              alt="info" 
              :class="{ active: activeIcon === 'info' }"
            />
            <span class="btn-text">О нас</span>
          </button>

          <!-- Кнопка "Услуги" -->
          <button
            class="btn"
            :class="{ active: activeIcon === 'list' }"
            @click="toggle('list')"
          >
            <img 
              class="img_plz" 
              src="./images/list.svg" 
              alt="list" 
              :class="{ active: activeIcon === 'list' }"
            />
            <span class="btn-text">Услуги</span>
          </button>

          <!-- Кнопка "Контакты" -->
          <button
            class="btn"
            :class="{ active: activeIcon === 'email' }"
            @click="toggle('email')"
          >
            <img 
              class="img_plz" 
              src="./images/email.svg" 
              alt="email" 
              :class="{ active: activeIcon === 'email' }"
            />
            <span class="btn-text">Контакты</span>
          </button>
        <!--</div>-->

        </div>
        
      <!-- Нижняя кнопка со скидкой -->
      <div class="btn_bottom">
        <MyButton class="btn_discount">
          <img class="img_discount" src="./images/light.svg" alt="light" />
          <span>Получить скидку <b>25%</b></span>
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import MyButton from '@/components/ui/MyButton.vue'

const props = defineProps<{ activeIcon: string }>()

const activeIcon = toRef(props, 'activeIcon')

const emit = defineEmits(['icon-click', 'close'] as const)

function toggle(section: string) {
  emit('icon-click', section)
}
</script>

<style scoped>
.main {
  display: flex;
  margin: 1.5vw 1.5vw 0 1.5vw;
  font-family: 'Inter', sans-serif;
}

.logo__main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh 2vh 2vh 2vh;
  margin-top: 1vh;
}

.sidebar__logo{
  display: flex;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #898989;
  cursor: pointer;
  z-index: 1001;
}

@media (min-width: 768px) {
  .close-btn {
    display: none; /* убираем крестик на компе */
  }
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
  border-radius: 3vw;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
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

.btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
}

.btn.active {
  color: black;
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
  display: flex;
  justify-content: center;
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

  .sidebar__main{
    width: 100% !important;
    height: 99vh;
    max-width: 100% !important;
    min-width: 300px;
    border-radius: 0 3vw 3vw;
  }

  .sidebar{
    min-width: 300px;
  }

  .main{
    margin: 0vw 1.5vw 0 0vw;
  }
}

@media (max-width: 480px) {
  .img_plz {
    /*display: none;*/
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
    /*display: none;*/
  }

  .img_plz {
    /*display: flex;
    margin-right: 0;*/
  }

  .btn {
    /*justify-content: center;*/
  }
}
</style>
