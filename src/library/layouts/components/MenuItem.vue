<!--
 * @Autor: wu
 * @Date: 2022-03-25 14:25:56
 * @Description: 菜单
-->

<template>
  <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="forcedConversion(menu)">
    <template #title>
      <el-icon v-if="menu.meta?.icon">
        <svg-icon :name="menu.meta.icon" />
      </el-icon>
      <span>{{ menu.meta?.title }}</span>
    </template>
    <menu-item v-for="item in menu.children" :menu="item" :key="item.name" />
  </el-sub-menu>
  <el-menu-item v-else :index="forcedConversion(menu)">
    <el-icon v-if="menu.meta?.icon">
      <svg-icon :name="menu.meta.icon" />
    </el-icon>
    <template #title>{{ menu.meta?.title }}</template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

defineProps({
  menu: {
    type: Object as () => RouteRecordRaw,
    required: true
  }
})

const forcedConversion = (row: RouteRecordRaw): string => {
  return <string>row.name
}
</script>

<style scoped lang="scss"></style>
