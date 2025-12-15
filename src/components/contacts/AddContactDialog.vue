<template>
  <div class="dialog">
    <div class="dialog__card">
      <div class="dialog__card__title">
        <h3>Добавить новый контакт</h3>
      </div>
      <div class="dialog__card__inputs">
        <select
          v-model="form.icon"
          class="input"
        >
          <option value="" disabled>Выберите иконку</option>
          <option value="PhoneIcon">Телефон</option>
          <option value="MailIcon">Email</option>
          <option value="TelegramIcon">Telegram</option>
          <option value="WhatsappIcon">WhatsApp</option>
          <option value="LocationIcon">Адрес</option>
        </select>
        <input
          v-model="form.title"
          placeholder="Заголовок (номер телефона, email, username)"
          type="text"
          class="input"
        >
        <input
          v-model="form.subtitle"
          placeholder="Описание (например: 'Наш основной номер')"
          type="text"
          class="input"
        >
      </div>
      <div class="dialog__card__btns">
        <MyButton
          class="btn"
          @click="emit('toggle-dialog')"
        >
          Назад
        </MyButton>
        <MyButton
          class="btn"
          @click="addContact"
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
import apiClient from '@/network/connection';
import MyButton from "@/components/ui/MyButton.vue";
import NotificationComp from "../notifications/NotificationComp.vue";

const form = ref({
  icon: "",
  title: "",
  subtitle: ""
});

const showNotification = ref(false);
const notificationMessage = ref('');

// eslint-disable-next-line no-unused-vars
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: 'toggle-dialog'): void;
  // eslint-disable-next-line no-unused-vars
  (e: 'contact-added', contact: any): void;
  // eslint-disable-next-line no-unused-vars
  (e: 'success'): void;
  // eslint-disable-next-line no-unused-vars
  (e: 'error', message: string): void;
}>();

const closeNotification = () => {
  showNotification.value = false;
};

const showErrorNotification = (message: string) => {
  notificationMessage.value = message;
  showNotification.value = true;
};

const addContact = async () => {
  try {
    if (!form.value.icon) {
      showErrorNotification('Выберите тип контакта');
      return;
    }
    
    if (!form.value.title.trim()) {
      showErrorNotification('Заголовок контакта обязателен');
      return;
    }

    if (!form.value.subtitle.trim()) {
      showErrorNotification('Описание контакта обязательно');
      return;
    }

    if (form.value.icon === 'PhoneIcon') {
      const phoneRegex = /^[\d\s\-+()]{10,}$/;
      if (!phoneRegex.test(form.value.title)) {
        showErrorNotification('Введите корректный номер телефона');
        return;
      }
    } else if (form.value.icon === 'MailIcon') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.value.title)) {
        showErrorNotification('Введите корректный email адрес');
        return;
      }
    } else if (form.value.icon === 'TelegramIcon') {
      if (!form.value.title.trim()) {
        showErrorNotification('Введите username Telegram');
        return;
      }
    }

    const newContact = {
      icon: form.value.icon,
      title: form.value.title.trim(),
      subtitle: form.value.subtitle.trim()
    };

    const response = await apiClient.post('/contacts', newContact);
    
    form.value = { icon: "", title: "", subtitle: "" };
    emit('contact-added', response.data);
    emit('toggle-dialog');
    emit('success');
    
  } catch(err: any) {
    console.error('❌ Ошибка добавления контакта:', err);
    
    let errorMsg = 'Неизвестная ошибка при добавлении контакта';
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err.message) {
      errorMsg = err.message;
    }

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
    padding: 20px;

    &__title{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-bottom: 15px;
      
      h3 {
        margin: 0;
        color: #333;
        font-size: 1.2rem;
      }
    }

    &__inputs{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      gap: 10px;
    }

    &__btns{
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 100%;
      margin-top: 20px;
      gap: 10px;
    }
  }
}

.input{
  width: 90%;
  height: 45px;
  margin: 5px;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 32px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.3);
  }
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,<svg viewBox='0 0 4 5'><path fill='%23333' d='M2 0 0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 12px;
  padding-right: 40px;
}

.btn{
  height: 40px;
  width: 45%;
  padding: 5px;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .dialog__card {
    width: 30%;
  }
}

@media (max-width: 768px) {
  .dialog__card {
    width: 50%;
  }
}

@media (max-width: 480px) {
  .dialog__card {
    width: 80%;
    padding: 15px;
  }
  
  .input {
    font-size: 14px;
    height: 40px;
  }
}
</style>