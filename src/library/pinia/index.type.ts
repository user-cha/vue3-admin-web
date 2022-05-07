/*
 * @Autor: ll
 * @Date: 2022-03-25 13:14:50
 * @Description: 类型声明
 */
import { RouteRecordRaw } from 'vue-router'
import { UserInfo, Menus } from '@/service/common.type'

export interface PiniaState {
  userInfo: UserInfo | null
  appMenus: RouteRecordRaw[] | null
  permissionMenus: Menus[] | null
}
