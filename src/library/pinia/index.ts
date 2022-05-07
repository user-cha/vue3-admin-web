/*
 * @Autor: ll
 * @Date: 2022-03-23 16:11:13
 * @Description: pinia vue3的状态管理工具
 */

import Router from '@/library/router/index'
import AppConfig from '@/library/config'
import { defineStore } from 'pinia'
import { ssoUserInfo } from '@/service/common'
import type { Menus, UserInfo } from '@/service/common.type'
import type { RouteRecordRaw } from 'vue-router'
import type { PiniaState } from './index.type'

export default defineStore('app-pinia-library', {
  state: () => {
    const state: PiniaState = {
      /** 用户信息 */
      userInfo: null,
      /** 菜单 */
      appMenus: null,
      /** 权限菜单 */
      permissionMenus: null
    }
    return state
  },
  getters: {},
  actions: {
    /** 初始化项目所需要的信息 */
    async initAppData(): Promise<void> {
      const data = await this.setUserInfo()
      this.permissionMenus = this.tiledPermissionMenus(data.menus)
      const appAllMenus = Router.options.routes.filter((item) => !AppConfig.pageWhitelist.includes(<string>item.name))
      this.appMenus = this.recursionMenus(appAllMenus)
    },
    /** 设置用户信息 */
    async setUserInfo(): Promise<UserInfo> {
      const { data } = await ssoUserInfo()
      this.userInfo = data
      return this.userInfo
    },
    /** 递归路由信息tree */
    recursionMenus(tree: RouteRecordRaw[]): RouteRecordRaw[] {
      const menus: RouteRecordRaw[] = []
      // 整理排序
      tree.sort((a, b) => {
        const aSort = <number>a.meta?.sort || 1
        const bSort = <number>b.meta?.sort || 1
        return aSort - bSort
      })
      tree.forEach((item) => {
        if (item.meta && !item.meta.hidden) {
          let childMenus: RouteRecordRaw[] = []
          let isPush = true
          if (item.children) {
            childMenus = this.recursionMenus(item.children)
            isPush = this.judgeIsPush(item.children)
          }
          if (isPush) {
            menus.push({
              ...item,
              children: childMenus
            })
          }
        }
      })
      return menus
    },
    /** 判断是否需要拼接 */
    judgeIsPush(tree: RouteRecordRaw[]): boolean {
      let isPush = false
      tree.forEach((item) => {
        if (item.children) {
          if (item.children.length < 1) {
            isPush = tree.some((item) => !item.meta?.hidden)
          } else {
            isPush = this.judgeIsPush(item.children)
          }
        } else {
          isPush = tree.some((item) => !item.meta?.hidden)
        }
        // 如果存在，进行权限判断
        if (isPush && AppConfig.accountPermissionEnable && this.permissionMenus) {
          isPush = !!this.permissionMenus.find((unit) => unit.routeName === item.name)
        }
      })
      return isPush
    },
    /** 平铺权限 */
    tiledPermissionMenus(menus: Menus[]): Menus[] {
      const tiledMenus: Menus[] = []
      menus.forEach((item) => {
        let childMenus: Menus[] = []
        if (item.children && item.children.length > 0) {
          childMenus = this.tiledPermissionMenus(item.children)
        }
        childMenus.unshift(item)
        tiledMenus.push(...childMenus)
      })
      return tiledMenus
    }
  }
})
