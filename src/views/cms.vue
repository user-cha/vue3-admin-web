<!--
 * @Autor: wu
 * @Date: 2022-03-24 17:08:34
 * @Description: router-view
-->

<route>
{
  name: 'cms',
  meta: {
    icon: 'cms-index',
    title: "内容管理",
    sort: 1
  },
  component: '/src/library/layouts/index.vue',
  redirect: {
    name: 'cmsSite'
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
