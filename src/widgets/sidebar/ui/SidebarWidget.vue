<template>
  <div class="main">
    <div class="sidebar__main">
      <div>
        <div class="sidebar__logo">
          <div class="logo__main">
            <img 
              class="img_n31" 
              :src="Icons.H31" 
              alt="Logo_H31"
            >
          </div>
          <button 
            class="close-btn" 
            @click="$emit('close')"
          >
            ×
          </button>
        </div>
        <button
          class="btn"
          :class="{ active: activeIcon === 'info' }"
          @click="toggle('info')"
        >
          <img
            class="img_plz"
            :src="Icons.Info"
            alt="info"
            :class="{ active: activeIcon === 'info' }"
          >
          <span class="btn-text">О нас</span>
        </button>
        <button
          class="btn"
          :class="{ active: activeIcon === 'list' }"
          @click="toggle('list')"
        >
          <img
            class="img_plz"
            :src="Icons.List"
            alt="list"
            :class="{ active: activeIcon === 'list' }"
          >
          <span class="btn-text">Услуги</span>
        </button>
        <button
          class="btn"
          :class="{ active: activeIcon === 'email' }"
          @click="toggle('email')"
        >
          <img
            class="img_plz"
            :src="Icons.atEmail"
            alt="email"
            :class="{ active: activeIcon === 'email' }"
          >
          <span class="btn-text">Контакты</span>
        </button>
      </div>
      <div class="btn_bottom">
        <HeaderButtons v-if="showMobileButtons" />
        <MyButton 
          class="btn_discount" 
          @click="handleDiscountClick"
        >
          <img 
            class="img_discount" 
            :src="Icons.Light" 
            alt="light"
          >
          <span>Получить скидку <b>25%</b></span>
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { MyButton } from "@shared/ui/button";
import { HeaderButtons } from "@widgets/header";
import { Icons } from "@shared/ui/icons";

const router = useRouter();

const showMobileButtons = ref(true);
const isMobile = ref(window.innerWidth < 769);

const handleResize = () => {
  isMobile.value = window.innerWidth < 769;
  showMobileButtons.value = !!isMobile.value;
};

const props = defineProps<{ activeIcon: string }>();

const activeIcon = toRef(props, "activeIcon");

const emit = defineEmits<{
  "icon-click": [section: string];
  close: [];
}>();

const toggle = async (section: string) => {
  if (router.currentRoute.value.name === "home") {
    emit("icon-click", section);
    emit("close");
    return;
  }

  await router.push({ name: "home" });

  setTimeout(() => {
    emit("icon-click", section);
    emit("close");
  }, 100);
};

const handleDiscountClick = async () => {
  if (router.currentRoute.value.name === "home") {
    emit("icon-click", "email");
    emit("close");
    return;
  }

  await router.push({ name: "home" });

  setTimeout(() => {
    emit("icon-click", "email");
    emit("close");
  }, 100);
};

onMounted(() => {
  showMobileButtons.value = !!isMobile.value;
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.main {
  display: flex;
  margin: 22px 22px 0 22px;
  font-family: "Inter", sans-serif;
}

.logo__main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  margin: 1vh 0;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 2vw;
  font-size: 1.8rem;
  background: none;
  border: none;
  color: #898989;
  cursor: pointer;
  z-index: 1001;
}

@media (min-width: 769px) {
  .close-btn {
    display: none;
  }
}

.img_n31 {
  max-width: 100%;
  height: auto;
}

@media (min-width: 1921px) {
  .img_n31 {
    width: 300px;
  }
}

.img_plz {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  margin-left: 12px;
}

.img_plz.active {
  filter: brightness(0) saturate(100%) invert(25%) sepia(99%) saturate(2476%)
    hue-rotate(214deg) brightness(100%) contrast(105%);
}

.sidebar__main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 256px;
  padding: 0 20px;
  height: 93vh;
  max-width: 30vh;
  min-width: 8vh;
  background-color: white;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  margin-top: 1vh;
}

.btn {
  width: 100%;
  display: flex;
  align-items: center;
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
  font-family: "Inter", sans-serif;
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
  padding: 10px 20px;
  background-color: #0652ff;
  border: 0 solid white;
  color: #ffffff;
  border-radius: 32px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  font-size: 16px;

  span {
    text-wrap: auto;
  }
}

.btn_discount:hover {
  background-color: #0652aa;
}

.btn_bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 0.5vh;
  gap: 1vh;
  margin: 1vh 1.3vh;
}

.img_discount {
  width: 1.5vw;
  height: 1.5vw;
  margin-right: 6px;
}

.btn {
  font-size: 21px;
  padding: 24px;
}

@media (min-width: 1921px) {
  .btn {
    font-size: 21px;
    padding: 32px 24px;
  }
  .btn-text {
    font-size: clamp(20px, 1vmax, 40px);
  }
  .img_plz {
    width: 28px;
    height: 28px;
  }

  .sidebar__main {
    width: 384px;
  }
}
@media (max-width: 1921px) {
  .btn-text {
    font-size: 20px;
  }
}
@media (max-width: 1470px) {
  .btn_discount {
    font-size: 16px;
  }
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

  .sidebar__main {
    width: 100% !important;
    height: 99vh;
    max-width: 100% !important;
    min-width: 300px;
    border-radius: 0 3vw 3vw;
  }

  .sidebar {
    min-width: 300px;
  }

  .main {
    margin: 0 1.5vw 0 0;
  }
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .main {
    margin: 0;
  }
}
</style>
