<template>
    <div class="search-container">
        <img src="@/assets/img/search/search-icon.svg" alt="Поиск" class="search-icon"/>
        <input type="text" placeholder="Найти..." class="search-input" />
    </div>
</template>
<script setup lang="ts">
  
</script>
<style lang="scss">
    .search-container{
        position: relative;
        width: 80%;
        margin-right: 20px;
    }
    .search-input {
      width: 100%;
      padding: 20px 20px 20px 40px;
      background-color: $light-grey;
      border-radius: 32px;
      outline: none;
      box-shadow: 0px 4px 8px $grey;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }

    @media(max-width: 450px){
      .search-container{
        width: 100%;
        margin-right: 0;
      }
      .search-input {
        padding: 10px 10px 10px 40px;
      }
    }
</style>