/*
 * @Autor: ll
 * @Date: 2022-03-23 16:22:11
 * @Description: 导航守卫
 */

import Router from './index'
import Cookies from 'js-cookie'
import AppConfig from '@/library/config'
import PiniaStore from '@/library/pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 关闭加载微调器
NProgress.configure({ showSpinner: false })

/** 全局前置守卫 */
Router.beforeEach(async (to, _from, next) => {
  try {
    const store = PiniaStore()
    // 开启进度条
    NProgress.start()
    const token = Cookies.get(AppConfig.tokenName)
    const toName = <string>to.name
    // 是否合法登录
    if (token) {
      // 初始化项目信息
      if (!store.userInfo) {
        await store.initAppData()
      }
      // 根据路由别称判断跳转路径
      if (AppConfig.pageWhitelist.includes(toName) && toName !== '404' && store.appMenus && store.appMenus.length > 0) {
        next({ name: store.appMenus[0].name })
      } else {
        next()
      }
    } else {
      if (AppConfig.pageWhitelist.includes(toName)) {
        next()
      } else {
        next({ name: 'login' })
      }
    }
  } catch (error) {
    console.error(error)
    next()
  }
})

/** 全局后置钩子 */
Router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})
