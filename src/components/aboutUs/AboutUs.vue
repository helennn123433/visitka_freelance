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
          :src="Icons.Telegram"
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
    <div class="upperText">
      <template v-if="isEditing">
        <textarea
          v-model="description[0]"
          class="textarea"
        />
      </template>
      <template v-else>
        <p>{{ description[0] }}</p>
      </template>
      <template v-if="isEditing">
        <textarea
          v-model="description[1]"
          class="textarea"
        />
      </template>
      <template v-else>
        <p>{{ description[1] }}</p>
      </template>
    </div>
    <div class="middleText">
      <my-card
        v-for="stat in stats"
        :key="stat.id"
        :stat="stat"
        :is-editing="isEditing"
        @statusUpdate="updateStatus"
      />
    </div>
    <div class="upperText">
      <template v-if="isEditing">
        <textarea
          v-model="description[2]"
          class="textarea"
        />
      </template>
      <template v-else>
        <p>{{ description[2] }}</p>
      </template>
      <template v-if="isEditing">
        <textarea
          v-model="description[3]"
          class="textarea"
        />
      </template>
      <template v-else>
        <p>{{ description[3] }}</p>
      </template>
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
import MyButton from '@/components/ui/MyButton.vue'
import MyCard from '@/components/aboutUs/MyCard.vue'
import { Stats} from "@/interfaces/aboutUs/Stats";
import { Icons } from "@/assets/img/Icons";
import { useAuthStore } from "@/store/authStore";
import { onMounted, ref } from "vue";

const authStore = useAuthStore()

let isEditing = ref<boolean>(false);
const description = ref([])
const stats = ref([])

onMounted(async () => {
  const res = await fetch('/api/aboutUs')
  const data = await res.json()
  description.value = data.description
  stats.value = data.stats
})

const emit = defineEmits(['navigate'])

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
}

const saveEdit = async () => {
  await fetch('/api/aboutUs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: description.value,
      stats: stats.value,
    })
  })
  toggleEdit()
}

const scrollToContacts = () => {
  emit('navigate', 'email')
}

const updateStatus = (updatedStatus: Stats) => {
  const index =stats.value.findIndex(c => c.id === updatedStatus.id)
  if (index !==-1){
    stats.value[index] = {
      ...stats.value[index],
      ...updatedStatus
    }
  }
}

</script>

<style lang="scss" scoped>
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

@media (max-width: 767px) {
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
