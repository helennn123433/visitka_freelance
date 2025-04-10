<template>
  <div class="infoCard__body">
    <div class="infoCard__header">Контакты</div>
    <div class="infoCard__text">
      <p class="infoCard__text__p">
        Наша команда работает над проектами удаленно. Мы готовы обсуждать все
        вопросы онлайн, организовывать митинги, а также договориться о личной
        встрече в Санкт-Петербурге. Для общения с заказчиками мы используем
        Telegram и другие удобные виды связи.
      </p>
    </div>
    <div class="infoCard__cards">
      <div class="infoCard__card">
        <div class="infoCard__card__logo">
          <img
            class="infoCard__card__logo__img"
            src="@/components/infoCard/telega.svg"
            alt="telega"
          />
        </div>
        <div class="infoCard__card__link"><b>@frtarget</b></div>
        <div class="infoCard__card__text">
          <p class="infoCard__card__text__p">
            Telegram — самый оперативный канал для связи с нами.
          </p>
        </div>
      </div>
      <div class="infoCard__card">
        <div class="infoCard__card__logo">
          <img
            class="infoCard__card__logo__img"
            src="@/components/infoCard/phone.svg"
            alt="telega"
          />
        </div>
        <div class="infoCard__card__link"><b>+7(965)077-89-87</b></div>
        <div class="infoCard__card__text">
          <p class="infoCard__card__text__p">
            Если мы не смогли Вам оперативно ответить, то обязательно
            перезвоним.
          </p>
        </div>
      </div>
      <div class="infoCard__card">
        <div class="infoCard__card__logo">
          <img
            class="infoCard__card__logo__img"
            src="@/components/infoCard/whatsApp.svg"
            alt="telega"
          />
        </div>
        <div class="infoCard__card__link"><b>+7(965)077-89-87</b></div>
        <div class="infoCard__card__text">
          <p class="infoCard__card__text__p">
            Вы можете написать или позвонить нам в WhatsApp
          </p>
        </div>
      </div>
      <div class="infoCard__card">
        <div class="infoCard__card__logo">
          <img
            class="infoCard__card__logo__img"
            src="@/components/infoCard/email.svg"
            alt="telega"
          />
        </div>
        <div class="infoCard__card__link" style="text-decoration: underline">
          <b>alexpysenkov@gmail.com</b>
        </div>
        <div class="infoCard__card__text">
          <p class="infoCard__card__text__p">
            Мы всегда ждем любые Ваши вопросы на почте.
          </p>
        </div>
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
  font-weight: 800;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  color: #0652ff;
}

.infoCard__text {
  font-size: 20px;
}
.infoCard__text__p {
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
}

.infoCard__cards {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.infoCard__card {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  border: none;
  border-radius: 20px;
  background-color: #eff0f2;
  padding: 0.4vw;
  margin: 0.3vw;
  width: 200px;
  height: 150px;
  max-width: 75vw;
}

.infoCard__card__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.infoCard__card__logo__img {
  width: 32px;
  height: 32px;
}

.infoCard__card__link {
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 18px;
  margin: 0.4vh;
  padding: 0.4vh;
}

.infoCard__card__text {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
  width: 100%;
  margin: 0.4vh;
  padding: 0.4vh;
}

.infoCard__card__text__p {
  display: flex;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  text-align: center;
  width: 77%;
  height: 100%;
  margin: 0;
  color: #898989;
  word-spacing: 8px;
  hyphens: manual;
}

@media (max-width: 600px) {
  .infoCard__cards {
    display: grid;
    grid-template-areas:
      "card1 card2"
      "card3 card4";
  }

  .infoCard__card:nth-child(1) {
    grid-area: card1;
  }

  .infoCard__card:nth-child(2) {
    grid-area: card2;
  }

  .infoCard__card:nth-child(3) {
    grid-area: card3;
  }

  .infoCard__card:nth-child(4) {
    grid-area: card4;
  }
}
@media (max-width: 400px) {
  .infoCard__cards {
    display: grid;
    grid-template-areas:
      "card1"
      "card2"
      "card3"
      "card4";
  }
}
</style>
