<!--
 * @Autor: ll
 * @Date: 2022-03-25 18:12:44
 * @Description: Svg-icon
-->

<template>
  <svg aria-hidden="true" class="app-svg-icon">
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
const symbolId = computed((): string => {
  return `#icon-${props.name}`
})
</script>

<style scoped lang="scss">
.app-svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
