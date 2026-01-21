<template>
  <div
    ref="wrapper"
    class="all__staff"
  >
    <section
      id="info"
      class="section"
    >
      <AboutUsSection @navigate="handleNavigation" />
    </section>
    <section
      id="list"
      class="section"
    >
      <ServicesListWidget />
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { emitter } from '@shared/lib/eventBus';
import { AboutUsSection } from '@widgets/about-us';
import { ServicesListWidget } from '@widgets/services-list';
import { ContactsSection } from '@widgets/contacts';

defineProps<{
  isSidebarOpen?: boolean;
}>();

const emit = defineEmits<{
  'section-change': [sectionId: string];
  'navigate': [sectionId: string];
}>();

const sectionIds = ['info', 'list', 'email'] as const;
const wrapper = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
const isMobile = ref(window.innerWidth <= 800);
const isProgrammaticScroll = ref(false);
const scrollTimeout = ref<number | null>(null);

const scrollToSection = (id: string) => {
  isProgrammaticScroll.value = true;

  emit('section-change', id);

  const el = document.getElementById(id);
  if (el) {
    if (observer.value) {
      observer.value.disconnect();
    }

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value);
    }

    scrollTimeout.value = setTimeout(() => {
      isProgrammaticScroll.value = false;
      initObserver();
    }, 1000) as unknown as number;
  }
};

const initObserver = async () => {
  await nextTick();

  if (observer.value) {
    observer.value.disconnect();
  }

  const config = {
    root: null,
    threshold: isMobile.value ? 0.01 : 0.2,
    rootMargin: isMobile.value ? '-100px 0px 0px 0px' : '-50px 0px 0px 0px'
  };
  observer.value = new IntersectionObserver(
    (entries) => {
      if (isProgrammaticScroll.value) return;
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isMobile.value && entry.intersectionRatio < 0.2) return;

          if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
            mostVisibleEntry = entry;
          }
        }
      });

      if (mostVisibleEntry) {
        const minRatio = isMobile.value ? 0.01 : 0.2;
        if (mostVisibleEntry.intersectionRatio >= minRatio) {
          emit('section-change', mostVisibleEntry.target.id);
        }
      }
    },
    config
  );

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      observer.value?.observe(el);
    }
  });
};

const handleSectionLoaded = () => {
  initObserver();
};

const handleResize = () => {
  const newIsMobile = window.innerWidth <= 800;
  if (isMobile.value !== newIsMobile) {
    isMobile.value = newIsMobile;
    initObserver();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  initObserver();
  emitter.on('section-loaded', handleSectionLoaded);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (observer.value) observer.value.disconnect();
  emitter.off('section-loaded', handleSectionLoaded);
  if (scrollTimeout.value) clearTimeout(scrollTimeout.value);
});

const handleNavigation = (sectionId: string) => {
  scrollToSection(sectionId);
};

defineExpose({
  scrollToSection
});
</script>

<style lang="scss" scoped>
$white: #FFFFFF;

.all__staff {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
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

.section#info {
  border: 2px solid #eff0f2;
  border-radius: 3vw;
  margin-right: 10px;
}

.section#list {
  min-height: 100vh;
  height: auto;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .main__app {
    width: 100%;
    padding: 0;
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
  .section#email {
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
