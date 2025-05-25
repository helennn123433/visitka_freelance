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
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AboutUs from '@/components/aboutUs/AboutUs.vue'
import HomeView from '@/components/services/HomeView.vue'
import ContactsSection from '@/components/contacts/ContactsSection.vue'
import { emitter } from '@/event-bus';

defineProps({
  isSidebarOpen: Boolean
})

const emit = defineEmits([ 'section-change'])

const sectionIds = ['info', 'list', 'email'] as const
//const activeSection = ref<string>(sectionIds[0])
const wrapper = ref<HTMLElement>()
const observer = ref<IntersectionObserver>()

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start' // Точное выравнивание
    });
  }
}

const initObserver = async () => {
  await nextTick()
  console.log('Инициализация Observer...');

  if (wrapper.value) {
    const rect = wrapper.value.getBoundingClientRect();
    console.log("Root container size:", {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    });
  } else {
    console.warn("Root container not found!");
  }

  if (observer.value) {
    console.log('Отключаем старый Observer');
    observer.value.disconnect()
  }
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      console.log(`Section ${id} size:`, { 
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      });
    } else {
      console.warn(`Element #${id} not found!`);
    }
  });
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const rect = entry.boundingClientRect;
        console.log(`Intersection update for ${entry.target.id}:`, {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          rect: { width: rect.width, height: rect.height }
        });

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          emit('section-change', entry.target.id)
        }
      })
    },
    {
    root: wrapper.value,
    threshold: 0.5, // Срабатывает при 50% видимости
    rootMargin: '0px' // Без смещения
    }
  )

  sectionIds.forEach(id => {
    const el = document.getElementById(id)
    if (el) {
      console.log(`Наблюдаем за секцией ${id}`);
      observer.value?.observe(el)
    }
  })
}

const handleSectionLoaded = () => {
  console.log('[HomePage] Событие section-loaded получено!');
  initObserver();
};

onMounted(() => {
  initObserver()
  emitter.on('section-loaded', handleSectionLoaded);
})

onUnmounted(() => {
  observer.value?.disconnect()
  emitter.off('section-loaded', handleSectionLoaded);
})

defineExpose({
  scrollToSection
})
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';


.all__staff {
  height: 100vh;
  overflow-y: auto; /* Включаем скролл только внутри контейнера */
}

.section {
  margin-bottom: 1.5vw;
  box-sizing: border-box;
  scroll-margin-top: 5vh;
  min-height: 100vh;
}

.section#info,
.section#email {
  display: flex;
  flex-direction: column;
  padding: 1.5vw;
  box-sizing: border-box;
  min-height: auto;
  background: white;
}

.section#info{
  border: 2px solid #eff0f2;
  border-radius: 3vw;
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