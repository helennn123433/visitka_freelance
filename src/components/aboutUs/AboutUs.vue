<template>
  <div class="container">
    <div class="header">
      <div>О НАС</div>
      <div
        v-if="authStore.isAuthenticated"
        class="adminCard"
      >
        <img
          v-if="isEditing"
          class="icon"
          :src="Icons.ContentSave"
          alt="adminIcon"
          @click="saveEdit"
        >
        <img
          v-else
          class="icon"
          :src="Icons.Pencil"
          alt="adminIcon"
          @click="toggleEdit"
        >
      </div>
    </div>
    <div v-if="!isLoading && aboutUsData">
      <div class="upperText">
        <template v-if="isEditing">
          <textarea
            v-model="localDescription[0]"
            class="textarea"
          />
        </template>
        <template v-else>
          <p>{{ aboutUsData.description[0] }}</p>
        </template>
        <template v-if="isEditing">
          <textarea
            v-model="localDescription[1]"
            class="textarea"
          />
        </template>
        <template v-else>
          <p>{{ aboutUsData.description[1] }}</p>
        </template>
      </div>
      
      <div class="middleText">
        <my-card
          v-for="stat in aboutUsData.stats"
          :key="stat.id"
          :stat="stat"
          :is-editing="isEditing"
          @status-update="updateStatus"
        />
      </div>
      
      <div class="upperText">
        <template v-if="isEditing">
          <textarea
            v-model="localDescription[2]"
            class="textarea"
          />
        </template>
        <template v-else>
          <p>{{ aboutUsData.description[2] }}</p>
        </template>
        <template v-if="isEditing">
          <textarea
            v-model="localDescription[3]"
            class="textarea"
          />
        </template>
        <template v-else>
          <p>{{ aboutUsData.description[3] }}</p>
        </template>
      </div>
    </div>
    <div v-else-if="isLoading" class="loading">
      Загрузка данных...
    </div>
    <div v-else class="error">
      Данные не загружены
    </div>
    <my-button 
      class="btn" 
      @click="scrollToContacts"
    >
      Задать вопрос
    </my-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import type { Stats } from "@/interfaces/aboutUs/Stats";
import MyButton from '@/components/ui/MyButton.vue'
import MyCard from '@/components/aboutUs/MyCard.vue'
import { Icons } from "@/assets/img/Icons";
import apiClient from '@/network/connection';

interface AboutUsData {
  description: string[];
  stats: Stats[];
}

const authStore = useAuthStore()

const isEditing = ref<boolean>(false);
const aboutUsData = ref<AboutUsData | null>(null);
const localDescription = ref<string[]>([]);
const isLoading = ref(true);

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    saveEdit();
  }
});

const loadAboutUsData = async () => {
  try {    
    const response = await apiClient.get('/about-us');
    const data = response.data;
    
    if (data && data.description && data.stats) {
      aboutUsData.value = data;
      localDescription.value = [...data.description];
      
      if (aboutUsData.value.stats) {
        aboutUsData.value.stats.forEach(stat => {
          if (stat.upper === null) {
            stat.upper = "";
          }
        });
      }
    } else {
      throw new Error('Неверная структура данных');
    }
    
  } catch (error) {
    console.error('❌ Ошибка загрузки AboutUs:', error);
  } finally {
    isLoading.value = false;
  }
};

const emit = defineEmits(['navigate'])

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value && aboutUsData.value) {
    localDescription.value = [...aboutUsData.value.description];
  }
}

const saveEdit = async () => {
  if (!aboutUsData.value) return;
  
  try {
    const descriptionArray = [...localDescription.value];
    
    await apiClient.put('http://localhost:8080/admin/about-us/description', 
      descriptionArray
    );

    if (aboutUsData.value) {
      aboutUsData.value.description = [...descriptionArray];
    }

    isEditing.value = false;
    
  } catch (error: any) {
    console.error('Ошибка сохранения описания:', error);
  }
}

const scrollToContacts = () => {
  emit('navigate', 'email')
}

const updateStatus = async (updatedStatus: Stats) => {
  if (aboutUsData.value) {
    const index = aboutUsData.value.stats.findIndex(stat => stat.id === updatedStatus.id);
    console.log("updatedStatus",{updatedStatus})
    if (index !== -1) {
      aboutUsData.value.stats[index] = { ...updatedStatus };
      
      try {
        await apiClient.put(`http://localhost:8080/admin/about-us/stats/${updatedStatus.id}`, {
          id: updatedStatus.id,
          upper: updatedStatus.upper,
          lower: updatedStatus.lower
        });
      } catch (error) {
        console.error('Ошибка обновления данных:', error);
      }
    }
  }
}

onMounted(async () => {
  await loadAboutUsData();
});

</script>

<style lang="scss" scoped>
.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #0652ff;
  font-size: 1.2rem;
}
.error {
  color: #ff0000;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  min-height: auto;
  text-align: center;
  background: white;
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
  margin-top: 1vh;
}

.icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
  filter: invert(25%) sepia(98%) saturate(2158%) hue-rotate(220deg) brightness(103%) contrast(104%);
}

.upperText {
  display: flex;
  flex-direction: column;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  text-align: start;
  letter-spacing: 0;
  font-weight: 500;
}

.middleText {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  color: #0652ff;
}

.btn {
  align-self: center;
  padding: 1.5vh; 
}
.textarea{
  height: 50px;
}

@media (max-width: 730px) {
  .middleText {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 1.2rem;
  }
}

@media (max-width: 768px) {
    .container {
      padding: 16px;
      border: none;
      border-radius: 0;
    }
    .upperText{
      font-weight: 400;
    }
  }

@media (max-width: 480px) {
  .middleText {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 10px;
  }
}

@media screen and (min-width: 879px) and (max-width: 1075px) {
  .middleText{
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}
</style>