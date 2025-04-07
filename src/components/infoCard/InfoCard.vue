<template>
  <div class="infoCard__body">
    <div class="infoCard__header">Контакты</div>
    <div class="infoCard__text">
      Наша команда работает над проектами удаленно. Мы готовы обсуждать все
      вопросы онлайн, организовывать митинги, а также договориться о личной
      встрече в Санкт-Петербурге. Для общения с заказчиками мы используем
      Telegram и другие удобные виды связи.
    </div>
    <div class="infoCard__cards">
      <div class="infoCard__card">
        <img
          class="infoCard__card__logo"
          src="@/components/infoCard/telega.svg"
          alt="telega"
        />
        <div class="infoCard__card__link">@frtarget</div>
        <p class="infoCard__card__text">
          Telegram — самый оперативный канал для связи с нами.
        </p>
      </div>
      <div class="infoCard__card">
        <img src="@/components/infoCard/phone.svg" alt="telega" />
        <div>+7(965)077-89-87</div>
        <div>
          Если мы не смогли Вам оперативно ответить, то обязательно перезвоним.
        </div>
      </div>
      <div class="infoCard__card">
        <img src="@/components/infoCard/whatsApp.svg" alt="telega" />
        <div>+7(965)077-89-87</div>
        <div>Вы можете написать или позвонить нам в WhatsApp</div>
      </div>
      <div class="infoCard__card">
        <img src="@/components/infoCard/email.svg" alt="telega" />
        <div>alexpysenkov@gmail.com</div>
        <div>Мы всегда ждем любые Ваши вопросы на почте.</div>
      </div>
    </div>
  </div>
</template>

<style>
.infoCard__body {
  display: flex;
  flex-direction: column;
}

.infoCard__header {
  font-size: 45px;
  color: blue;
}

.infoCard__text {
  font-size: 20px;
}

.infoCard__cards {
  display: flex;
  justify-content: start;
  align-items: center;
}

.infoCard__card {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: none;
  border-radius: 20px;
  background-color: #eff0f2;
  margin: 0.3vw;
  width: 200px;
  height: 150px;
  max-width: 25vw;
}

.infoCard__card__text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
