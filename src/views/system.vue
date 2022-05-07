<!--
 * @Autor: wu
 * @Date: 2022-03-24 17:08:34
 * @Description: router-view
-->

<route>
{
  name: 'system',
  meta: {
    icon: 'system-index',
    title: "系统设置",
    sort: 99
  },
  component: '/src/library/layouts/index.vue',
  redirect: {
    name: 'systemPersonalInfo'
  }
}
</route>

<template>
  <div></div>
</template>

<script setup lang="ts">
//  TODO
</script>

<style scoped lang="scss"></style>
