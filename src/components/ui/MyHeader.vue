<template>
  <div class="about-us-header">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.about-us-header {
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
  line-height: 100%;
  width: 100%;
  color: #0652ff;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  padding-bottom: 16px;
}
</style>
