<template>
  <AuthModel v-if="authStore.openAdmin" />
  <div
    class="main__app"
  >
    <SidebarComponent
      :activeIcon="activeSection"
      class="sidebar"
      :class="{ 
        'mobile-open': isMobile && isOpen,
        'mobile-hidden': isMobile && !isOpen 
      }"
      @icon-click="scrollToSection"
      @close="closeSidebar"
    />

    <!--Размытие фона-->
    <div
      v-if="isMobile && isOpen"
      class="overlay"
      @click="closeSidebar"
    ></div>

    <!-- В этом контейнере все «полноэкранные» разделы -->
    <div class="all__staff" ref="wrapper">
      <section id="info" class="section">
        <!-- Хедер для телефонного размера -->
        <header class="mobile-header">
          <button @click="toggleSidebar" class="burger-btn">
            &#9776;
          </button>
          <!-- Логотип -->
          <div class="logo__main">
            <img class="img_n31" src="@/assets/img/icons/H31.svg" alt="Logo_H31" />
          </div>
        </header>
        <header-comp />
        <AboutUs />
      </section>
      <section
        id="list"
        class="section"
      >
        <HomeView />
      </section>
      <section
        id="email"
        class="section"
      >
        <ContactsSection />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "@/store/authStore";
import SidebarComponent from '@/components/sidebar/SidebarComponent.vue'
import AboutUs from '@/components/aboutUs/AboutUs.vue'
import HomeView from '@/components/services/HomeView.vue'
import HeaderComp from '@/components/header/HeaderComp.vue'
import ContactsSection from '@/components/contacts/ContactsSection.vue'
import AuthModel from "@/components/AuthModel/AuthModel.vue";

const authStore = useAuthStore()

const sectionIds = ['info', 'list', 'email'] as const
const activeSection = ref<string>(sectionIds[0])
const wrapper = ref<HTMLElement>()

const isOpen = ref(false)//
const isMobile = ref(window.innerWidth < 768)//

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isOpen.value = false // скрываем overlay
  }
}

function scrollToSection(id: string) {
  activeSection.value = id
  console.log('Setting activeSection to:', id)
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    {
      root: null, // Следим за viewport
      rootMargin: '0px',
      threshold: 0.5,
    },
  )
  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@import './styles/colors.scss';
.main__app {
  display: flex;
  height: 100vh;
  background-color: #eff0f2;
  /*transition: margin-left 0.3s ease; */
}

@media (min-width: 768px) {
  /*.main-content {
    margin-left: 250px;
  }*/
}

.sidebar {
  transition: transform 0.3s ease;
  z-index: 1000;
}

.all__staff {
  flex: 1;
  overflow-y: auto;
}

.section {
  min-height: 100vh;
  margin: 1.5vw 1.5vw 0 1.5vw;
  box-sizing: border-box;
  scroll-margin-top: 5vh;
}

.section#info,
.section#email {
  display: flex;
  flex-direction: column;
  /*padding: 1.5rem 2vw 1vw 1vw; */
  padding: 1.5vw;
  /*margin: 1.5vw 1.5vw 0 0.5vw;*/
  border: 2px solid #eff0f2;
  border-radius: 3vw;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  min-height: auto;
  background: white;
}


/* Мобильные стили */
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

  .sidebar__main{
    width: 100% !important;
    max-width: 100% !important;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.mobile-hidden {
    transform: translateX(-130%);
  }

  .main__app {
    width: 100%;
    padding:0;
    margin: 0;
    background-color: $white;
  }
  .section#info {
    margin: 0;
    border-radius: 0;
    border: 0;
    box-shadow: none;
  }

}

@media (max-width: 400px) {
  .sidebar {
    /*transform: translateX(-10%) !important;*/
  }
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
  color: $blue;
  cursor: pointer;
}

.logo__main{
  margin: 0 auto;
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  z-index: 999;
}
</style>
