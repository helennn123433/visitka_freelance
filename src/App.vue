<template>
  <AuthModel v-if="authStore.openAdmin" />
  <div class="main__app">
    <SidebarComponent
      ref="sidebar"
      :active-icon="activeSection"
      class="sidebar"
      :class="{ 
        'mobile-open': isMobile && isOpen,
        'mobile-hidden': isMobile && !isOpen 
      }"
      @icon-click="scrollToSection"
      @close="closeSidebar"
    />

    <!-- Размытие фона -->
    <div
      v-if="isMobile && isOpen"
      class="overlay"
      @click="closeSidebar"
    />

    <div
      ref="wrapper"
      class="all__content"
    >
      <section
        id="heder"
        class="section"
      >
        <!-- Хедер для телефонного размера -->
        <header class="mobile-header">
          <button
            class="burger-btn"
            @click="toggleSidebar"
          >
            &#9776;
          </button>
          <!-- Логотип -->
          <div class="logo__main">
            <img
              class="img_n31"
              src="@/assets/img/icons/H31.svg"
              alt="Logo_H31"
            >
          </div>
        </header>
        <HeaderComp />
        <router-view
          v-slot="{ Component }"
        >
          <component
            :is="Component"
            ref="homePage"
            @section-change="handleSectionChange"
          />
        </router-view>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "@/store/authStore";
import SidebarComponent from '@/components/sidebar/SidebarComponent.vue'
import AuthModel from "@/components/authModel/AuthModel.vue";
import HeaderComp from '@/components/header/HeaderComp.vue'

const authStore = useAuthStore()
const homePage = ref()

const isOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const activeSection = ref('info')

const handleSectionChange = (sectionId: string) => {
  activeSection.value = sectionId
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isOpen.value = false
  }
}

const scrollToSection = (id: string) => {
  activeSection.value = id
  homePage.value?.scrollToSection(id)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  isOpen,
  toggleSidebar,
  closeSidebar
})
</script>

<style lang="scss" scoped>
@use './styles/colors.scss';

.main__app {
  display: flex;
  height: 100vh;
  background-color: #eff0f2;
  overflow: hidden;
}

.section {
  margin: 1.4vw 1.5vw 0 1.5vw;
  box-sizing: border-box;
  scroll-margin-top: 5vh;
}

.section#heder {
  display: flex;
  flex-direction: column;
  padding: 1.3vw;
  border: 2px solid #eff0f2;
  border-radius: 3vw;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  max-height: 93vh;
  background: white;
}

.sidebar {
  transition: transform 0.3s ease;
  z-index: 1000;
}

.all__content{
  display: flex;
  flex:1;
  height: 100%;
}

/* Хедер только для мобилки */
.mobile-header {
  display: flex;
  align-items: center;
  color: white;
  padding: 1rem;
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

.burger-btn {
  position: relative;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: colors.$blue;
  cursor: pointer;
}

.logo__main {
  margin: 0 auto;
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    transform: translateX(-130%);
    width: 70vw !important;
    max-width: 70vw !important;
  }

  .sidebar__main {
    width: 100% !important;
    max-width: 100% !important;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.mobile-hidden {
    transform: translateX(-130%);
  }
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  z-index: 999;
}

@media screen and (max-width: 1024px) and (min-width: 769px) {
  .sidebar {
    padding: 1.5vw;
  }
}
</style>