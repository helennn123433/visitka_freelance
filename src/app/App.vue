<template>
  <div class="main__app">
    <SidebarWidget
      v-show="shouldShowCommonComponents"
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
        id="header"
        class="section"
      >
        <header
          v-show="shouldShowCommonComponents"
          class="mobile-header"
        >
          <button
            class="burger-btn"
            @click="toggleSidebar"
          >
            &#9776;
          </button>
          <div class="logo__main">
            <img
              class="img_n31"
              src="../shared/ui/icons/assets/H31.svg"
              alt="Logo_H31"
            >
          </div>
        </header>
        <HeaderWidget v-show="shouldShowCommonComponents" />
        <router-view v-slot="{ Component }">
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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SidebarWidget } from '@widgets/sidebar';
import { HeaderWidget } from '@widgets/header';
import { useBreakpoints } from '@shared/lib';

const homePage = ref();
const route = useRoute();

const isOpen = ref(false);
const { isMobile } = useBreakpoints();
const activeSection = ref('info');

const shouldShowCommonComponents = computed(() => {
  return route.meta.showCommonComponents ?? true;
});

const handleSectionChange = (sectionId: string) => {
  activeSection.value = sectionId;
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

const scrollToSection = (id: string) => {
  activeSection.value = id;
  homePage.value?.scrollToSection(id);
};

watch(isMobile, (newIsMobile) => {
  if (!newIsMobile) {
    isOpen.value = false;
  }
});

defineExpose({
  isOpen,
  toggleSidebar,
  closeSidebar
});
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
  box-sizing: border-box;
  scroll-margin-top: 5vh;
  margin-top: 1vh;
}

.section#header {
  display: flex;
  flex-direction: column;
  padding: 1.3vw;
  border: 2px solid #eff0f2;
  border-radius: 3vw;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  max-height: 93vh;
  background: white;
  width: 100%;
}

.sidebar {
  transition: transform 0.3s ease;
  z-index: 1000;
}

.all__content {
  display: flex;
  flex: 1;
  height: 100%;
  padding: 22px 22px 0 22px;
}

.mobile-header {
  display: flex;
  align-items: center;
  color: white;
  padding: 1rem;
}

@media (min-width: 769px) {
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

@media (max-width: 768px) {
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
