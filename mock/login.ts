/*
 * @Autor: wu
 * @Date: 2022-03-25 10:11:33
 * @Description: 登录
 */

import { MockMethod } from 'vite-plugin-mock'
import AppConfig from '@/library/config'

export default [
  {
    url: `/${AppConfig.backendProjectName}/sso/login`,
    timeout: 100,
    method: 'post',
    response: () => {
      return {
        code: 0,
        data: {
          token: 'TEST_7e30be4e72ca82564bd6ab9cbe17dc39daee4fc6'
        },
        msg: '请求成功'
      }
    }
  }
] as MockMethod[]
