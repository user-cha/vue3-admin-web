/*
 * @Autor: wu
 * @Date: 2022-03-01 18:42:11
 * @Description: 路由入口文件
 */

import { createRouter, createWebHistory } from 'vue-router'
import GeneratedRoutes from '~pages'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: GeneratedRoutes
})

export default router
