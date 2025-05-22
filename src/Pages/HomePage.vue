<template>
  <!-- В этом контейнере все «полноэкранные» разделы -->
  <div 
    ref="wrapper"
    class="all__staff"
  >
    <section
      id="info"
      class="section"
    >
      <AboutUs @navigate="handleNavigation" />
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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AboutUs from '@/components/aboutUs/AboutUs.vue'
import HomeView from '@/components/services/HomeView.vue'
import ContactsSection from '@/components/contacts/ContactsSection.vue'

defineProps({
  isSidebarOpen: Boolean
})

const emit = defineEmits(['navigate'])

const sectionIds = ['info', 'list', 'email'] as const
const activeSection = ref<string>(sectionIds[0])
const wrapper = ref<HTMLElement>()
const observer = ref<IntersectionObserver>()

const scrollToSection = (id: string) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const handleNavigation = (sectionId: string) => {
  scrollToSection(sectionId)
  emit('navigate', sectionId)
}

const initObserver = async () => {
  await nextTick()

  if (observer.value) {
    observer.value.disconnect()
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    {
      root: wrapper.value,
      rootMargin: '0px',
      threshold: 0.4
    }
  )

  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) {
      observer.value?.observe(el)
    }
  })
}

onMounted(() => {
  initObserver()
})

onUnmounted(() => {
  observer.value?.disconnect()
})

defineExpose({
  activeSection,
  scrollToSection
})
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.all__staff {
  flex: 1;
  overflow-y: auto;
}

.section {
  margin: 1.5vw 1.5vw 0 1.5vw;
  box-sizing: border-box;
  scroll-margin-top: 5vh;
}

.section#info,
.section#email {
  display: flex;
  flex-direction: column;
  padding: 1.5vw;
  border: 2px solid #eff0f2;
  border-radius: 3vw;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  min-height: auto;
  background: white;
}

/* Мобильные стили */
@media (max-width: 767px) {
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

  .section#info,
  .section#email{
    border: none;
    border-radius: 0;
    box-shadow:none;
  }
}
</style>