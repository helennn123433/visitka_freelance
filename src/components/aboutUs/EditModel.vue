<template>
  <div class="edit-model">
    <div class="edit-model__card">
      <div class="edit-model__card__title">
        <h3>Редактирование статистики</h3>
      </div>
      <div class="edit-model__card__inputs">
        <div
          v-for="(stat, index) in localStats"
          :key="stat.id"
          class="stat-item"
        >
          <input
            v-model="localStats[index].upper"
            type="text"
            class="input"
            placeholder="Введите число"
          >
          <input
            v-model="localStats[index].lower"
            type="text"
            class="input"
            placeholder="Введите описание"
          >
        </div>
      </div>
      <div class="edit-model__card__btns">
        <my-button
          class="btn secondary"
          @click="closeModal"
        >
          Отмена
        </my-button>
        <my-button
          class="btn primary"
          @click="saveChanges"
        >
          Сохранить изменения
        </my-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MyButton from "@/components/ui/MyButton.vue";
import { StatItem } from "@/interfaces/aboutUs/aboutUs";

const props = defineProps({
  stats: {
    type: Array as () => StatItem[],
    required: true
  }
});

const emit = defineEmits(["update-state", "close"]);

const localStats = ref<StatItem[]>(JSON.parse(JSON.stringify(props.stats)));

const saveChanges = () => {
  if (validateStats()) {
    emit("update-state", localStats.value);
  }
};

const closeModal = () => {
  emit("close");
};

const validateStats = (): boolean => {
  for (const stat of localStats.value) {
    if (!stat.upper.trim() || !stat.lower.trim()) {
      alert("Все поля должны быть заполнены!");
      return false;
    }
  }
  return true;
};
</script>

<style lang="scss" scoped>
.edit-model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;

  &__card {
    display: flex;
    flex-direction: column;
    width: 20%;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 20px;

    &__title {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    &__btns {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}

.stat-item {
  display: flex;
  justify-content: space-around;
}

.input {
  width: 70%;
  height: 100%;
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.btn {
  height: 40px;
  width: 40%;
  padding: 5px;
}

@media screen and (max-width: 767px) {
  .edit-model {
    &__card {
      width: 40%;
    }
  }
}

@media screen and (max-width: 425px) {
  .edit-model {
    &__card {
      width: 50%;
    }
  }
}
</style>