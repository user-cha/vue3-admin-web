/*
 * @Autor: ll
 * @Date: 2022-03-22 17:00:59
 * @Description: 用户信息
 */

import { MockMethod } from 'vite-plugin-mock'
import AppConfig from '@/library/config'

export default [
  {
    url: `/${AppConfig.backendProjectName}/sso/user/info`,
    timeout: 100,
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          account: 'admin',
          avatar: 'https://nsntc-custom.oss-cn-shanghai.aliyuncs.com/standard-admin/gray/1648790588848-w190-h190.gif',
          cellphone: '17768090300',
          currentIp: '112.4.92.18',
          currentStamp: 1648014748826,
          description: '',
          email: '',
          gender: -1,
          id: '724ae0df369d45819449af1b040b53dd',
          logo: '',
          password: '710e1c38f7ae16f36b87e6f5aae1eb3a6964ce9f',
          previousIp: '112.4.92.18',
          previousStamp: 1648000672093,
          realName: '系统管理员',
          roleIds: ['0662ecee27cc49eea2cadac533173782'],
          roleNames: ['系统管理员'],
          tenantId: '32ffc42dc3854840af8ff2468be96a5e',
          menus: [
            {
              routeName: 'cms',
              children: [{ routeName: 'cmsSite' }]
            },
            {
              routeName: 'system',
              children: [
                {
                  routeName: 'systemPersonalInfo'
                },
                {
                  routeName: 'systemEnterprise'
                }
              ]
            }
          ]
        },
        msg: '请求成功'
      }
    }
  }
] as MockMethod[]
