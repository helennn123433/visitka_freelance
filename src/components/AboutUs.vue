<template>
  <div class="container">
    <div class="header">О НАС</div>
    <div class="upperText">
      <p>
        Мы — молодая и амбициозная команда из 20 разработчиков, успешно
        работающая в сфере IT уже два года. За это время мы реализовали
        множество проектов, охватывающих как мобильную разработку, так и
        веб-приложения, а также создали уникальные фирменные стили для различных
        компаний.
      </p>
      <p>
        Мы гордимся тем, что в нашем составе — выпускники и студенты последних
        курсов ведущих технических вузов Санкт-Петербурга. Ранее мы работали
        исключительно над закрытыми проектами для государственных корпораций,
        что позволило нам накопить неоценимый опыт и понять высокие стандарты
        качества. Теперь мы уверенно выходим на гражданские проекты, стремясь
        применить свои знания и навыки в более широком спектре задач.
      </p>
    </div>
    <div class="middleText">
      <my-card>
        <template v-slot:upper>2</template>
        <template v-slot:lower>ГОДА РАБОТЫ</template>
      </my-card>
      <my-card>
        <template v-slot:upper>20</template>
        <template v-slot:lower>РАЗРАБОТЧИКОВ</template>
      </my-card>
      <my-card>
        <template v-slot:upper>35</template>
        <template v-slot:lower>ПРОЕКТОВ</template>
      </my-card>
      <my-card>
        <template v-slot:upper>46</template>
        <template v-slot:lower>НАПРАВЛЕНИЙ</template>
      </my-card>
    </div>
    <div class="upperText">
      <p>
        Наша команда постоянно совершенствует свои навыки, следит за последними
        тенденциями в технологиях и стремится к инновациям. Мы уделяем особое
        внимание качеству кода, пользовательскому опыту и безопасности наших
        решений.
      </p>
      <p>
        Мы верим, что наш опыт и энтузиазм помогут вам достичь новых высот в
        вашем бизнесе. Свяжитесь с нами, чтобы обсудить ваши идеи и узнать, как
        мы можем помочь их реализовать.
      </p>
    </div>
    <my-button class="btn"> Задать вопрос </my-button>
  </div>
</template>

<script setup lang="ts">
import MyButton from "./MyButton.vue";
import MyCard from "./MyCard.vue";
</script>

<style lang="scss" scoped>
.container {
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  padding-right: 16px;
  gap: 16px;
  border: 2px solid #eff0f2;
  border-radius: 32px;
  padding-left: 31px;
  height: 80vh;
}

.header {
  //border: solid 1px red;
  align-self: flex-start;
  line-height: 100%;
  color: #0652ff;
  font-size: 32px;
  font-weight: 800;
  margin-top: 27px;
  //margin-bottom: -10px;
}

.upperText {
  //border: solid 1px red;
  font-size: 16px;
  text-align: start;
  line-height: 100%;
  letter-spacing: 0%;
  font-weight: 500;
}

.middleText {
  //border: solid 1px red;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  font-family: "Inter", sans-serif;
  text-align: center;
  color: #0652ff;
  padding-left: 36px;
  padding-right: 36px;
}

.btn {
  align-self: center;
}
</style>
