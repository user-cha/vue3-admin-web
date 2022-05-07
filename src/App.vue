<!--
 * @Autor: wu
 * @Date: 2022-03-01 13:38:32
 * @Description: 根文件
-->

<template>
  <router-view v-slot="{ Component }">
    <transition name="el-fade-in-linear" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts"></script>

<style lang="scss"></style>
