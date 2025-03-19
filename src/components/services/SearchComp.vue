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
    width: 70vw;
    margin-right: 1vw;
    input{
      font-size: 1.5vw;
    }
  }
  .search-input {
    width: 100%;
    padding: 2vw 2vw 2vw 4vw;
    background-color: $light-grey;
    border-radius: 5vw;
    outline: none;
    box-shadow: 0vw 1vw 2vw $grey;
  }
  .search-icon {
    position: absolute;
    left: 1vw;
    top: 50%;
    width: 3vw;
    transform: translateY(-50%);
    cursor: pointer;
  }
  @media(max-width: 450px){
    .search-container{
      width: 100%;
      margin-right: 0;
    }
    .search-input {
      font-size: 14px;
      padding: 8px 12px 8px 36px;
      border-radius: 20px;
    }
    .search-icon {
      //width: 20px;
      left: 8px;
    }
  }
</style>