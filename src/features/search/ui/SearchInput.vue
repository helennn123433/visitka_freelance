<template>
  <div class="search-container">
    <img
      :src="Icons.Search"
      alt="Поиск"
      class="search-icon"
    >
    <input
      v-model="searchStore.searchInput"
      type="text"
      placeholder="Найти..."
      class="search-input"
    >
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '../model/searchStore';
import { Icons } from '@shared/ui/icons';

const searchStore = useSearchStore();
</script>

<style lang="scss" scoped>
$light-grey: #EFF0F2;

.search-container {
  position: relative;
  width: 70%;
  margin-right: 1vw;

  input {
    font-size: 14px;
    font-weight: 400;
  }
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 15px 15px 50px;
  background-color: $light-grey;
  border-radius: 5vw;
  border: none;
  outline: none;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
  font-size: 3vw;
}

.search-icon {
  position: absolute;
  left: 1.5vw;
  top: 50%;
  width: 18px;
  transform: translateY(-50%);
  cursor: pointer;
}

@media(min-width: 1400px) {
  .search-input {
    padding: 20px 20px 20px 52px;
  }
}

@media(min-width: 1700px) {
  .search-input {
    padding: 25px 25px 25px 57px;
  }
}

@media(min-width: 2000px) {
  .search-input {
    padding: 30px 30px 30px 63px;
  }
}

@media(max-width: 1000px) {
  .search-input {
    padding: 12px 12px 12px 40px;
  }
}

@media(max-width: 768px) {
  .search-container {
    width: 100%;
    margin: 0;

    input {
      font-size: 14px;
      font-weight: 400;
      height: 45px;
    }
  }

  .search-icon {
    width: 13px;
  }
}

@media(max-width: 650px) {
  .search-input {
    padding: 9px 12px 9px 30px;
  }
}

@media(max-width: 450px) {
  .search-container {
    width: 100%;
    margin-right: 0;
  }

  .search-input {
    border-radius: 20px;
  }
}
</style>
