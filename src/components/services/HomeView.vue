<template>
  <div class="container">
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
    />
    <div class="cards-field">
      <CardComp
        v-for="image in searchStore.filteredImages"
        :key="image.id"
        :image="image"
        @updated="handleServiceUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useSearchingStore } from "@/store/searchingStore";
import CardComp from "@/components/services/CardComp.vue";
import MyButton from "@/components/ui/MyButton.vue";
import AddDialog from "@/components/services/addDialog.vue";

const searchStore = useSearchingStore();
const authStore = useAuthStore();
const isDialogOpen = ref(false);

const maxId = computed(() => {
  if (searchStore.images.length === 0) return 0;
  return Math.max(...searchStore.images.map(item => Number(item.id)));
});

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleServiceUpdate = async () => {
  await searchStore.fetchServices();
};

onMounted(() => {
  searchStore.fetchServices();
});
</script>

<style lang="scss" scoped>
  @import '../../styles/colors.scss';

  .container {
    display: flex;
    flex-direction: column;
    background-color: $white;
    border-radius: 3vw;
    padding: 1.5vw;
    box-shadow: 0 4px 8px $grey;

    &__header{
      display: flex;
      justify-content: end;
    }

    &__btn{
      width: 150px;
      height: 40px;
      margin: 0 10px 10px 0;
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
