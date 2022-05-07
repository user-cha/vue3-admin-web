/*
 * @Autor: wu
 * @Date: 2022-03-14 17:30:55
 * @Description: 类型声明
 */

/** 极速验证 */
export interface GeeRes {
  success: 0 | 1 //  0:失败  1:成功
  gt: string
  challenge: string
  newCaptcha: boolean
  gtServerStatus: 0 | 1 //  0:失败  1:成功
}

/** 表单登录 */
export interface SsoLoginForm {
  account: string
  password: string
  verification: string
  free: boolean
  geeTestChallenge: string
  geeTestValidate: string
  geeTestSecCode: string
  gtServerStatus: 0 | 1 // 0: '宕机' 1: '成功'
}

/** 登录返回结果 */
export interface SsoLoginRes {
  token: string
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initGeetest: any
  }
}
