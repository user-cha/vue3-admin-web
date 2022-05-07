/*
 * @Autor: ll
 * @Date: 2022-03-14 14:13:53
 * @Description: 全局模块声明
 */
import { ElNotification } from 'element-plus'

declare global {
  interface Window {
    $Notify: typeof ElNotification
  }
  const $Notify: typeof ElNotification
}

export {}
