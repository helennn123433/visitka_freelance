<template>
  <div class="dialog">
    <div class="dialog__card">
      <div class="dialog__card__title">
        <h3>Добавить новую услугу</h3>
      </div>
      <div class="dialog__card__inputs">
        <input
          v-model="form.title"
          placeholder="название"
          type="text"
          class="input"
        >
        <input
          v-model="form.price"
          placeholder="цена"
          type="number"
          class="input"
          min="1"
        >
        <input
          v-model="form.image"
          type="text"
          placeholder="ссылка на картинку"
          class="input"
        >
      </div>
      <div class="dialog__card__btns">
        <MyButton
          class="btn"
          @click="emit('toggleDialog')"
        >
          Назад
        </MyButton>
        <MyButton
          class="btn"
          @click="addService"
        >
          Добавить
        </MyButton>
      </div>
    </div>
  </div>
  <NotificationComp 
    v-if="showNotification"
    :visible="showNotification"
    :error-message="notificationMessage"
    @close="closeNotification"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSearchingStore } from "@/store/searchingStore";
import MyButton from "@/components/ui/MyButton.vue";
import NotificationComp from "../notifications/NotificationComp.vue";

const searchStore = useSearchingStore();

const form = ref({
  title: "",
  price: 0,
  image: ""
});

const showNotification = ref(false);
const notificationMessage = ref('');

const emit = defineEmits(['toggle-dialog', 'service-added', 'success', 'error']);

const closeNotification = () => {
  showNotification.value = false;
};

const showErrorNotification = (message: string) => {
  notificationMessage.value = message;
  showNotification.value = true;
};

const addService = async () => {
  try {
    if (!form.value.title.trim()) {
      showErrorNotification('Название услуги обязательно');
      return;
    }
    
    if (form.value.price <= 0) {
      showErrorNotification('Цена должна быть положительным числом');
      return;
    }

    if (form.value.image) {
      try {
        new URL(form.value.image);
      } catch {
        showErrorNotification('Некорректный URL изображения');
        return;
      }
    }

    const serviceData = {
      title: form.value.title,
      price: Number(form.value.price),
      image: form.value.image
    };

    await searchStore.addService(serviceData);
    
    form.value = { title: "", price: 0, image: "" };
    emit('service-added');
    emit('toggle-dialog');
    emit('success');
  } catch(err: unknown) {
    console.error('Ошибка добавления услуги:', err);
    const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка';
    showErrorNotification(errorMsg);
    emit('error', errorMsg);
  }
};
</script>

<style lang="scss" scoped>
.dialog{
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

  &__card{
    display: flex;
    flex-direction: column;
    width: 20%;
    background-color: white;
    border-radius: 32px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
    padding: 10px;

    &__title{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    &__inputs{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    &__btns{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}

.input{
  width: 70%;
  height: 100%;
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.btn{
  height: 30%;
  width: 40%;
  padding: 5px;
}
</style>