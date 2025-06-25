<template>
  <div class="container">
    <div class="header">
      <div>УСЛУГИ</div>
    </div>
    <div
      v-if="authStore.isAuthenticated"
      class="container__header"
    >
      <my-button
        class="container__btn"
        @click="toggleDialog"
      >
        Добавить
      </my-button>
    </div>
    <add-dialog
      v-if="isDialogOpen"
      :next-id="(maxId + 1).toString()"
      @toggle-dialog="toggleDialog"
      @service-added="handleServiceUpdate"
      @success="showSuccess"
      @error="showError"
    />
    <div class="cards-field">
      <CardComp
        v-for="image in searchStore.filteredImages"
        :key="image.id"
        :image="{ 
          id: image.id, 
          title: image.title, 
          image: image.image,
          price: image.price
        }"
        :show-price="true"
        @updated="handleServiceUpdate"
        @success="showSuccess"
        @error="showError"
        @click="goToService(image)"
      />
    </div>
    <NotificationComp 
      :visible="notificationVisible"
      :error-message="notificationError"
      @close="notificationVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted} from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useSearchingStore } from "@/store/searchingStore";
import CardComp from "@/components/services/CardComp.vue";
import MyButton from "@/components/ui/MyButton.vue";
import AddDialog from "@/components/services/addDialog.vue";
import { type Image } from "@/interfaces/services/Image";
import { emitter } from '@/emits/event-bus';
import NotificationComp from '@/components/notifications/NotificationComp.vue';

const isDialogOpen = ref(false);

const router = useRouter();
const searchStore = useSearchingStore();
const authStore = useAuthStore();
const emit = defineEmits(['section-loaded']);
const notificationVisible = ref(false);
const notificationError = ref<string | null>(null);
let notificationTimeout: number | null = null;

const showSuccess = () => {
  notificationError.value = null;
  notificationVisible.value = true;
  
  if (notificationTimeout) clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    notificationVisible.value = false;
  }, 2000);
};

const showError = (message: string) => {
  notificationError.value = message;
  notificationVisible.value = true;
  
  if (notificationTimeout) clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(() => {
    notificationVisible.value = false;
  }, 5000);
};

const maxId = computed(() => {
  if (searchStore.images.length === 0) return 0;
  return Math.max(...searchStore.images.map(item => Number(item.id)));
});

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleServiceUpdate = async () => {
  await searchStore.fetchServices();
  await nextTick();
  emit('section-loaded');
};

const goToService = (service: Image) => {
  router.push({
    name: 'service',
    params: { id: service.id },
    query: { title: service.title }
  });
};

onMounted(async () => {
  await searchStore.fetchServices();
  await nextTick(); 
  emitter.emit('section-loaded');
});

onUnmounted(() => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
});
</script>

<style lang="scss" scoped>
@use '../../styles/colors.scss';

.container {
  display: flex;
  flex-direction: column;
  background-color: colors.$white;
  padding: 1.5vw;

  &__header{
    display: flex;
    justify-content: end;
  }

  &__btn{
    width: 150px;
    height: 40px;
    margin: 0 10px 10px 0;
  }
  &__btn:hover{
    background-color: #082f8b;
  }
}
.cards-field{
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5vw;
  justify-content: space-between;
  align-content: space-between;
}

.header {
display: flex;
justify-content: space-between;
align-self: flex-start;
line-height: 100%;
width: 100%;
color: #0652ff;
font-size: clamp(1.5rem, 5vw, 2.5rem);
font-weight: 800;
padding-bottom: 16px;
}

@media (max-width: 767px) {
  .cards-field{
    gap: 0;
    justify-content: center;
  }
  .container {
    border-radius: 0;
    box-shadow: none;
  }
}

@media(max-width: 450px){
  .header{
    flex-direction: column;
    gap: 3vw;
    margin-bottom: 3vw;;
    .header-buttons{
      margin-right:0;
    }
    img{
      width: 3vw;
    }
  }
}
</style>
