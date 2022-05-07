/*
 * @Autor: wu
 * @Date: 2022-03-11 15:38:20
 * @Description: 项目配置文件
 */

export default {
  /** 站点名称 */
  siteName: '****后台管理系统',
  /** 凭证名称 */
  tokenName: 'SSO_TOKEN',
  /** 是否开启账户权限 true: 开启 false: 关闭 */
  accountPermissionEnable: false,
  /** 是否开启极速验证 true: 开启 false: 关闭 */
  geetestEnable: false,
  /** 开启mock数据 true: 开启 false: 关闭 */
  mockEnabled: true,
  /** 请求超时时长(毫秒） */
  httpTimeOut: 5000,
  /** 请求成功code */
  httpSuccessCode: [0],
  /** 请求非法的code */
  httpIllegalCode: [1, 5, 7, 9],
  /** 页面白名单，不需要权限就可以访问的页面 */
  pageWhitelist: ['login', 'retrievePassword', '404'],
  /** 是否开启全局抛错 true: 开启全局吐丝抛错 false: 关闭全局吐丝抛错 */
  globalErrorEnable: true,
  /** 项目请求地址 (当前参数只用于本地调试) */
  baseUrl: 'http://172.30.200.34:8088',
  /** 后端项目名称 */
  backendProjectName: 'standard-admin'
}
