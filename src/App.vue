<template>
  <div class="main__app">
    <SidebarComponent
      :active-icon="activeSection"
      @icon-click="scrollToSection"
    />

    <!-- В этом контейнере все «полноэкранные» разделы -->
    <div
      ref="wrapper"
      class="all__staff"
    >
      <header-comp />
      <section
        id="info"
        class="section"
      > 
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
import { ref, onMounted } from 'vue'
import SidebarComponent from '@/components/sidebar/SidebarComponent.vue'
import AboutUs from '@/components/aboutUs/AboutUs.vue'
import HomeView from '@/components/services/HomeView.vue'
import HeaderComp from '@/components/header/HeaderComp.vue'
import ContactsSection from '@/components/contacts/ContactsSection.vue'

const sectionIds = ['info', 'list', 'email'] as const
const activeSection = ref<string>(sectionIds[0])
const wrapper = ref<HTMLElement>()!

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
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
</script>

<style>
.main__app {
  display: flex;
  height: 100vh;
  background-color: #eff0f2;
}

.all__staff {
  flex: 1;
  overflow-y: auto;
}

.section {
  margin: 1.5vw 1.5vw 0 0.5vw;
  box-sizing: border-box;
  scroll-margin-top: 5vh;
}

.section#info,
.section#email {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2vw 1vw 1vw;
  margin: 1.5vw 1.5vw 0 0.5vw;
  border: 2px solid #eff0f2;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  min-height: auto;
  background: white;
}
</style>
