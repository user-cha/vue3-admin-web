/*
 * @Autor: wu
 * @Date: 2022-04-01 15:17:58
 * @Description: 系统设置
 */

import { MockMethod } from 'vite-plugin-mock'
import AppConfig from '@/library/config'

export default [
  // 设置头像
  {
    url: `/${AppConfig.backendProjectName}/sso/user/set/avatar`,
    timeout: 100,
    method: 'put',
    response: () => {
      return {
        code: 0,
        data: null,
        msg: '请求成功'
      }
    }
  }
] as MockMethod[]
