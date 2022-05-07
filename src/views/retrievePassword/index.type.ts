/*
 * @Autor: ll
 * @Date: 2022-03-14 18:13:08
 * @Description: 类型声明
 */

/** 找回密码 */
export interface RetrievePwdForm {
  cellphone: string
  smsCode: string
  password: string
  repeatPwd: string
}

/** 发送短信 */
export interface SmsForm {
  /** 1: 注册, 2: 重置密码, 3: 登录, 4: 信息变更, 5: 身份验证, 7: 异地登陆 */
  type: 1 | 2 | 3 | 4 | 5 | 7
  /** 手机号码 */
  cellphone: number
}
