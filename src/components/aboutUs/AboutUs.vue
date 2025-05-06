<template>
  <div class="container">
    <div class="header">
      <div>О НАС</div>
      <div
        v-if="authStore.isAuthenticated"
        class="adminCard"
      >
        <img
          class="icon"
          :src="Icons.Pencil"
          alt="adminIcon"
        >
      </div>
    </div>
    <div class="upperText">
      <p>
        Мы — молодая и амбициозная команда из 20 разработчиков, успешно работающая в сфере IT уже два года. За это время
        мы реализовали множество проектов, охватывающих как мобильную разработку, так и веб-приложения, а также создали
        уникальные фирменные стили для различных компаний.
      </p>
      <p>
        Мы гордимся тем, что в нашем составе — выпускники и студенты последних курсов ведущих технических вузов
        Санкт-Петербурга. Ранее мы работали исключительно над закрытыми проектами для государственных корпораций, что
        позволило нам накопить неоценимый опыт и понять высокие стандарты качества. Теперь мы уверенно выходим на
        гражданские проекты, стремясь применить свои знания и навыки в более широком спектре задач.
      </p>
    </div>
    <div class="middleText">
      <my-card
        v-for="stat in stats"
        :key="stat.id"
        :upper="stat.upper"
        :lower="stat.lower"
      />
    </div>
    <div class="upperText">
      <p>
        Наша команда постоянно совершенствует свои навыки, следит за последними тенденциями в технологиях и стремится к
        инновациям. Мы уделяем особое внимание качеству кода, пользовательскому опыту и безопасности наших решений.
      </p>
      <p>
        Мы верим, что наш опыт и энтузиазм помогут вам достичь новых высот в вашем бизнесе. Свяжитесь с нами, чтобы
        обсудить ваши идеи и узнать, как мы можем помочь их реализовать.
      </p>
    </div>
    <my-button class="btn">
      Задать вопрос
    </my-button>
  </div>
</template>

<script setup lang="ts">
import MyButton from '@/components/ui/MyButton.vue'
import MyCard from '@/components/aboutUs/MyCard.vue'
import { Icons } from "@/assets/img/Icons";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore()

const stats = [
  { id: 1, upper: '2', lower: 'ГОДА РАБОТЫ' },
  { id: 2, upper: '20', lower: 'РАЗРАБОТЧИКОВ' },
  { id: 3, upper: '35', lower: 'ПРОЕКТОВ' },
  { id: 4, upper: '46', lower: 'НАПРАВЛЕНИЙ' },
]
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 1.5rem clamp(1rem, 5%, 3rem);
  margin: 0.5vw 0.5vw 0 1vw;
  gap: 16px;
  border: 2px solid #eff0f2;
  border-radius: 32px;
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
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  text-align: start;
  line-height: 100%;
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

@media (max-width: 730px) {
  .middleText {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 1.2rem;
  }
}

@media (max-width: 480px) {
  .middleText {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
