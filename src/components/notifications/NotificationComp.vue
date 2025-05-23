<template>
    <div class="notification-modal">
        <div :class="textClass" class="notification-text">
            {{ message }}
        </div>
        <div :class="imgClass" class="img-notification"></div>
    </div>
</template>
<script  setup lang="ts">
    import { defineProps, computed } from 'vue';

    const props = defineProps<{
        errorMessage?: string
    }>()

    const message = computed(()=>
        props.errorMessage || 'Успешно!'
    )

    const textClass = computed(() =>
        props.errorMessage ? 'error-text' : 'allright-text'
    )

    const imgClass = computed(() =>
        props.errorMessage ? 'error-img' : 'allright-img'
    )

</script>
<style  lang="scss" scoped>
    @import '../../styles/colors.scss'; 
    .notification-modal{
        z-index: 20;
        background-color: azure;
        border-radius: 10px;
        box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.25);
        display: flex;
    }
    .error-text{
        color: #cf1c1c;
    }
    .allright-text{
        color: #076423;
    }
    .error-img{
        background-image: url('@/assets/img/icons/cross.svg');
    }
    .allright-img{
        background-image: url('@/assets/img/icons/tick.svg');
    }

    .img-notification{
        width: 50px;
        height: 50px;
        background-size: cover;
        background-position: center;
    }

</style>